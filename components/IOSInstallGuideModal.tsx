'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share, PlusSquare, X, Check } from 'lucide-react';
import { playHaptic } from '@/lib/audio';

interface IOSInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm rounded-3xl bg-[#0d0f17] border border-amber-500/40 p-6 text-center shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-4"
        >
          <button
            onClick={() => {
              playHaptic('light');
              onClose();
            }}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300">
            <Share className="w-7 h-7 text-amber-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Instalar ASCEND en tu iPhone
            </h3>
            <p className="text-xs text-zinc-400">
              Disfruta de la app nativa a pantalla completa y sin barras del navegador.
            </p>
          </div>

          <div className="text-left space-y-3 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <p>
                Toca el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-blue-400" /> en la barra inferior de Safari.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <p>
                Desliza hacia abajo y selecciona <strong>Añadir a pantalla de inicio</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-zinc-200" />.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <p>
                Toca <strong>Añadir</strong> en la esquina superior derecha. ¡Listo!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playHaptic('light');
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider active:scale-95 transition"
          >
            Entendido
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
