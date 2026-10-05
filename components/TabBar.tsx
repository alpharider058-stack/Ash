'use client';

import React from 'react';
import { Compass, CheckCircle2, Timer, Shield } from 'lucide-react';
import { TabType } from '@/lib/types';
import { playHaptic } from '@/lib/audio';

interface TabBarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  completedHabitsCount: number;
  totalHabitsCount: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  currentTab,
  onChangeTab,
  completedHabitsCount,
  totalHabitsCount
}) => {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Inicio', icon: Compass },
    { id: 'habits', label: 'Hábitos', icon: CheckCircle2 },
    { id: 'focus', label: 'Enfoque', icon: Timer },
    { id: 'profile', label: 'Rango', icon: Shield }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#07080b]/92 backdrop-blur-xl border-t border-amber-500/15 pb-safe transition-all">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playHaptic('light');
                onChangeTab(tab.id);
              }}
              className="relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-transform active:scale-90"
            >
              {/* Active Indicator Top Glow Line */}
              {isActive && (
                <div className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#f59e0b]" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                />

                {/* Badge for habits progress */}
                {tab.id === 'habits' && totalHabitsCount > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2 px-1 text-[9px] font-bold rounded-full tabular-nums ${
                      completedHabitsCount === totalHabitsCount
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-amber-500/80 text-black'
                    }`}
                  >
                    {completedHabitsCount}/{totalHabitsCount}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 tracking-tight font-medium transition-colors ${
                  isActive ? 'text-amber-300 font-semibold' : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
