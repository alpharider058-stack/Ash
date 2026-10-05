'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Award, 
  Trash2, 
  Flame, 
  Check, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Victory, VictoryCategory } from '@/lib/types';
import { playVictorySound, playHaptic } from '@/lib/audio';
import { triggerGoldenBurst } from '@/lib/particles';
import { getTodayString } from '@/lib/store';

interface VictoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  victories: Victory[];
  onAddVictory: (title: string, category: VictoryCategory, notes?: string) => void;
  onDeleteVictory: (victoryId: string) => void;
  soundEnabled: boolean;
}

export const VictoriesModal: React.FC<VictoriesModalProps> = ({
  isOpen,
  onClose,
  victories,
  onAddVictory,
  onDeleteVictory,
  soundEnabled
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<VictoryCategory>('disciplina');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    playVictorySound(soundEnabled);
    triggerGoldenBurst();
    onAddVictory(title.trim(), category, notes.trim() || undefined);

    setTitle('');
    setNotes('');
  };

  const categories: { id: VictoryCategory; label: string }[] = [
    { id: 'disciplina', label: 'Disciplina' },
    { id: 'fuerza', label: 'Fuerza / Físico' },
    { id: 'trabajo', label: 'Trabajo / Foco' },
    { id: 'mentalidad', label: 'Mentalidad' },
    { id: 'superacion', label: 'Superación' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-[#0b0d14] border border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Registro de Victorias
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Inmortaliza cada avance. Lo que no se registra, se olvida.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playHaptic('light');
                onClose();
              }}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Form + Timeline */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-6">
            {/* Quick Capture Card */}
            <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-[#12151f] border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Nueva Victoria
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  +30 XP
                </span>
              </div>

              <input
                type="text"
                placeholder="¿Qué victoria conquistaste hoy? (Grande o pequeña)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />

              <input
                type="text"
                placeholder="Detalle o lección aprendida (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
              />

              {/* Category selector */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                      category === cat.id
                        ? 'bg-amber-500 text-black font-bold shadow-sm'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!title.trim()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs uppercase tracking-wider disabled:opacity-40 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Inmortalizar Victoria</span>
              </button>
            </form>

            {/* Timeline of Past Victories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
                <span>Historial de Conquistas</span>
                <span className="font-mono text-zinc-500">{victories.length} registradas</span>
              </div>

              {victories.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  Aún no has registrado victorias. Escribe la primera arriba.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {victories.map((vic) => (
                    <div
                      key={vic.id}
                      className="p-3.5 rounded-xl bg-[#0e1017] border border-zinc-800/80 flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                          <span className="capitalize font-semibold text-amber-400/90">{vic.category}</span>
                          <span>·</span>
                          <span>{vic.date}</span>
                        </div>
                        <p className="text-sm font-semibold text-zinc-100">
                          {vic.title}
                        </p>
                        {vic.notes && (
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {vic.notes}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          playHaptic('medium');
                          onDeleteVictory(vic.id);
                        }}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800/60 transition opacity-80 group-hover:opacity-100"
                        title="Eliminar victoria"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
