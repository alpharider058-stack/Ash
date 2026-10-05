'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, X, ChevronUp } from 'lucide-react';
import { RankInfo } from '@/lib/types';
import { playHaptic } from '@/lib/audio';

interface RankUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newRank: RankInfo;
}

export const RankUpModal: React.FC<RankUpModalProps> = ({
  isOpen,
  onClose,
  newRank
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 18, stiffness: 280 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1c1f2e] via-[#10131d] to-[#07080b] border border-amber-400/50 p-6 text-center shadow-[0_0_60px_rgba(212,175,55,0.35)] space-y-4"
        >
          {/* Rank Badge */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-xl"
            />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-950/70 border border-amber-400/60 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <Shield className="w-10 h-10 text-amber-300" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full uppercase">
              <ChevronUp className="w-3.5 h-3.5 stroke-[3]" />
              SUBIDA DE RANGO
            </div>
            <h2 className="text-3xl font-black tracking-wide text-white uppercase gold-gradient-text">
              {newRank.title}
            </h2>
            <p className="text-xs text-amber-200/90 font-medium">
              {newRank.subtitle}
            </p>
          </div>

          <blockquote className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs italic text-zinc-300 leading-relaxed">
            &ldquo;{newRank.quote}&rdquo;
          </blockquote>

          <button
            onClick={() => {
              playHaptic('medium');
              onClose();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-extrabold text-xs uppercase tracking-widest active:scale-95 transition shadow-[0_0_25px_rgba(212,175,55,0.3)] cursor-pointer"
          >
            Aceptar Mi Nuevo Rango
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
