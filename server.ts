import 'dotenv/config';
import crypto from 'crypto';
import fs from 'fs/promises';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, '.data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');

interface StoredStudentRecord {
  name: string;
  studentClass: 'SSC' | 'HSC';
  institution: string;
  phone: string;
  pinSalt: string;
  pinHash: string;
  createdAt: string;
  updatedAt: string;
}

function toAsciiDigits(raw: string): string {
  return raw.replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
}

function normalizeBdPhone(raw: string): string | null {
  const cleaned = toAsciiDigits(raw).replace(/[\s\-()]/g, '');
  const withoutPrefix = cleaned.replace(/^\+88/, '').replace(/^88/, '');
  if (/^01[3-9]\d{8}$/.test(withoutPrefix)) {
    return withoutPrefix;
  }
  return null;
}

function normalizePin(raw: string): string | null {
  const cleaned = toAsciiDigits(raw).replace(/\s+/g, '');
  if (/^\d{4,6}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

function hashPin(pin: string, salt?: string): { salt: string; hash: string } {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(pin, usedSalt, 32).toString('hex');
  return { salt: usedSalt, hash: derived };
}

function verifyPin(pin: string, salt: string, storedHash: string): boolean {
  const { hash } = hashPin(pin, salt);
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(storedHash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function readStudentsStore(): Promise<StoredStudentRecord[]> {
  try {
    const raw = await fs.readFile(STUDENTS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredStudentRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeStudentsStore(records: StoredStudentRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STUDENTS_FILE, JSON.stringify(records, null, 2), 'utf8');
}

async function sendTelegramNotification(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!botToken || !chatId) return false;

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (tgResponse.ok) {
      const tgJson = (await tgResponse.json()) as { ok?: boolean };
      return Boolean(tgJson.ok);
    }
    console.error('Telegram API responded with status:', tgResponse.status);
    return false;
  } catch (tgErr) {
    console.error('Telegram forward error:', tgErr);
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Register (or update) a student with Name, Class, Institution, Mobile & PIN
  app.post('/api/student-entry', async (req, res) => {
    try {
      const { name, studentClass, institution, phone, pin, mode } = req.body ?? {};

      const cleanName = typeof name === 'string' ? name.trim() : '';
      const cleanClass = typeof studentClass === 'string' ? studentClass.trim().toUpperCase() : '';
      const cleanInstitution = typeof institution === 'string' ? institution.trim() : '';
      const normalizedPhone = typeof phone === 'string' ? normalizeBdPhone(phone) : null;
      const normalizedPin = typeof pin === 'string' ? normalizePin(pin) : null;
      const isUpdateMode = mode === 'update';

      if (cleanName.length < 2) {
        res.status(400).json({ ok: false, error: 'অনুগ্রহ করে শিক্ষার্থীর সঠিক নাম লিখুন।' });
        return;
      }
      if (cleanClass !== 'SSC' && cleanClass !== 'HSC') {
        res.status(400).json({ ok: false, error: 'অনুগ্রহ করে শ্রেণী (SSC অথবা HSC) নির্বাচন করুন।' });
        return;
      }
      if (cleanInstitution.length < 2) {
        res.status(400).json({ ok: false, error: 'অনুগ্রহ করে শিক্ষা প্রতিষ্ঠানের সঠিক নাম লিখুন।' });
        return;
      }
      if (!normalizedPhone) {
        res.status(400).json({ ok: false, error: 'সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)।' });
        return;
      }
      if (!normalizedPin) {
        res.status(400).json({ ok: false, error: 'অনুগ্রহ করে ৪ থেকে ৬ ডিজিটের সংখ্যায় পিন নাম্বার দিন।' });
        return;
      }

      const students = await readStudentsStore();
      const existingIndex = students.findIndex((s) => s.phone === normalizedPhone);

      if (existingIndex >= 0 && !isUpdateMode) {
        res.status(409).json({
          ok: false,
          code: 'ALREADY_REGISTERED',
          error: 'এই মোবাইল নাম্বারটি ইতোমধ্যে নিবন্ধিত। ‘লগইন’ সেক্টর থেকে মোবাইল নাম্বার ও পিন দিয়ে প্রবেশ করুন।',
        });
        return;
      }

      const { salt, hash } = hashPin(normalizedPin);
      const nowIso = new Date().toISOString();

      const record: StoredStudentRecord = {
        name: cleanName,
        studentClass: cleanClass,
        institution: cleanInstitution,
        phone: normalizedPhone,
        pinSalt: salt,
        pinHash: hash,
        createdAt: existingIndex >= 0 ? students[existingIndex].createdAt : nowIso,
        updatedAt: nowIso,
      };

      if (existingIndex >= 0) {
        students[existingIndex] = record;
      } else {
        students.push(record);
      }

      await writeStudentsStore(students);

      const timestamp = new Intl.DateTimeFormat('bn-BD', {
        timeZone: 'Asia/Dhaka',
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date());

      const message = [
        isUpdateMode
          ? '🔄 শিক্ষার্থী তথ্য হালনাগাদ — MEDIX PRIME'
          : '🎓 নতুন শিক্ষার্থী রেজিস্ট্রেশন — MEDIX PRIME',
        '',
        `👤 শিক্ষার্থীর নাম: ${cleanName}`,
        `📚 শ্রেণী: ${cleanClass}`,
        `🏫 শিক্ষা প্রতিষ্ঠান: ${cleanInstitution}`,
        `📱 মোবাইল নাম্বার: ${normalizedPhone}`,
        `🔐 পিন নিরাপত্তা: সক্রিয় (${normalizedPin.length} ডিজিট)`,
        `🕒 সময়: ${timestamp}`,
      ].join('\n');

      const telegramSynced = await sendTelegramNotification(message);

      res.json({
        ok: true,
        telegramSynced,
        student: {
          name: record.name,
          studentClass: record.studentClass,
          institution: record.institution,
          phone: record.phone,
          enteredAt: record.updatedAt,
        },
      });
    } catch (err) {
      console.error('Student entry route error:', err);
      res.status(500).json({ ok: false, error: 'তথ্য প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' });
    }
  });

  // Login for previously registered students using ONLY Mobile Number & PIN
  app.post('/api/student-login', async (req, res) => {
    try {
      const { phone, pin } = req.body ?? {};
      const normalizedPhone = typeof phone === 'string' ? normalizeBdPhone(phone) : null;
      const normalizedPin = typeof pin === 'string' ? normalizePin(pin) : null;

      if (!normalizedPhone) {
        res.status(400).json({ ok: false, error: 'সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নাম্বার লিখুন।' });
        return;
      }
      if (!normalizedPin) {
        res.status(400).json({ ok: false, error: 'সঠিক ৪ থেকে ৬ ডিজিটের পিন নাম্বার লিখুন।' });
        return;
      }

      const students = await readStudentsStore();
      const student = students.find((s) => s.phone === normalizedPhone);

      if (!student) {
        res.status(401).json({
          ok: false,
          error: 'এই মোবাইল নাম্বারটি নিবন্ধিত নয়। অনুগ্রহ করে আগে ‘রেজিস্ট্রেশন’ সম্পন্ন করুন।',
        });
        return;
      }

      if (!verifyPin(normalizedPin, student.pinSalt, student.pinHash)) {
        res.status(401).json({
          ok: false,
          error: 'পিন নাম্বারটি সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।',
        });
        return;
      }

      res.json({
        ok: true,
        student: {
          name: student.name,
          studentClass: student.studentClass,
          institution: student.institution,
          phone: student.phone,
          enteredAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Student login route error:', err);
      res.status(500).json({ ok: false, error: 'লগইন যাচাইকরণে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    }
  });

  // Forward student feedback & suggestions directly to Telegram Bot
  app.post('/api/feedback', async (req, res) => {
    try {
      const { category, message, studentName, studentClass, institution, phone } = req.body ?? {};

      const cleanCategory =
        typeof category === 'string' && category.trim() ? category.trim() : 'মতামত ও পরামর্শ';
      const cleanMessage = typeof message === 'string' ? message.trim() : '';
      const cleanName = typeof studentName === 'string' ? studentName.trim() : '';
      const cleanClass = typeof studentClass === 'string' ? studentClass.trim() : '';
      const cleanInstitution = typeof institution === 'string' ? institution.trim() : '';
      const cleanPhone = typeof phone === 'string' ? phone.trim() : '';

      if (cleanMessage.length < 5) {
        res.status(400).json({
          ok: false,
          error: 'অনুগ্রহ করে অন্তত ৫ অক্ষরের একটি স্পষ্ট মতামত বা পরামর্শ লিখুন।',
        });
        return;
      }

      if (cleanMessage.length > 1200) {
        res.status(400).json({
          ok: false,
          error: 'মতামত বা পরামর্শ ১২০০ অক্ষরের মধ্যে সংক্ষিপ্ত রাখুন।',
        });
        return;
      }

      const timestamp = new Intl.DateTimeFormat('bn-BD', {
        timeZone: 'Asia/Dhaka',
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date());

      const telegramLines = [
        '💬 নতুন মতামত ও পরামর্শ — MEDIX PRIME',
        '',
        `📌 ধরন: ${cleanCategory}`,
        cleanName ? `👤 শিক্ষার্থী: ${cleanName}${cleanClass ? ` (${cleanClass})` : ''}` : '',
        cleanInstitution ? `🏫 প্রতিষ্ঠান: ${cleanInstitution}` : '',
        cleanPhone ? `📱 মোবাইল: ${cleanPhone}` : '',
        '',
        `📝 বার্তা:\n${cleanMessage}`,
        '',
        `🕒 সময়: ${timestamp}`,
      ].filter((line, index, arr) => {
        // Keep intentional blank spacer lines (index 1, 6, 8) but drop empty optional metadata
        if (index === 1 || index === 6 || index === 8) return true;
        return line.length > 0 || (arr[index - 1] !== '' && index < 2);
      });

      const telegramSynced = await sendTelegramNotification(telegramLines.join('\n'));

      res.json({
        ok: true,
        telegramSynced,
      });
    } catch (err) {
      console.error('Feedback route error:', err);
      res.status(500).json({
        ok: false,
        error: 'মতামত পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MEDIX PRIME server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
