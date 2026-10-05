'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SplashScreen } from '@/components/SplashScreen';
import { TopHeader } from '@/components/TopHeader';
import { TabBar } from '@/components/TabBar';
import { HomeView } from '@/components/HomeView';
import { HabitsView } from '@/components/HabitsView';
import { FocusView } from '@/components/FocusView';
import { ProfileRankView } from '@/components/ProfileRankView';
import { VictoriesModal } from '@/components/VictoriesModal';
import { DayWonModal } from '@/components/DayWonModal';
import { RankUpModal } from '@/components/RankUpModal';
import { ManifestoEditModal } from '@/components/ManifestoEditModal';
import { NotificationsModal } from '@/components/NotificationsModal';
import { IOSInstallGuideModal } from '@/components/IOSInstallGuideModal';
import { InAppToast } from '@/components/InAppToast';
import { 
  UserProfile, 
  TabType, 
  HabitCategory, 
  VictoryCategory, 
  RankInfo 
} from '@/lib/types';
import { 
  loadUserProfile, 
  saveUserProfile, 
  getRankFromXp, 
  getTodayString, 
  getYesterdayString,
  INITIAL_PROFILE
} from '@/lib/store';
import { usePWA } from '@/hooks/usePWA';
import { 
  playDayWonCelebrationSound, 
  playVictorySound, 
  playHaptic 
} from '@/lib/audio';
import { triggerGoldenBurst } from '@/lib/particles';

export default function AscendApp() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const loaded = loadUserProfile();
      const today = getTodayString();
      const yesterday = getYesterdayString();
      if (loaded.lastActiveDate && loaded.lastActiveDate !== today && loaded.lastActiveDate !== yesterday) {
        loaded.currentStreak = 0;
      }
      loaded.lastActiveDate = today;
      return loaded;
    }
    return INITIAL_PROFILE;
  });
  const [isLoaded, setIsLoaded] = useState(true);
  const [splashVisible, setSplashVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('ascend_splash_seen') !== 'true';
    }
    return true;
  });
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Modals state
  const [victoriesModalOpen, setVictoriesModalOpen] = useState(false);
  const [manifestoModalOpen, setManifestoModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [dayWonModalOpen, setDayWonModalOpen] = useState(false);
  const [rankUpModalOpen, setRankUpModalOpen] = useState(false);
  const [newRank, setNewRank] = useState<RankInfo | null>(null);
  const [iosGuideOpen, setIosGuideOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'offline' } | null>(null);

  const { isInstallable, isInstalled, isIOS, install } = usePWA();
  const todayStr = getTodayString();

  // Save profile changes to localStorage
  useEffect(() => {
    saveUserProfile(profile);
  }, [profile]);

  // Offline status listener
  useEffect(() => {
    const handleOffline = () => {
      setToast({ message: 'Modo sin conexión. Todos tus datos siguen disponibles localmente.', type: 'offline' });
    };
    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, []);

  const showToast = (message: string, type: 'info' | 'success' | 'offline' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3800);
  };

  const handleSplashComplete = () => {
    sessionStorage.setItem('ascend_splash_seen', 'true');
    setSplashVisible(false);
  };

  // Helper to award XP and evaluate Rank Up
  const awardXp = (amount: number, currentProfile: UserProfile): UserProfile => {
    const oldRank = getRankFromXp(currentProfile.xp);
    const updatedXp = currentProfile.xp + amount;
    const nextRank = getRankFromXp(updatedXp);

    if (nextRank.level > oldRank.level) {
      setNewRank(nextRank);
      setRankUpModalOpen(true);
      playDayWonCelebrationSound(currentProfile.soundEnabled);
      triggerGoldenBurst();
    }

    return {
      ...currentProfile,
      xp: updatedXp
    };
  };

  // Check if today was won (all active habits completed)
  const activeHabits = profile.habits.filter((h) => h.active);
  const completedTodayCount = activeHabits.filter((h) => h.completedDates.includes(todayStr)).length;
  const isTodayWon = activeHabits.length > 0 && completedTodayCount === activeHabits.length;

  // Toggle habit completion
  const handleToggleHabit = (habitId: string) => {
    setProfile((prev) => {
      let wasAlreadyCompleted = false;
      const updatedHabits = prev.habits.map((h) => {
        if (h.id === habitId) {
          const hasToday = h.completedDates.includes(todayStr);
          wasAlreadyCompleted = hasToday;
          let newDates: string[];
          let newStreak = h.streak;

          if (hasToday) {
            newDates = h.completedDates.filter((d) => d !== todayStr);
            newStreak = Math.max(0, newStreak - 1);
          } else {
            newDates = [...h.completedDates, todayStr];
            newStreak += 1;
          }

          return {
            ...h,
            completedDates: newDates,
            streak: newStreak
          };
        }
        return h;
      });

      let updatedProfile: UserProfile = {
        ...prev,
        habits: updatedHabits
      };

      if (!wasAlreadyCompleted) {
        // Just checked habit -> +25 XP
        updatedProfile = awardXp(25, updatedProfile);

        // Check if now all active habits are completed for today
        const newActive = updatedHabits.filter((h) => h.active);
        const newCompletedCount = newActive.filter((h) => h.completedDates.includes(todayStr)).length;

        if (newActive.length > 0 && newCompletedCount === newActive.length) {
          // DAY WON!
          if (!prev.wonDates.includes(todayStr)) {
            updatedProfile = awardXp(100, updatedProfile); // +100 bonus XP
            const newWonDates = [...prev.wonDates, todayStr];
            const newDaysWon = prev.daysWonCount + 1;
            const newStreak = prev.currentStreak + 1;
            const newBest = Math.max(prev.bestStreak, newStreak);

            updatedProfile = {
              ...updatedProfile,
              daysWonCount: newDaysWon,
              wonDates: newWonDates,
              currentStreak: newStreak,
              bestStreak: newBest
            };

            setDayWonModalOpen(true);
            playDayWonCelebrationSound(prev.soundEnabled);
            triggerGoldenBurst();
          }
        }
      } else {
        // Unchecked -> remove 25 XP
        updatedProfile = {
          ...updatedProfile,
          xp: Math.max(0, updatedProfile.xp - 25)
        };
      }

      saveUserProfile(updatedProfile);
      return updatedProfile;
    });
  };

  // Add new habit (up to 5)
  const handleAddHabit = (title: string, category: HabitCategory) => {
    setProfile((prev) => {
      if (prev.habits.filter((h) => h.active).length >= 5) return prev;
      const newHabit = {
        id: `habit-${Date.now()}`,
        title,
        category,
        streak: 0,
        completedDates: [],
        active: true,
        createdAt: Date.now()
      };
      const updated = {
        ...prev,
        habits: [...prev.habits, newHabit]
      };
      saveUserProfile(updated);
      showToast('Nuevo innegociable establecido. Ejecuta.', 'success');
      return updated;
    });
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        habits: prev.habits.filter((h) => h.id !== habitId)
      };
      saveUserProfile(updated);
      return updated;
    });
  };

  // Add victory
  const handleAddVictory = (title: string, category: VictoryCategory, notes?: string) => {
    setProfile((prev) => {
      const newVic = {
        id: `vic-${Date.now()}`,
        title,
        category,
        date: todayStr,
        timestamp: Date.now(),
        notes
      };

      let updated = {
        ...prev,
        victories: [newVic, ...prev.victories]
      };

      updated = awardXp(30, updated);
      saveUserProfile(updated);
      showToast('Victoria inmortalizada (+30 XP)', 'success');
      return updated;
    });
  };

  // Delete victory
  const handleDeleteVictory = (victoryId: string) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        victories: prev.victories.filter((v) => v.id !== victoryId)
      };
      saveUserProfile(updated);
      return updated;
    });
  };

  // Complete focus session
  const handleFocusComplete = (minutes: number, label: string) => {
    setProfile((prev) => {
      const newSession = {
        id: `foc-${Date.now()}`,
        durationMinutes: minutes,
        timestamp: Date.now(),
        date: todayStr,
        label
      };

      let updated = {
        ...prev,
        focusSessions: [newSession, ...(prev.focusSessions || [])]
      };

      updated = awardXp(minutes, updated);
      saveUserProfile(updated);
      return updated;
    });
  };

  // Save personal manifesto
  const handleSaveManifesto = (newManifesto: string) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        personalManifesto: newManifesto
      };
      saveUserProfile(updated);
      showToast('Manifiesto personal actualizado.', 'success');
      return updated;
    });
  };

  // Save notifications settings
  const handleSaveNotificationSettings = (settings: UserProfile['notifications']) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        notifications: settings
      };
      saveUserProfile(updated);
      showToast('Ajustes de recordatorios guardados.', 'success');
      return updated;
    });
  };

  // Test Notification
  const handleTestNotification = async (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const reg = await navigator.serviceWorker?.getRegistration();
        if (reg) {
          reg.showNotification(title, {
            body,
            icon: '/pwa-192x192.png',
            badge: '/icon.svg'
          });
          return;
        } else {
          new Notification(title, { body, icon: '/pwa-192x192.png' });
          return;
        }
      } catch (e) {
        console.warn('Notification error fallback to in-app toast:', e);
      }
    }
    // Fallback: in-app toast
    showToast(`${title}: ${body}`, 'info');
  };

  // Toggle sound
  const handleToggleSound = () => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        soundEnabled: !prev.soundEnabled
      };
      saveUserProfile(updated);
      return updated;
    });
  };

  // Export JSON backup
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ascend_backup_${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Copia de seguridad exportada con éxito.', 'success');
  };

  // Import JSON backup
  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed && parsed.xp !== undefined && Array.isArray(parsed.habits)) {
          setProfile(parsed);
          saveUserProfile(parsed);
          showToast('Datos restaurados correctamente.', 'success');
        } else {
          showToast('El archivo JSON no tiene un formato válido de ASCEND.', 'info');
        }
      } catch (err) {
        showToast('Error al leer el archivo de copia de seguridad.', 'info');
      }
    };
    reader.readAsText(file);
  };

  // Install click handler
  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setIosGuideOpen(true);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#07080b] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Cinematic Splash Screen */}
      {splashVisible && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Floating In-App Toast */}
      <InAppToast
        message={toast?.message || null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Top Header */}
      <TopHeader
        currentStreak={profile.currentStreak}
        soundEnabled={profile.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenNotifications={() => setNotificationsModalOpen(true)}
        canInstall={!isInstalled}
        onInstallClick={handleInstallClick}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-2">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HomeView
                profile={profile}
                todayWon={isTodayWon}
                onOpenVictoriesModal={() => setVictoriesModalOpen(true)}
                onOpenManifestoModal={() => setManifestoModalOpen(true)}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
              />
            </motion.div>
          )}

          {currentTab === 'habits' && (
            <motion.div
              key="tab-habits"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HabitsView
                habits={profile.habits}
                soundEnabled={profile.soundEnabled}
                onToggleHabit={handleToggleHabit}
                onAddHabit={handleAddHabit}
                onDeleteHabit={handleDeleteHabit}
                todayWon={isTodayWon}
              />
            </motion.div>
          )}

          {currentTab === 'focus' && (
            <motion.div
              key="tab-focus"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <FocusView
                soundEnabled={profile.soundEnabled}
                onSessionComplete={handleFocusComplete}
              />
            </motion.div>
          )}

          {currentTab === 'profile' && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileRankView
                profile={profile}
                onOpenManifestoModal={() => setManifestoModalOpen(true)}
                onOpenNotifications={() => setNotificationsModalOpen(true)}
                onExportData={handleExportData}
                onImportData={handleImportData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <TabBar
        currentTab={currentTab}
        onChangeTab={(tab) => setCurrentTab(tab)}
        completedHabitsCount={completedTodayCount}
        totalHabitsCount={activeHabits.length}
      />

      {/* Modals & Dialogs */}
      <VictoriesModal
        isOpen={victoriesModalOpen}
        onClose={() => setVictoriesModalOpen(false)}
        victories={profile.victories}
        onAddVictory={handleAddVictory}
        onDeleteVictory={handleDeleteVictory}
        soundEnabled={profile.soundEnabled}
      />

      <ManifestoEditModal
        isOpen={manifestoModalOpen}
        onClose={() => setManifestoModalOpen(false)}
        currentManifesto={profile.personalManifesto}
        onSaveManifesto={handleSaveManifesto}
      />

      <DayWonModal
        isOpen={dayWonModalOpen}
        onClose={() => setDayWonModalOpen(false)}
        streak={profile.currentStreak}
      />

      {newRank && (
        <RankUpModal
          isOpen={rankUpModalOpen}
          onClose={() => {
            setRankUpModalOpen(false);
            setNewRank(null);
          }}
          newRank={newRank}
        />
      )}

      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        notificationSettings={profile.notifications}
        onSaveSettings={handleSaveNotificationSettings}
        onTestNotification={handleTestNotification}
      />

      <IOSInstallGuideModal
        isOpen={iosGuideOpen}
        onClose={() => setIosGuideOpen(false)}
      />
    </div>
  );
}
