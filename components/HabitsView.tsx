'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Flame, 
  Plus, 
  Settings, 
  Trash2, 
  X, 
  Trophy,
  Activity,
  Brain,
  Zap,
  Target,
  Crown
} from 'lucide-react';
import { Habit, HabitCategory } from '@/lib/types';
import { playCheckmarkSound, playHaptic } from '@/lib/audio';
import { triggerGoldenBurst } from '@/lib/particles';

interface HabitsViewProps {
  habits: Habit[];
  soundEnabled: boolean;
  onToggleHabit: (habitId: string, eventTarget?: HTMLElement) => void;
  onAddHabit: (title: string, category: HabitCategory) => void;
  onDeleteHabit: (habitId: string) => void;
  todayWon: boolean;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  soundEnabled,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  todayWon
}) => {
  const [isManaging, setIsManaging] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<HabitCategory>('disciplina');

  const todayStr = new Date().toISOString().split('T')[0];
  const activeHabits = habits.filter((h) => h.active);
  const completedCount = activeHabits.filter((h) => h.completedDates.includes(todayStr)).length;

  const handleHabitClick = (habit: Habit, e: React.MouseEvent<HTMLButtonElement>) => {
    const isCompleted = habit.completedDates.includes(todayStr);
    const rect = e.currentTarget.getBoundingClientRect();

    if (!isCompleted) {
      playCheckmarkSound(soundEnabled);
      triggerGoldenBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
    } else {
      playHaptic('light');
    }

    onToggleHabit(habit.id, e.currentTarget);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    if (activeHabits.length >= 5) {
      alert('Máximo 5 hábitos innegociables permitidos para garantizar el foco.');
      return;
    }
    onAddHabit(newHabitTitle.trim(), newHabitCategory);
    setNewHabitTitle('');
  };

  const getCategoryIcon = (category: HabitCategory) => {
    switch (category) {
      case 'cuerpo':
        return <Activity className="w-3.5 h-3.5 text-amber-400" />;
      case 'mente':
        return <Brain className="w-3.5 h-3.5 text-amber-300" />;
      case 'foco':
        return <Target className="w-3.5 h-3.5 text-amber-400" />;
      case 'caracter':
        return <Crown className="w-3.5 h-3.5 text-amber-300" />;
      case 'disciplina':
      default:
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Innegociables
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono">
              {activeHabits.length}/5
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tus estándares diarios. No se negocian, se ejecutan.
          </p>
        </div>

        <button
          onClick={() => {
            playHaptic('light');
            setIsManaging(!isManaging);
          }}
          className={`min-h-[40px] px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
            isManaging
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{isManaging ? 'Listo' : 'Ajustar'}</span>
        </button>
      </div>

      {/* Day Won Banner if achieved */}
      {todayWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent border border-amber-500/30 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide uppercase">
                ¡DÍA GANADO!
              </p>
              <p className="text-xs text-amber-200/80">
                5 de 5 completados. Has dominado hoy.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
            +100 XP
          </span>
        </motion.div>
      )}

      {/* Habit Cards List */}
      <div className="space-y-3">
        {activeHabits.map((habit, index) => {
          const isCompleted = habit.completedDates.includes(todayStr);

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`relative overflow-hidden rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-gradient-to-r from-[#141b17] to-[#0d1210] border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]'
                  : 'bg-[#0e1017] border-zinc-800/80 hover:border-amber-500/20'
              }`}
            >
              <div className="p-4 flex items-center justify-between gap-3">
                {/* Left Category & Habit Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider text-zinc-400">
                      {getCategoryIcon(habit.category)}
                      {habit.category}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400/90 font-mono">
                      <Flame className="w-3 h-3 text-amber-400" />
                      {habit.streak} {habit.streak === 1 ? 'día' : 'días'}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-medium transition-all ${
                      isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-100 font-semibold'
                    }`}
                  >
                    {habit.title}
                  </h3>
                </div>

                {/* Right Interactive Spring Checkbox */}
                <div className="flex items-center gap-2 shrink-0">
                  {isManaging ? (
                    <button
                      onClick={() => {
                        playHaptic('medium');
                        onDeleteHabit(habit.id);
                      }}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-90 transition"
                      aria-label="Eliminar hábito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleHabitClick(habit, e)}
                      aria-label={isCompleted ? 'Marcar como incompleto' : 'Completar hábito'}
                      className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)] active:scale-90'
                          : 'bg-zinc-800/80 border border-zinc-700/60 text-transparent hover:border-amber-400/50 active:scale-95'
                      }`}
                    >
                      <motion.div
                        initial={false}
                        animate={isCompleted ? { scale: [0.8, 1.2, 1] } : { scale: 0.5 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </motion.div>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Manage / Add New Habit Drawer/Form */}
      <AnimatePresence>
        {isManaging && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-xl bg-[#12151e] border border-amber-500/30 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Añadir Nuevo Innegociable ({activeHabits.length}/5)
              </h2>
              <span className="text-[11px] text-zinc-500 font-mono">Máx 5 hábitos</span>
            </div>

            {activeHabits.length >= 5 ? (
              <p className="text-xs text-amber-300/80 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                Ya tienes los 5 hábitos permitidos. Elimina uno si deseas cambiarlo. La regla de los 5 garantiza disciplina de acero sin dispersión.
              </p>
            ) : (
              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Ej: 45 min de entrenamiento físico o pesas"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />

                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] text-zinc-400 mr-1">Área:</span>
                  {(['disciplina', 'foco', 'cuerpo', 'mente', 'caracter'] as HabitCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewHabitCategory(cat)}
                      className={`text-xs px-2.5 py-1 rounded-md capitalize transition-colors ${
                        newHabitCategory === cat
                          ? 'bg-amber-500 text-black font-semibold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!newHabitTitle.trim()}
                  className="w-full py-2.5 rounded-lg bg-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Añadir Hábito</span>
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
