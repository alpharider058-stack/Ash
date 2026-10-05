'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles, CheckCircle2, X } from 'lucide-react';
import { playHaptic } from '@/lib/audio';

interface DayWonModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
}

export const DayWonModal: React.FC<DayWonModalProps> = ({
  isOpen,
  onClose,
  streak
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#181c28] via-[#0f121a] to-[#07080b] border border-amber-400/50 p-6 text-center shadow-[0_0_50px_rgba(212,175,55,0.3)] space-y-4"
        >
          {/* Close corner button */}
          <button
            onClick={() => {
              playHaptic('light');
              onClose();
            }}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Trophy Crest */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-amber-400/40"
            />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-900/60 border border-amber-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <Trophy className="w-10 h-10 text-amber-300" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
              MISIÓN CUMPLIDA · DÍA CONQUISTADO
            </span>
            <h2 className="text-2xl font-black tracking-wide text-white uppercase gold-gradient-text">
              ¡DÍA GANADO!
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-xs mx-auto">
              Has cumplido cada uno de tus innegociables. Hoy no cediste ni un solo milímetro a la pereza. Tu racha se eleva a <span className="text-amber-300 font-bold">{streak} días</span>.
            </p>
          </div>

          {/* XP Bonus Tag */}
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">
              +100 XP DE BONIFICACIÓN DIARIA
            </span>
          </div>

          <button
            onClick={() => {
              playHaptic('medium');
              onClose();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-extrabold text-xs uppercase tracking-widest active:scale-95 transition shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
          >
            Continuar Imparable
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
