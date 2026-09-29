'use client';

import React from 'react';
import { Atom, ShieldCheck, Sparkles, BookOpen, RotateCcw, Languages, ExternalLink } from 'lucide-react';

interface NavbarProps {
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  onOpenRules: () => void;
  onReset: () => void;
}

export function Navbar({ language, onToggleLanguage, onOpenRules, onReset }: NavbarProps) {
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <Atom className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-zinc-100 tracking-tight">
                {isAr ? 'محرك البرومبت الفيزيائي' : 'Physics Prompt Engine'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                v3.8 Flash
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              {isAr
                ? 'محاكاة بصرية وميكانيكية صارمة موجهة لـ ChatGPT و Gemini'
                : 'Deterministic Physics Simulation Engine for ChatGPT & Gemini'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Rules / Specs Button */}
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition"
            title={isAr ? 'عرض المواصفات والميثاق الفيزيائي' : 'View Engineering Specs'}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">{isAr ? 'الميثاق الفيزيائي' : 'Physics Specs'}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg border border-transparent hover:border-zinc-800 transition"
            title={isAr ? 'إعادة ضبط للافتراضي' : 'Reset to default'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition shadow-sm"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
