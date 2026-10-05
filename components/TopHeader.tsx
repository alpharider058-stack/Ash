'use client';

import React from 'react';
import { Flame, Volume2, VolumeX, Bell, Download } from 'lucide-react';
import { playHaptic } from '@/lib/audio';

interface TopHeaderProps {
  currentStreak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNotifications: () => void;
  onInstallClick?: () => void;
  canInstall?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentStreak,
  soundEnabled,
  onToggleSound,
  onOpenNotifications,
  onInstallClick,
  canInstall
}) => {
  return (
    <header className="sticky top-0 z-30 w-full pt-safe bg-[#07080b]/85 backdrop-blur-md border-b border-amber-500/10 transition-colors">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-900/40 border border-amber-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.2)]">
            <svg viewBox="0 0 100 100" className="w-4 h-4">
              <polygon points="50,15 25,78 37,78 50,45 63,78 75,78" fill="#d4af37" />
            </svg>
          </div>
          <span className="text-base font-extrabold tracking-[0.2em] gold-gradient-text uppercase">
            ASCEND
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Streak Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold tabular-nums"
            title="Racha de días de disciplina"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{currentStreak} {currentStreak === 1 ? 'día' : 'días'}</span>
          </div>

          {/* Install PWA Button if available */}
          {canInstall && onInstallClick && (
            <button
              onClick={() => {
                playHaptic('light');
                onInstallClick();
              }}
              aria-label="Instalar app"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 active:scale-95 transition"
              title="Instalar en pantalla de inicio"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              playHaptic('light');
              onToggleSound();
            }}
            aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/40 active:scale-95 transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* Notification Settings */}
          <button
            onClick={() => {
              playHaptic('light');
              onOpenNotifications();
            }}
            aria-label="Configurar recordatorios"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/40 active:scale-95 transition"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
