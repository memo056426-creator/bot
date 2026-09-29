'use client';

import React from 'react';
import { TargetEngine, PhysicsIntensity } from '@/types/physics-engine';
import {
  Sparkles,
  Cpu,
  Bot,
  Zap,
  SlidersHorizontal,
  Flame,
  FileCode2,
  Wand2,
  ChevronRight,
  Layers
} from 'lucide-react';

interface InputWorkbenchProps {
  userIdea: string;
  onChangeUserIdea: (idea: string) => void;
  targetEngine: TargetEngine;
  onChangeTargetEngine: (engine: TargetEngine) => void;
  intensity: PhysicsIntensity;
  onChangeIntensity: (intensity: PhysicsIntensity) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  language: 'ar' | 'en';
}

export function InputWorkbench({
  userIdea,
  onChangeUserIdea,
  targetEngine,
  onChangeTargetEngine,
  intensity,
  onChangeIntensity,
  onGenerate,
  isGenerating,
  language,
}: InputWorkbenchProps) {
  const isAr = language === 'ar';

  const engineOptions: { id: TargetEngine; label: string; icon: any; desc: string }[] = [
    {
      id: 'universal',
      label: isAr ? 'شامل لكافة النماذج' : 'Universal Protocol',
      icon: Cpu,
      desc: isAr ? 'ChatGPT + Gemini + Flux' : 'Multi-Model',
    },
    {
      id: 'chatgpt',
      label: 'ChatGPT Directive',
      icon: Bot,
      desc: isAr ? 'أوامر نظام صارمة لـ GPT-4o' : 'System Directive',
    },
    {
      id: 'gemini',
      label: 'Gemini Protocol',
      icon: Zap,
      desc: isAr ? 'محاكاة فيزيائية بهيكل XML' : 'XML Simulation Block',
    },
    {
      id: 'image_gen',
      label: 'Midjourney & Flux',
      icon: Flame,
      desc: isAr ? 'أوامر بارامترية مع --no' : 'Parametric + Weights',
    },
    {
      id: 'json',
      label: 'JSON Schema',
      icon: FileCode2,
      desc: isAr ? 'مخطط برمجي مهيكل' : 'Pure Data Payload',
    },
  ];

  const intensityOptions: { id: PhysicsIntensity; labelAr: string; labelEn: string; descAr: string; descEn: string }[] = [
    {
      id: 'subtle',
      labelAr: 'واقعية طبيعية',
      labelEn: 'Subtle Realism',
      descAr: 'توازن خفيف مع الضوء المبرر',
      descEn: 'Natural lighting falloff',
    },
    {
      id: 'cinematic',
      labelAr: 'فيزياء سينمائية',
      labelEn: 'Cinematic Physics',
      descAr: 'إضاءة داكنة وعدسات حقيقية',
      descEn: 'Analog lenses & moody diegetic light',
    },
    {
      id: 'forensic',
      labelAr: 'توثيق جنائي صارم',
      labelEn: 'Forensic Strict',
      descAr: 'تفاصيل مسام كاملة بدون أي تجميل',
      descEn: 'Unfiltered dermatological & mechanical truth',
    },
    {
      id: 'extreme_optical',
      labelAr: 'محاكاة بصرية ومجهرية',
      labelEn: 'Extreme Optical Sim',
      descAr: 'حساب كامل لفوتونات الضوء والتوتر السطحي',
      descEn: 'Photon attenuation & microscopic IOR',
    },
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4 sm:space-y-5">
        {/* Top bar: Target Engine Pills */}
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            {isAr ? 'النموذج الهدف (Target Engine)' : 'Target LLM / Image Model'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {engineOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = targetEngine === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onChangeTargetEngine(opt.id)}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-start transition-all ${
                    isSelected
                      ? 'bg-zinc-900 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
                      : 'bg-zinc-900/50 hover:bg-zinc-900/80 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    <span className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 line-clamp-1">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Idea Input Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'فكرة المشهد أو الوصف الأولي (Scene Concept)' : 'Raw Scene Idea to Deconstruct'}</span>
            </label>
            <span className="text-[11px] text-zinc-400">
              {isAr ? 'يقبل العربية أو الإنجليزية' : 'Supports Arabic & English'}
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={userIdea}
              onChange={(e) => onChangeUserIdea(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب أي فكرة ترغب بتحويلها إلى برومبت فيزيائي... مثلاً: (وجه سيدة عجوز تنسج الصوف أمام نافذة، أو قطرة مطر ترتطم بمعدن صدئ في ليلة شتوية، أو محرك طائرة قديم في حظيرة)'
                  : 'Describe any scene... e.g. (Close-up portrait of a veteran diver on a salt-crusted boat, water droplet splashing on a rusted gear, antique watchmaker under a desk lamp)'
              }
              className="w-full p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition leading-relaxed"
            />
          </div>
        </div>

        {/* Bottom Bar: Intensity Selector + Action Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-zinc-800/80">
          {/* Intensity selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
              {isAr ? 'مستوى الشدة الفيزيائية (Simulation Rigor):' : 'Simulation Rigor Intensity:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {intensityOptions.map((opt) => {
                const isSelected = intensity === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onChangeIntensity(opt.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                    }`}
                    title={isAr ? opt.descAr : opt.descEn}
                  >
                    {isAr ? opt.labelAr : opt.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGenerate}
              disabled={isGenerating || !userIdea.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>{isAr ? 'جاري التفكيك الفيزيائي...' : 'Deconstructing Physics...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-zinc-950" />
                  <span>{isAr ? 'توليد البرومبت الفيزيائي الصارم' : 'Compile Physics Prompt'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
