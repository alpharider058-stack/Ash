'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollText, X, Check, RotateCcw } from 'lucide-react';
import { playHaptic } from '@/lib/audio';

interface ManifestoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentManifesto: string;
  onSaveManifesto: (newManifesto: string) => void;
}

const DEFAULT_TEMPLATE = 'Soy el arquitecto de mi propio destino. No busco excusas, busco resultados. Mi disciplina es inquebrantable, mi mente es invulnerable y mis estándares son absolutos. Cada día es una conquista.';

export const ManifestoEditModal: React.FC<ManifestoEditModalProps> = ({
  isOpen,
  onClose,
  currentManifesto,
  onSaveManifesto
}) => {
  const [manifesto, setManifesto] = useState(currentManifesto || DEFAULT_TEMPLATE);

  if (!isOpen) return null;

  const handleSave = () => {
    playHaptic('medium');
    onSaveManifesto(manifesto.trim());
    onClose();
  };

  const handleRestoreDefault = () => {
    playHaptic('light');
    setManifesto(DEFAULT_TEMPLATE);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-[#0d0f17] border border-amber-500/30 p-5 sm:p-6 text-left shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Mi Manifiesto Personal
              </h2>
            </div>

            <button
              onClick={() => {
                playHaptic('light');
                onClose();
              }}
              className="text-zinc-500 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-zinc-400">
            Define tu código de honor inquebrantable. Estas son las palabras con las que te juzgas a ti mismo al final de cada jornada.
          </p>

          <textarea
            rows={5}
            value={manifesto}
            onChange={(e) => setManifesto(e.target.value)}
            placeholder="Escribe tu manifiesto personal..."
            className="w-full p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleRestoreDefault}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-300 transition-colors py-1 px-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Plantilla original</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="py-2.5 px-6 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider active:scale-95 transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Guardar Manifiesto</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
