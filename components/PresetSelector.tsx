'use client';

import React from 'react';
import { PRESET_SCENARIOS, PromptPreset } from '@/lib/physics-constants';
import { Flame, Droplets, CloudRain, Bug, Building2, Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  language: 'ar' | 'en';
  onSelectPreset: (preset: PromptPreset) => void;
  activePresetId?: string;
}

export function PresetSelector({ language, onSelectPreset, activePresetId }: PresetSelectorProps) {
  const isAr = language === 'ar';

  const getIcon = (name: string) => {
    switch (name) {
      case 'Flame':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'CloudRain':
        return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'Bug':
        return <Bug className="w-4 h-4 text-emerald-400" />;
      case 'Building2':
        return <Building2 className="w-4 h-4 text-stone-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          {isAr ? 'سيناريوهات فيزيائية جاهزة ومختبرة' : 'Verified Physics Benchmark Presets'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {PRESET_SCENARIOS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-start p-3 rounded-xl border transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-zinc-900 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
                  : 'bg-zinc-900/50 hover:bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 group-hover:scale-110 transition-transform">
                  {getIcon(preset.iconName)}
                </div>
                <span className="text-xs font-bold text-zinc-200 line-clamp-1">
                  {isAr ? preset.titleAr : preset.titleEn}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {isAr ? preset.descriptionAr : preset.descriptionEn}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
