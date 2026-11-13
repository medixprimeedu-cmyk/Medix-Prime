import React, { useRef, useState, useEffect } from 'react';
import { JourneyCardData } from '../types/cardTypes';
import { UnifiedCardCanvas } from './card/UnifiedCardCanvas';

interface JourneyCardProps {
  data: JourneyCardData;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const JourneyCard: React.FC<JourneyCardProps> = ({
  data,
  cardRef,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setScale(containerRef.current.clientWidth / 1080);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={cardRef || containerRef}
      id="journey-card-canvas"
      className={`relative w-full aspect-[9/16] max-w-[420px] rounded-[28px] overflow-hidden select-none border-4 border-[#2B1055]/15 shadow-2xl ${className}`}
    >
      <div
        style={{
          width: 1080,
          height: 1920,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <UnifiedCardCanvas data={data} themeId="original" />
      </div>
    </div>
  );
};
