import { UserProfile, Habit, Victory, FocusSession, RankInfo, RankLevel } from './types';

export const RANKS: RankInfo[] = [
  {
    level: 1,
    title: 'Recluta',
    subtitle: 'La decisión de no conformarse',
    minXp: 0,
    maxXp: 250,
    quote: 'Todo imperio comienza con la decisión solitaria de dejar de ser débil.'
  },
  {
    level: 2,
    title: 'Aspirante',
    subtitle: 'La disciplina vence a la duda',
    minXp: 250,
    maxXp: 750,
    quote: 'Ya no actúas por impulso; tus hábitos comienzan a dictar tu realidad.'
  },
  {
    level: 3,
    title: 'Guerrero',
    subtitle: 'La consistencia como arma principal',
    minXp: 750,
    maxXp: 1800,
    quote: 'Tu palabra contigo mismo se ha vuelto sagrada. Rara vez fallas.'
  },
  {
    level: 4,
    title: 'Imparable',
    subtitle: 'Tus estándares son innegociables',
    minXp: 1800,
    maxXp: 3800,
    quote: 'La fricción que a otros quiebra a ti te alimenta. No hay vuelta atrás.'
  },
  {
    level: 5,
    title: 'Leyenda',
    subtitle: 'Maestría personal y dominio absoluto',
    minXp: 3800,
    maxXp: 10000,
    quote: 'Eres dueño total de tu mente, tu tiempo y tu destino. Has ascendido.'
  }
];

export function getRankFromXp(xp: number): RankInfo {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXp) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Ducha fría y activación corporal inmediata',
    category: 'cuerpo',
    streak: 3,
    completedDates: [],
    active: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'habit-2',
    title: '90 min de trabajo profundo sin distracciones',
    category: 'foco',
    streak: 2,
    completedDates: [],
    active: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'habit-3',
    title: 'Nutrición impecable: cero azúcar ni comida basura',
    category: 'disciplina',
    streak: 4,
    completedDates: [],
    active: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'habit-4',
    title: 'Lectura o estudio implacable (20 min)',
    category: 'mente',
    streak: 1,
    completedDates: [],
    active: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'habit-5',
    title: 'Revisión nocturna y registrar victorias del día',
    category: 'caracter',
    streak: 3,
    completedDates: [],
    active: true,
    createdAt: Date.now() - 86400000 * 3
  }
];

export const INITIAL_VICTORIES: Victory[] = [
  {
    id: 'vic-1',
    title: 'Completé el bloque de trabajo más pesado sin tocar el móvil',
    category: 'foco',
    date: getYesterdayString(),
    timestamp: Date.now() - 86400000,
    notes: 'Puse el teléfono en otra habitación y produje el doble que toda la semana.'
  },
  {
    id: 'vic-2',
    title: 'Elegí entrenar duro en lugar de quedarme en la cama buscando excusas',
    category: 'disciplina',
    date: getYesterdayString(),
    timestamp: Date.now() - 86400000 * 2,
    notes: 'El cuerpo no quería, pero la mente mandó.'
  },
  {
    id: 'vic-3',
    title: 'Mantuve la calma absoluta ante una situación tensa y resolví con frialdad',
    category: 'mentalidad',
    date: getYesterdayString(),
    timestamp: Date.now() - 86400000 * 3,
    notes: 'No reaccioné con el ego. Ejecuté la mejor solución.'
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Guerrero',
  personalManifesto: 'Soy el arquitecto de mi propio destino. No busco excusas, busco resultados. Mi disciplina es inquebrantable, mi mente es invulnerable y mis estándares son absolutos. Cada día es una conquista.',
  habits: DEFAULT_HABITS,
  victories: INITIAL_VICTORIES,
  focusSessions: [
    {
      id: 'foc-1',
      durationMinutes: 45,
      timestamp: Date.now() - 86400000,
      date: getYesterdayString(),
      label: 'Bloque de Poder'
    }
  ],
  xp: 320,
  daysWonCount: 3,
  wonDates: [getYesterdayString()],
  currentStreak: 3,
  bestStreak: 7,
  soundEnabled: true,
  notifications: {
    morning: true,
    noon: true,
    night: true,
    morningTime: '07:30',
    noonTime: '14:00',
    nightTime: '21:30'
  },
  lastActiveDate: getTodayString()
};

const STORAGE_KEY = 'ascend_app_data_v1';

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserProfile(INITIAL_PROFILE);
      return INITIAL_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROFILE,
      ...parsed,
      habits: parsed.habits || DEFAULT_HABITS,
      victories: parsed.victories || INITIAL_VICTORIES,
      focusSessions: parsed.focusSessions || []
    };
  } catch (e) {
    console.error('Error loading ASCEND profile', e);
    return INITIAL_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving ASCEND profile', e);
  }
}
