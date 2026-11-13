import React, { useEffect, useRef } from 'react';
import { Atom } from 'lucide-react';

export const ScienceWorldAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1200);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 1200;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    // Simulation state
    let time = 0;

    // Bubbles for chemistry flask
    const bubbles = Array.from({ length: 22 }, () => ({
      x: 0,
      y: 0,
      radius: Math.random() * 3 + 1.2,
      speedY: Math.random() * 1.6 + 0.9,
      wobble: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    // Floating photons / field particles
    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 0.8,
      color: ['#00D2FF', '#CCFF00', '#A78BFA', '#F43F5E', '#FBBF24', '#38BDF8'][Math.floor(Math.random() * 6)],
    }));

    // Vapor particles emitting from flask
    const vapor = Array.from({ length: 16 }, () => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 0.9 + 0.6),
      size: Math.random() * 4 + 3,
      alpha: Math.random() * 0.5 + 0.2,
      life: Math.random() * 60,
    }));

    const render = () => {
      time += 0.022;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle scientific coordinate grid
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Floating Background Photons / Interstellar Field
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // SECTION A: ROTATING 3D ATOM (Near X = width * 0.16)
      const atomX = width * 0.16;
      const atomY = height * 0.5;
      const atomRadius = 56;

      // Outer glow field
      const atomGlow = ctx.createRadialGradient(atomX, atomY, 5, atomX, atomY, 70);
      atomGlow.addColorStop(0, 'rgba(204, 255, 0, 0.15)');
      atomGlow.addColorStop(1, 'rgba(0, 210, 255, 0)');
      ctx.fillStyle = atomGlow;
      ctx.beginPath();
      ctx.arc(atomX, atomY, 70, 0, Math.PI * 2);
      ctx.fill();

      // Nucleus
      ctx.beginPath();
      ctx.arc(atomX, atomY, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#CCFF00';
      ctx.shadowColor = '#CCFF00';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Protons/Neutrons clustered
      for (let i = 0; i < 5; i++) {
        const nx = atomX + Math.cos(time * 2.2 + i * 1.3) * 6;
        const ny = atomY + Math.sin(time * 2.2 + i * 1.3) * 6;
        ctx.beginPath();
        ctx.arc(nx, ny, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#38BDF8' : '#F43F5E';
        ctx.fill();
      }

      // 3 Electron Orbitals in 3D perspective
      const orbitalAngles = [0, Math.PI / 3, (2 * Math.PI) / 3];
      orbitalAngles.forEach((angle, idx) => {
        ctx.save();
        ctx.translate(atomX, atomY);
        ctx.rotate(angle + time * 0.2);

        // Ellipse orbit path
        ctx.beginPath();
        ctx.ellipse(0, 0, atomRadius, atomRadius * 0.38, 0, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 0 ? 'rgba(0, 210, 255, 0.55)' : idx === 1 ? 'rgba(204, 255, 0, 0.45)' : 'rgba(167, 139, 250, 0.5)';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Orbiting electron with glowing trail
        const eTime = time * 2.6 + idx * 2;
        const ex = Math.cos(eTime) * atomRadius;
        const ey = Math.sin(eTime) * (atomRadius * 0.38);

        ctx.beginPath();
        ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = idx === 0 ? '#00D2FF' : idx === 1 ? '#CCFF00' : '#FFFFFF';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      // SECTION B: CHEMISTRY ERLENMEYER FLASK & REALISTIC BUBBLES (Near X = width * 0.38)
      const flaskX = width * 0.38;
      const flaskY = height * 0.52;
      const flaskW = 75;
      const flaskH = 96;

      // Flask outline
      ctx.save();
      ctx.beginPath();
      // Neck
      ctx.moveTo(flaskX - 12, flaskY - flaskH * 0.5);
      ctx.lineTo(flaskX - 12, flaskY - flaskH * 0.2);
      // Body
      ctx.lineTo(flaskX - flaskW * 0.5, flaskY + flaskH * 0.45);
      ctx.arcTo(flaskX - flaskW * 0.5, flaskY + flaskH * 0.5, flaskX - flaskW * 0.5 + 8, flaskY + flaskH * 0.5, 8);
      ctx.lineTo(flaskX + flaskW * 0.5 - 8, flaskY + flaskH * 0.5);
      ctx.arcTo(flaskX + flaskW * 0.5, flaskY + flaskH * 0.5, flaskX + flaskW * 0.5, flaskY + flaskH * 0.45, 8);
      ctx.lineTo(flaskX + 12, flaskY - flaskH * 0.2);
      ctx.lineTo(flaskX + 12, flaskY - flaskH * 0.5);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Liquid with animated wavy meniscus
      ctx.save();
      ctx.clip();
      const liquidTop = flaskY + Math.sin(time * 3) * 3;
      ctx.beginPath();
      ctx.moveTo(flaskX - flaskW, liquidTop);
      for (let lx = flaskX - flaskW; lx <= flaskX + flaskW; lx += 8) {
        const ly = liquidTop + Math.sin((lx - flaskX) * 0.15 + time * 4) * 3;
        ctx.lineTo(lx, ly);
      }
      ctx.lineTo(flaskX + flaskW, flaskY + flaskH);
      ctx.lineTo(flaskX - flaskW, flaskY + flaskH);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, liquidTop, 0, flaskY + flaskH * 0.5);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.75)');
      grad.addColorStop(1, 'rgba(147, 51, 234, 0.88)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Effervescent Bubbles rising
      bubbles.forEach((b) => {
        if (b.y === 0 || b.y < liquidTop) {
          b.x = flaskX + (Math.random() - 0.5) * (flaskW * 0.6);
          b.y = flaskY + flaskH * 0.45;
        }
        b.y -= b.speedY;
        b.wobble += 0.05;
        const bx = b.x + Math.sin(b.wobble) * 2;

        ctx.beginPath();
        ctx.arc(bx, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(204, 255, 0, ${b.opacity})`;
        ctx.shadowColor = '#CCFF00';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();
      ctx.restore();

      // Rising Chemical Vapor/Gas from Flask
      vapor.forEach((v) => {
        if (v.y === 0 || v.y < flaskY - flaskH * 0.85 || v.alpha <= 0) {
          v.x = flaskX + (Math.random() - 0.5) * 10;
          v.y = flaskY - flaskH * 0.5;
          v.alpha = Math.random() * 0.4 + 0.2;
          v.size = Math.random() * 3 + 2;
        }
        v.x += v.vx + Math.sin(time * 3) * 0.2;
        v.y += v.vy;
        v.alpha -= 0.006;
        v.size += 0.08;

        ctx.beginPath();
        ctx.arc(v.x, v.y, Math.max(1, v.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${Math.max(0, v.alpha)})`;
        ctx.fill();
      });

      // SECTION C: 3D ROTATING DNA DOUBLE HELIX (Near X = width * 0.62)
      const dnaX = width * 0.62;
      const dnaY = height * 0.5;
      const dnaLength = 155;
      const dnaAmplitude = 27;
      const steps = 15;

      for (let i = 0; i < steps; i++) {
        const progress = (i / steps) * Math.PI * 2;
        const currentY = dnaY - dnaLength * 0.5 + (i / steps) * dnaLength;

        // 3D rotation projection
        const phase1 = progress + time * 1.8;
        const phase2 = phase1 + Math.PI;

        const x1 = dnaX + Math.cos(phase1) * dnaAmplitude;
        const x2 = dnaX + Math.cos(phase2) * dnaAmplitude;

        const z1 = Math.sin(phase1);
        const z2 = Math.sin(phase2);

        // Connecting Base Pair hydrogen rung
        ctx.beginPath();
        ctx.moveTo(x1, currentY);
        ctx.lineTo(x2, currentY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Node 1 (Strand A - Cyan/Sky)
        const size1 = 4.6 + z1 * 1.6;
        ctx.beginPath();
        ctx.arc(x1, currentY, Math.max(2, size1), 0, Math.PI * 2);
        ctx.fillStyle = z1 > 0 ? '#00D2FF' : '#0369A1';
        ctx.shadowColor = '#00D2FF';
        ctx.shadowBlur = z1 > 0 ? 10 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node 2 (Strand B - Lime/Gold)
        const size2 = 4.6 + z2 * 1.6;
        ctx.beginPath();
        ctx.arc(x2, currentY, Math.max(2, size2), 0, Math.PI * 2);
        ctx.fillStyle = z2 > 0 ? '#CCFF00' : '#65A30D';
        ctx.shadowColor = '#CCFF00';
        ctx.shadowBlur = z2 > 0 ? 10 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // SECTION D: ORBITING SATURN PLANETARY SYSTEM & OPTICS (Near X = width * 0.84)
      const planetX = width * 0.84;
      const planetY = height * 0.48;
      const planetRadius = 25;

      // Planet Sphere
      ctx.save();
      const pGrad = ctx.createRadialGradient(planetX - 6, planetY - 6, 2, planetX, planetY, planetRadius);
      pGrad.addColorStop(0, '#FDE047');
      pGrad.addColorStop(0.6, '#F59E0B');
      pGrad.addColorStop(1, '#92400E');
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Planetary Ring in 3D tilt
      ctx.translate(planetX, planetY);
      ctx.rotate(-0.35 + Math.sin(time * 0.4) * 0.05);

      ctx.beginPath();
      ctx.ellipse(0, 0, 54, 15, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, 62, 18, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(204, 255, 0, 0.45)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Orbiting moon satellite
      const moonAngle = time * 1.5;
      const mx = Math.cos(moonAngle) * 54;
      const my = Math.sin(moonAngle) * 15;
      ctx.beginPath();
      ctx.arc(mx, my, 3.8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#00D2FF';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Continuous Physics Wave Beam connecting across the bottom
      ctx.beginPath();
      ctx.moveTo(0, height * 0.85);
      for (let wx = 0; wx < width; wx += 8) {
        const wy = height * 0.85 + Math.sin(wx * 0.015 + time * 3) * 12 + Math.cos(wx * 0.03 - time) * 6;
        ctx.lineTo(wx, wy);
      }
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.3)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Continuous smooth loop (no pause button)
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#060D17] text-white pt-10 pb-8 border-t border-white/10 select-none">
      {/* Seamless Left-to-Right and Top-to-Bottom Gradient Fades */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#060D17] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#060D17] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#060D17] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#060D17] to-transparent pointer-events-none z-10" />

      {/* Section Header without any Pause Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] text-[11px] font-latin font-bold uppercase tracking-wider">
            <Atom className="w-3.5 h-3.5 animate-spin" />
            <span>REAL-TIME SCIENCE WORLD SIMULATION</span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>পদার্থ, রসায়ন ও জীববিজ্ঞানের গতিশীল বিস্ময়</span>
            <span className="text-[#CCFF00]">⚛️ 🧬 🧪</span>
          </h3>
          <p className="font-body text-xs text-gray-300">
            বাস্তবের মতো চলমান অণু-পরমাণু, ডিএনএ হেলিক্স ও রাসায়নিক বিক্রিয়া—যেখানে বিজ্ঞান ধরা দেয় জীবন্ত রূপে।
          </p>
        </div>
      </div>

      {/* The 60FPS Continuous Science Animation Canvas */}
      <div className="relative w-full h-[320px] sm:h-[360px] flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Informative Science Floating Badges */}
        <div className="absolute bottom-4 left-6 hidden md:flex items-center gap-2 text-[11px] font-latin font-bold text-cyan-300/80 bg-black/40 px-3 py-1 rounded-full border border-cyan-500/20 backdrop-blur-xs">
          <span>ATOM PERSPECTIVE</span>
        </div>
        <div className="absolute bottom-4 left-[34%] hidden md:flex items-center gap-2 text-[11px] font-latin font-bold text-emerald-300/80 bg-black/40 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-xs">
          <span>FLUID DYNAMICS & BUBBLES</span>
        </div>
        <div className="absolute bottom-4 left-[58%] hidden md:flex items-center gap-2 text-[11px] font-latin font-bold text-purple-300/80 bg-black/40 px-3 py-1 rounded-full border border-purple-500/20 backdrop-blur-xs">
          <span>DNA HELIX ROTATION</span>
        </div>
        <div className="absolute bottom-4 right-6 hidden md:flex items-center gap-2 text-[11px] font-latin font-bold text-amber-300/80 bg-black/40 px-3 py-1 rounded-full border border-amber-500/20 backdrop-blur-xs">
          <span>ORBITAL GRAVITATION</span>
        </div>
      </div>
    </section>
  );
};
