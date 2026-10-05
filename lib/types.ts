export type HabitCategory = 'disciplina' | 'foco' | 'cuerpo' | 'mente' | 'caracter';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  streak: number;
  completedDates: string[]; // YYYY-MM-DD format
  active: boolean;
  createdAt: number;
}

export type VictoryCategory = 'fuerza' | 'disciplina' | 'trabajo' | 'mentalidad' | 'superacion' | 'foco';

export interface Victory {
  id: string;
  title: string;
  category: VictoryCategory;
  date: string; // YYYY-MM-DD
  timestamp: number;
  notes?: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  timestamp: number;
  date: string;
  label: string;
}

export type RankLevel = 1 | 2 | 3 | 4 | 5;

export interface RankInfo {
  level: RankLevel;
  title: string;
  subtitle: string;
  minXp: number;
  maxXp: number;
  quote: string;
}

export interface UserProfile {
  name: string;
  personalManifesto: string;
  habits: Habit[];
  victories: Victory[];
  focusSessions: FocusSession[];
  xp: number;
  daysWonCount: number;
  wonDates: string[]; // Dates where all habits were completed
  currentStreak: number;
  bestStreak: number;
  soundEnabled: boolean;
  notifications: {
    morning: boolean;
    noon: boolean;
    night: boolean;
    morningTime: string;
    noonTime: string;
    nightTime: string;
  };
  lastActiveDate: string;
}

export type TabType = 'home' | 'habits' | 'focus' | 'profile';
