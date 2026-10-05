'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bell, WifiOff } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'info' | 'success' | 'offline';
  onClose?: () => void;
}

export const InAppToast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto pointer-events-auto"
      >
        <div
          onClick={onClose}
          className={`p-3 rounded-xl border backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center gap-3 cursor-pointer text-xs font-medium ${
            type === 'offline'
              ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
              : type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-zinc-900/95 border-amber-500/30 text-zinc-100'
          }`}
        >
          {type === 'offline' ? (
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          ) : type === 'success' ? (
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Bell className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="flex-1 leading-snug">{message}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
