'use client';

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Trophy, 
  Flame, 
  Timer, 
  Award, 
  Download, 
  Upload, 
  ScrollText, 
  Bell, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { RANKS, getRankFromXp } from '@/lib/store';
import { playHaptic } from '@/lib/audio';

interface ProfileRankViewProps {
  profile: UserProfile;
  onOpenManifestoModal: () => void;
  onOpenNotifications: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

export const ProfileRankView: React.FC<ProfileRankViewProps> = ({
  profile,
  onOpenManifestoModal,
  onOpenNotifications,
  onExportData,
  onImportData
}) => {
  const currentRank = getRankFromXp(profile.xp);
  const nextRank = RANKS.find((r) => r.level === (currentRank.level + 1)) || null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // XP Progress towards next rank
  const xpInCurrentRank = profile.xp - currentRank.minXp;
  const xpNeededForNext = nextRank ? nextRank.minXp - currentRank.minXp : 1000;
  const rankProgress = nextRank 
    ? Math.min(100, Math.max(0, (xpInCurrentRank / xpNeededForNext) * 100))
    : 100;

  // Total Focus Minutes
  const totalFocusMinutes = profile.focusSessions?.reduce((acc, s) => acc + s.durationMinutes, 0) || 0;
  const focusHours = (totalFocusMinutes / 60).toFixed(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
    }
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Current Rank Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161a25] via-[#0f121a] to-[#0a0c12] p-6 border border-amber-500/30 text-center shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8)]"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-950/60 border border-amber-400/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
          <Shield className="w-10 h-10 text-amber-400" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400/80 uppercase">
            RANGO {currentRank.level} DE 5
          </span>
          <h1 className="text-2xl font-black tracking-wide text-white uppercase gold-gradient-text">
            {currentRank.title}
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            {currentRank.subtitle}
          </p>
        </div>

        {/* XP Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>{profile.xp} XP</span>
            <span>{nextRank ? `Meta: ${nextRank.minXp} XP (${nextRank.title})` : 'RANGO MÁXIMO'}</span>
          </div>

          <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden p-[1px] border border-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rankProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 rounded-full shadow-[0_0_10px_#f59e0b]"
            />
          </div>
        </div>

        <blockquote className="mt-4 pt-4 border-t border-white/5 text-[11px] italic text-zinc-400">
          &ldquo;{currentRank.quote}&rdquo;
        </blockquote>
      </motion.div>

      {/* 4 Core Quantitative Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Días Ganados */}
        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Días Ganados</span>
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {profile.daysWonCount}
          </p>
          <span className="text-[10px] text-zinc-500">100% de hábitos</span>
        </div>

        {/* Racha Actual / Mejor */}
        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Racha Actual</span>
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {profile.currentStreak} <span className="text-xs font-normal text-zinc-400">días</span>
          </p>
          <span className="text-[10px] text-zinc-500">Récord: {profile.bestStreak} días</span>
        </div>

        {/* Horas de Enfoque */}
        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>Horas de Enfoque</span>
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {focusHours}h
          </p>
          <span className="text-[10px] text-zinc-500">{totalFocusMinutes} min acumulados</span>
        </div>

        {/* Victorias Totales */}
        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Victorias</span>
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {profile.victories.length}
          </p>
          <span className="text-[10px] text-zinc-500">Inmortalizadas</span>
        </div>
      </div>

      {/* Personal Identity Manifesto Card */}
      <div
        onClick={() => {
          playHaptic('light');
          onOpenManifestoModal();
        }}
        className="cursor-pointer group p-4 rounded-xl bg-[#0e1017] border border-zinc-800 hover:border-amber-500/30 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ScrollText className="w-4 h-4 text-amber-400" />
            <span>Mi Manifiesto Personal</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
        </div>
        <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
          &ldquo;{profile.personalManifesto}&rdquo;
        </p>
      </div>

      {/* Notifications Configuration Link */}
      <button
        onClick={() => {
          playHaptic('light');
          onOpenNotifications();
        }}
        className="w-full p-4 rounded-xl bg-[#0e1017] border border-zinc-800 hover:border-amber-500/30 transition-all flex items-center justify-between text-left active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Recordatorios de Disciplina</h2>
            <p className="text-[11px] text-zinc-400">
              Horarios: Mañana ({profile.notifications.morningTime}), Mediodía ({profile.notifications.noonTime}), Noche ({profile.notifications.nightTime})
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-500" />
      </button>

      {/* Data Backup & Restore */}
      <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800/80 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Copia de Seguridad y Datos Locales
        </h2>
        <p className="text-[11px] text-zinc-500">
          Tus datos se guardan exclusivamente en este dispositivo (100% privados y offline). Exporta una copia para no perder tu progreso.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              playHaptic('light');
              onExportData();
            }}
            className="min-h-[40px] px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar JSON</span>
          </button>

          <button
            onClick={() => {
              playHaptic('light');
              fileInputRef.current?.click();
            }}
            className="min-h-[40px] px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar JSON</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
