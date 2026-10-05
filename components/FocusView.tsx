'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  Flame, 
  Sparkles,
  Zap
} from 'lucide-react';
import { playFocusGongSound, startFocusAmbientNoise, stopFocusAmbientNoise, playHaptic } from '@/lib/audio';
import { triggerGoldenBurst } from '@/lib/particles';

interface FocusViewProps {
  soundEnabled: boolean;
  onSessionComplete: (minutes: number, label: string) => void;
}

export const FocusView: React.FC<FocusViewProps> = ({
  soundEnabled,
  onSessionComplete
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // in minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [ambientAudio, setAmbientAudio] = useState<boolean>(false);
  const [ritualState, setRitualState] = useState<'idle' | 'inhale' | 'exhale' | 'ignite'>('idle');
  const [ritualText, setRitualText] = useState<string>('');
  const [completedModal, setCompletedModal] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync timeLeft when preset selected and not running
  const handleSelectPreset = (mins: number) => {
    if (isActive) return;
    setSelectedDuration(mins);
    setTimeLeft(mins * 60);
  };

  // Entrance Ritual of 3 seconds
  const startRitualAndTimer = () => {
    playHaptic('medium');
    setRitualState('inhale');
    setRitualText('Respira hondo... Expande tu poder.');

    setTimeout(() => {
      setRitualState('exhale');
      setRitualText('Expulsa la duda... Calma absoluta.');
    }, 1200);

    setTimeout(() => {
      setRitualState('ignite');
      setRitualText('Empieza el dominio.');
    }, 2400);

    setTimeout(() => {
      setRitualState('idle');
      setIsActive(true);
      if (ambientAudio) {
        startFocusAmbientNoise();
      }
    }, 3300);
  };

  const handleTogglePlay = () => {
    if (isActive) {
      // Pause
      setIsActive(false);
      stopFocusAmbientNoise();
      playHaptic('light');
    } else {
      if (timeLeft === selectedDuration * 60) {
        startRitualAndTimer();
      } else {
        setIsActive(true);
        if (ambientAudio) startFocusAmbientNoise();
        playHaptic('light');
      }
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
    stopFocusAmbientNoise();
    playHaptic('light');
  };

  // Timer Tick
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            stopFocusAmbientNoise();
            playFocusGongSound(soundEnabled);
            triggerGoldenBurst();
            setCompletedModal(true);
            onSessionComplete(selectedDuration, `${selectedDuration} min Enfoque`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, selectedDuration, onSessionComplete, soundEnabled]);

  // Ambient sound toggle
  const handleToggleAmbient = () => {
    const next = !ambientAudio;
    setAmbientAudio(next);
    if (next && isActive) {
      startFocusAmbientNoise();
    } else {
      stopFocusAmbientNoise();
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const totalSecs = selectedDuration * 60;
  const progressRatio = (totalSecs - timeLeft) / totalSecs;

  // SVG Circular progress math
  const circleRadius = 110;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <span>Modo Enfoque</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Sin móvil. Sin excusas. Solo tú y la tarea que define tu avance.
        </p>
      </div>

      {/* Preset Selectors */}
      <div className="flex items-center justify-center gap-2">
        {[25, 45, 60].map((mins) => (
          <button
            key={mins}
            disabled={isActive}
            onClick={() => handleSelectPreset(mins)}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
              selectedDuration === mins
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-105'
                : 'bg-[#12151e] border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40'
            }`}
          >
            {mins} min
          </button>
        ))}
      </div>

      {/* Timer Display with SVG Circle Progress */}
      <div className="relative flex flex-col items-center justify-center my-6">
        {/* Ambient Ring Glow */}
        <div className="absolute w-64 h-64 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />

        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 260 260">
            <defs>
              <linearGradient id="focusGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#ffe57f" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <circle
              cx="130"
              cy="130"
              r={circleRadius}
              fill="transparent"
              stroke="#151923"
              strokeWidth="8"
            />

            {/* Progress Stroke */}
            <circle
              cx="130"
              cy="130"
              r={circleRadius}
              fill="transparent"
              stroke="url(#focusGoldGrad)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          {/* Center Timer Numbers & Status */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-white tabular-nums drop-shadow-[0_0_12px_rgba(212,175,55,0.2)]">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-400/90 font-medium mt-1">
              {isActive ? 'En Ejecución' : timeLeft === totalSecs ? 'Listo Para Iniciar' : 'En Pausa'}
            </span>
            <span className="text-[10px] text-zinc-500 mt-1 font-mono">
              +{selectedDuration} XP al terminar
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Reset button */}
        <button
          onClick={handleReset}
          disabled={timeLeft === totalSecs && !isActive}
          className="min-h-[48px] min-w-[48px] rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 active:scale-95 transition flex items-center justify-center"
          title="Reiniciar temporizador"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Primary Play/Pause CTA */}
        <button
          onClick={handleTogglePlay}
          className={`min-h-[56px] px-8 rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
            isActive
              ? 'bg-zinc-800 text-amber-300 border border-amber-500/40 hover:bg-zinc-700'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current ml-0.5" />
              <span>{timeLeft === totalSecs ? 'Iniciar Ritual' : 'Reanudar'}</span>
            </>
          )}
        </button>

        {/* Brown Noise Ambient Sound toggle */}
        <button
          onClick={handleToggleAmbient}
          className={`min-h-[48px] min-w-[48px] rounded-xl border flex items-center justify-center transition ${
            ambientAudio
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
          title={ambientAudio ? 'Desactivar ruido marrón de foco' : 'Activar ruido marrón para concentración'}
        >
          {ambientAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Ambient noise status explanation */}
      <div className="text-center">
        <p className="text-[11px] text-zinc-500">
          {ambientAudio ? 'Ruido de fondo profundo activo (sintetizado offline).' : 'Audio ambiente desactivado.'}
        </p>
      </div>

      {/* Entrance Ritual Overlay (3 seconds before starting) */}
      <AnimatePresence>
        {ritualState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6 text-center select-none"
          >
            {/* Pulsing circle expanding */}
            <motion.div
              animate={{
                scale: ritualState === 'inhale' ? [1, 1.4] : ritualState === 'exhale' ? [1.4, 1] : [1, 1.6],
                opacity: [0.3, 0.7, 0.4]
              }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="w-40 h-40 rounded-full border border-amber-400/50 bg-amber-500/10 mb-8 blur-[1px]"
            />

            <motion.h2
              key={ritualText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase gold-gradient-text"
            >
              {ritualText}
            </motion.h2>

            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-4">
              Preparando mente y entorno
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {completedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm rounded-2xl bg-[#0f121a] border border-amber-500/40 p-6 text-center shadow-[0_0_40px_rgba(212,175,55,0.25)] space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto text-amber-300">
                <CheckCircle className="w-8 h-8 text-amber-400" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white gold-gradient-text">
                  ¡SESIÓN CONQUISTADA!
                </h3>
                <p className="text-xs text-zinc-300">
                  {selectedDuration} minutos de avance ininterrumpido. Has vencido a la distracción.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-300">
                +{selectedDuration} PUNTOS DE EXPERIENCIA
              </div>

              <button
                onClick={() => setCompletedModal(false)}
                className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider active:scale-95 transition"
              >
                Volver al Dominio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
