'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  RotateCcw, 
  Award, 
  Plus, 
  ChevronRight, 
  ScrollText, 
  ShieldCheck, 
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { UserProfile, Victory } from '@/lib/types';
import { getQuoteForToday, getRandomQuote, QuoteItem } from '@/lib/quotes';
import { playHaptic } from '@/lib/audio';

interface HomeViewProps {
  profile: UserProfile;
  todayWon: boolean;
  onOpenVictoriesModal: () => void;
  onOpenManifestoModal: () => void;
  onNavigateToTab: (tab: 'habits' | 'focus' | 'profile') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  todayWon,
  onOpenVictoriesModal,
  onOpenManifestoModal,
  onNavigateToTab
}) => {
  const [dailyQuote, setDailyQuote] = useState<QuoteItem>(getQuoteForToday());

  // Dynamic greeting by hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Buenos días';
    if (hour >= 12 && hour < 18) return 'Buenas tardes';
    if (hour >= 18 && hour < 23) return 'Buenas noches';
    return 'Madrugada de forja';
  };

  const getSubGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Hoy no negocias. Sal al campo a conquistar.';
    if (hour >= 12 && hour < 18) return 'Mantén el ritmo implacable. Cero distracciones.';
    if (hour >= 18 && hour < 23) return 'Cierra el día con honor y registra tus victorias.';
    return 'El silencio de la noche es tu ventaja estratégica.';
  };

  // Select a past victory to remind the user of their greatness
  const pastVictory = React.useMemo<Victory | null>(() => {
    if (profile.victories && profile.victories.length > 0) {
      const day = new Date().getDate();
      const index = day % profile.victories.length;
      return profile.victories[index];
    }
    return null;
  }, [profile.victories]);

  const handleRefreshQuote = () => {
    playHaptic('light');
    setDailyQuote(getRandomQuote());
  };

  const activeHabits = profile.habits.filter((h) => h.active);
  const todayStr = new Date().toISOString().split('T')[0];
  const completedTodayCount = activeHabits.filter((h) => h.completedDates.includes(todayStr)).length;
  const progressPercent = activeHabits.length > 0 ? (completedTodayCount / activeHabits.length) * 100 : 0;

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Hero Greeting Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-1.5"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-400/90">
            {getGreeting()}, {profile.name}
          </p>
          <span className="text-[11px] text-zinc-500 font-medium">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {getSubGreeting()}
        </h1>
      </motion.div>

      {/* Main Daily Identity Manifesto Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131722] via-[#0f1118] to-[#0a0c12] p-6 border border-amber-500/25 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]"
      >
        {/* Subtle Ambient Radial Light */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] uppercase tracking-widest font-bold text-amber-300">
              Identidad del Día · {dailyQuote.theme}
            </span>
          </div>

          <button
            onClick={handleRefreshQuote}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-300 transition-colors py-1 px-2 rounded-lg hover:bg-white/5 active:scale-95"
            title="Cambiar frase de poder"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Otra frase</span>
          </button>
        </div>

        {/* The Power Statement */}
        <blockquote className="text-lg md:text-xl font-semibold leading-relaxed tracking-normal text-zinc-100 my-2">
          &ldquo;{dailyQuote.text}&rdquo;
        </blockquote>

        {/* Footer of card: Personal Manifesto trigger */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={() => {
              playHaptic('light');
              onOpenManifestoModal();
            }}
            className="flex items-center gap-2 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <ScrollText className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>Mi Manifiesto Personal</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
            ESTÁNDAR ASCEND
          </span>
        </div>
      </motion.div>

      {/* Quick Tactical Status: Innegociables & Streak */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        onClick={() => {
          playHaptic('light');
          onNavigateToTab('habits');
        }}
        className="cursor-pointer group rounded-xl bg-[#0e1017] p-4 border border-zinc-800/80 hover:border-amber-500/30 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                Innegociables de Hoy
              </h2>
              <p className="text-[11px] text-zinc-400">
                {todayWon ? '¡Día ganado! Misión cumplida.' : `${completedTodayCount} de ${activeHabits.length} completados`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
            <span>{Math.round(progressPercent)}%</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden mt-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`h-full rounded-full transition-all ${
              todayWon
                ? 'bg-gradient-to-r from-emerald-500 to-amber-400 shadow-[0_0_12px_#10b981]'
                : 'bg-gradient-to-r from-amber-600 to-amber-400'
            }`}
          />
        </div>
      </motion.div>

      {/* Random Past Victory Reminder */}
      {pastVictory && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="rounded-xl bg-[#0e1017]/80 p-4 border border-zinc-800/60 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
              Recordatorio de tu Grandeza
            </span>
          </div>

          <p className="text-sm font-medium text-zinc-200">
            &ldquo;{pastVictory.title}&rdquo;
          </p>

          {pastVictory.notes && (
            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
              {pastVictory.notes}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="capitalize">{pastVictory.category}</span>
            <span>{pastVictory.date}</span>
          </div>
        </motion.div>
      )}

      {/* Floating Action Button for Registering Victory */}
      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            playHaptic('medium');
            onOpenVictoriesModal();
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Inmortalizar Victoria de Hoy</span>
        </motion.button>
      </div>
    </div>
  );
};
