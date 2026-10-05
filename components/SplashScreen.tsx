'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playHaptic } from '@/lib/audio';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'drawing' | 'text' | 'exit'>('drawing');

  useEffect(() => {
    playHaptic('light');

    const textTimer = setTimeout(() => {
      setPhase('text');
    }, 700);

    const finishTimer = setTimeout(() => {
      setPhase('exit');
      setTimeout(onComplete, 400);
    }, 2300);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setPhase('exit');
    setTimeout(onComplete, 150);
  };

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          onClick={handleSkip}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080b] p-6 text-center select-none cursor-pointer"
        >
          {/* Subtle Ambient Golden Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_60%)] pointer-events-none" />

          {/* Logo Crest with SVG Drawing animation */}
          <div className="relative mb-8 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-28 h-28 flex items-center justify-center"
            >
              {/* Outer Golden Aura Ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.2, 0.6, 0.3], scale: [0.9, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border border-amber-500/30 blur-[2px]"
              />

              {/* ASCEND Emblem SVG */}
              <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                <defs>
                  <linearGradient id="splashGold" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="50%" stopColor="#fff3b0" />
                    <stop offset="100%" stopColor="#d4af37" />
                  </linearGradient>
                </defs>

                {/* Animated Rising Chevron / Spearhead */}
                <motion.polygon
                  points="50,15 22,78 35,78 50,42 65,78 78,78"
                  fill="url(#splashGold)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />

                {/* Inner Core Accent */}
                <motion.polygon
                  points="50,26 38,76 50,66 62,76"
                  fill="#07080b"
                  stroke="url(#splashGold)"
                  strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />

                {/* Apex Spark */}
                <motion.circle
                  cx="50"
                  cy="15"
                  r="2.5"
                  fill="#ffffff"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                />
              </svg>
            </motion.div>
          </div>

          {/* Title and Staggered Subtitle */}
          <div className="space-y-3 z-10 max-w-sm">
            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl font-extrabold tracking-[0.25em] gold-gradient-text uppercase"
            >
              ASCEND
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="space-y-1"
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-amber-200/90 uppercase">
                NO NEGOCIES CONTIGO MISMO
              </p>
              <p className="text-[11px] text-zinc-500 font-light tracking-wide">
                Mentalidad Ganadora & Dominio Personal
              </p>
            </motion.div>
          </div>

          {/* Micro Loading Progress Line */}
          <div className="absolute bottom-16 w-32 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500"
            />
          </div>

          {/* Tap to skip hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 text-[10px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Toca para continuar
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
