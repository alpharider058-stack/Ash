'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Smartphone, 
  Clock, 
  Send,
  ShieldAlert
} from 'lucide-react';
import { playHaptic } from '@/lib/audio';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationSettings: {
    morning: boolean;
    noon: boolean;
    night: boolean;
    morningTime: string;
    noonTime: string;
    nightTime: string;
  };
  onSaveSettings: (settings: {
    morning: boolean;
    noon: boolean;
    night: boolean;
    morningTime: string;
    noonTime: string;
    nightTime: string;
  }) => void;
  onTestNotification: (title: string, body: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notificationSettings,
  onSaveSettings,
  onTestNotification
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [morning, setMorning] = useState(notificationSettings.morning);
  const [noon, setNoon] = useState(notificationSettings.noon);
  const [night, setNight] = useState(notificationSettings.night);
  const [morningTime, setMorningTime] = useState(notificationSettings.morningTime);
  const [noonTime, setNoonTime] = useState(notificationSettings.noonTime);
  const [nightTime, setNightTime] = useState(notificationSettings.nightTime);
  const [isIOS] = useState(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(ua);
    }
    return false;
  });
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    playHaptic('medium');
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta la API de Notificaciones estándar. El sistema activará el fallback in-app.');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        onTestNotification('ASCEND · Permiso Concedido', 'Tus estándares están asegurados. Hoy no se negocia.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = () => {
    playHaptic('light');
    onSaveSettings({
      morning,
      noon,
      night,
      morningTime,
      noonTime,
      nightTime
    });
    onClose();
  };

  const handleTestNotificationClick = () => {
    playHaptic('medium');
    setTestSent(true);
    onTestNotification(
      'ASCEND · Empuje de Disciplina',
      '¿Qué estás haciendo ahora mismo? Vuelve al trabajo profundo. Gana la hora.'
    );
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-[#0b0d14] border border-amber-500/30 p-5 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-y-auto space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Bell className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Recordatorios de Disciplina
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Notificaciones estratégicas para mantener tu fuego encendido.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playHaptic('light');
                onClose();
              }}
              className="text-zinc-500 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Honest Platform Capabilities & Permissions Warning */}
          {permission !== 'granted' ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Activar Notificaciones del Sistema</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Para recibir avisos cuando la app esté cerrada, concede permiso al navegador.
              </p>
              <button
                onClick={handleRequestPermission}
                className="w-full py-2.5 rounded-lg bg-amber-500 text-black font-bold text-xs uppercase tracking-wider active:scale-95 transition"
              >
                Conceder Permiso Ahora
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3]" />
                Permiso del navegador concedido
              </span>
              <button
                onClick={handleTestNotificationClick}
                className="text-[11px] text-zinc-300 underline hover:text-white"
              >
                {testSent ? '¡Enviada!' : 'Probar aviso'}
              </button>
            </div>
          )}

          {/* iOS Honest Clarification Box */}
          {isIOS && (
            <div className="p-3.5 rounded-xl bg-[#121622] border border-blue-500/20 text-xs text-zinc-300 space-y-1">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Nota técnica para iPhone / iPad</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Apple exige que añadas esta PWA a la <strong>Pantalla de inicio</strong> (Safari &rarr; Compartir &rarr; Añadir a pantalla de inicio) con iOS 16.4+ para recibir Push en segundo plano. Si no lo has hecho, ASCEND te mostrará recordatorios in-app inteligentes.
              </p>
            </div>
          )}

          {/* Configurable Reminder Slots */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Momentos de Empuje Diario
            </span>

            {/* Morning */}
            <div className="p-3.5 rounded-xl bg-[#0f1118] border border-zinc-800 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white">1. Despertar & Manifiesto</span>
                <p className="text-[11px] text-zinc-500">
                  Frase de identidad y activación de innegociables.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => setMorning(!morning)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    morning ? 'bg-amber-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black transform transition-transform ${
                      morning ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Noon */}
            <div className="p-3.5 rounded-xl bg-[#0f1118] border border-zinc-800 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white">2. Empuje de Mediodía</span>
                <p className="text-[11px] text-zinc-500">
                  Recordatorio para no negociar la tarde y avanzar en enfoque.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={noonTime}
                  onChange={(e) => setNoonTime(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => setNoon(!noon)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    noon ? 'bg-amber-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black transform transition-transform ${
                      noon ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Night */}
            <div className="p-3.5 rounded-xl bg-[#0f1118] border border-zinc-800 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white">3. Cierre Nocturno</span>
                <p className="text-[11px] text-zinc-500">
                  Inmortalizar victorias del día y declarar el Día Ganado.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={nightTime}
                  onChange={(e) => setNightTime(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => setNight(!night)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    night ? 'bg-amber-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black transform transition-transform ${
                      night ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Action Save */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider active:scale-95 transition"
            >
              Guardar Configuración
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
