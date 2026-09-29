'use client';

import React from 'react';
import { Smartphone, Atom, BookOpen, RotateCcw, Languages } from 'lucide-react';

interface NavbarProps {
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  onOpenRules: () => void;
  onReset: () => void;
  appMode: 'selfie' | 'general_physics';
  onSelectMode: (mode: 'selfie' | 'general_physics') => void;
}

export function Navbar({
  language,
  onToggleLanguage,
  onOpenRules,
  onReset,
  appMode,
  onSelectMode,
}: NavbarProps) {
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Brand / Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            {appMode === 'selfie' ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <Atom className="w-4 h-4" />
            )}
          </div>
          <span className="font-bold text-sm sm:text-base text-zinc-100 tracking-tight hidden sm:inline">
            {isAr ? 'استوديو السيلفي والفيزياء' : 'Selfie & Physics Studio'}
          </span>
        </div>

        {/* Compact Mode Selector (Requirement 1) */}
        <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
          <button
            onClick={() => onSelectMode('selfie')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md font-medium transition ${
              appMode === 'selfie'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">
              {isAr ? 'سيلفي التوافق المشهدي' : 'Scene Compatibility Studio'}
            </span>
          </button>

          <button
            onClick={() => onSelectMode('general_physics')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md font-medium transition ${
              appMode === 'general_physics'
                ? 'bg-cyan-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">
              {isAr ? 'المحرك الفيزيائي العام' : 'General Physics Engine'}
            </span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenRules}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs font-medium transition flex items-center gap-1"
            title={isAr ? 'الميثاق الفيزيائي' : 'Physics Specs'}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">{isAr ? 'الميثاق' : 'Specs'}</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition"
            title={isAr ? 'إعادة ضبط للافتراضي' : 'Reset'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleLanguage}
            className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold transition"
          >
            <Languages className="w-3.5 h-3.5 sm:hidden" />
            <span className="hidden sm:inline">{isAr ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
