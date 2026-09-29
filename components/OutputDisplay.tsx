'use client';

import React, { useState } from 'react';
import { GeneratedPrompts, TargetEngine } from '@/types/physics-engine';
import {
  Copy,
  Check,
  Download,
  Share2,
  Bot,
  Zap,
  Flame,
  FileCode2,
  ShieldCheck,
  Gauge,
  Play,
  Terminal,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface OutputDisplayProps {
  prompts: GeneratedPrompts;
  targetEngine: TargetEngine;
  onRunSimulation: () => void;
  language: 'ar' | 'en';
}

export function OutputDisplay({
  prompts,
  targetEngine,
  onRunSimulation,
  language,
}: OutputDisplayProps) {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'chatgpt' | 'gemini' | 'image' | 'json' | 'negative'>(
    targetEngine === 'chatgpt'
      ? 'chatgpt'
      : targetEngine === 'gemini'
      ? 'gemini'
      : targetEngine === 'image_gen'
      ? 'image'
      : targetEngine === 'json'
      ? 'json'
      : 'chatgpt'
  );
  const [copied, setCopied] = useState<string | null>(null);

  const getActiveContent = (): string => {
    switch (activeTab) {
      case 'chatgpt':
        return prompts.chatgptPrompt;
      case 'gemini':
        return prompts.geminiPrompt;
      case 'image':
        return prompts.imageGenPrompt;
      case 'json':
        return prompts.jsonSpecification;
      case 'negative':
        return prompts.negativePrompt;
      default:
        return prompts.chatgptPrompt;
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = () => {
    const content = getActiveContent();
    const ext = activeTab === 'json' ? 'json' : 'txt';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `physics-prompt-${activeTab}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentText = getActiveContent();
  const wordCount = currentText.trim().split(/\s+/).length;
  const charCount = currentText.length;

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
      {/* Top Bar: Title & Realism Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-zinc-100">
              {isAr ? 'البرومبت الفيزيائي النهائي المترجم' : 'Compiled Physics Simulation Prompt'}
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isAr
              ? 'جاهز للنسخ المباشر إلى ChatGPT أو Gemini مع حماية كاملة من التجميل'
              : 'Directly formatted for LLM physics execution without AI smoothing'}
          </p>
        </div>

        {/* Realism Meter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                {isAr ? 'مؤشر الواقعية الفيزيائية' : 'Physics Fidelity'}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {prompts.physicsAnalysis.realismScore}% Strict
              </span>
            </div>
          </div>

          {/* Test in Gemini Button */}
          <button
            onClick={onRunSimulation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isAr ? 'محاكاة واختبار مع Gemini' : 'Simulate with Gemini'}</span>
          </button>
        </div>
      </div>

      {/* Tabs for formats */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('chatgpt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'chatgpt'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>ChatGPT Directive</span>
          </button>

          <button
            onClick={() => setActiveTab('gemini')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'gemini'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Gemini XML Protocol</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'image'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Midjourney & Flux</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'json'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
            <span>JSON Payload</span>
          </button>

          <button
            onClick={() => setActiveTab('negative')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'negative'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>{isAr ? 'الكلمات السلبية (Negative)' : 'Negative Prompt'}</span>
          </button>
        </div>

        {/* Copy & Download Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(getActiveContent(), activeTab)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition shadow-sm"
          >
            {copied === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isAr ? 'نسخ البرومبت' : 'Copy Prompt'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition"
            title={isAr ? 'تحميل كملف' : 'Download file'}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code / Text Preview Display Box */}
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/80 border-b border-zinc-800 text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <span className="ms-2 text-zinc-300 font-medium">
              {activeTab === 'chatgpt'
                ? 'chatgpt-system-directive.md'
                : activeTab === 'gemini'
                ? 'gemini-physics-simulation.xml'
                : activeTab === 'image'
                ? 'midjourney-flux-parametric.txt'
                : activeTab === 'json'
                ? 'physics-schema.json'
                : 'negative-prompt-blacklist.txt'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        {/* Content text */}
        <pre className="p-4 text-xs font-mono text-zinc-200 leading-relaxed overflow-x-auto max-h-[380px] scrollbar-thin select-all whitespace-pre-wrap break-words">
          {getActiveContent()}
        </pre>
      </div>

      {/* Physics Inspection Summary Pills */}
      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
          <span>{isAr ? 'فحص المطابقة الفيزيائية للبرومبت:' : 'Physics Engine Validation Summary:'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-500 block mb-0.5">{isAr ? 'البصريات والضوء' : 'Optics & Light'}</span>
            <span className="text-amber-300 font-mono line-clamp-1">{prompts.physicsAnalysis.opticsSummary}</span>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-500 block mb-0.5">{isAr ? 'مثلث الكاميرا' : 'Camera Exposure'}</span>
            <span className="text-blue-300 font-mono line-clamp-1">{prompts.physicsAnalysis.cameraSummary}</span>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-500 block mb-0.5">{isAr ? 'المواد والحرارة PBR' : 'PBR Materials'}</span>
            <span className="text-cyan-300 font-mono line-clamp-1">{prompts.physicsAnalysis.materialsSummary}</span>
          </div>
        </div>

        {/* Blacklist scrubbed terms alert if any */}
        {prompts.physicsAnalysis.scannedBlacklistTermsFound &&
          prompts.physicsAnalysis.scannedBlacklistTermsFound.length > 0 && (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-950/40 border border-red-800/40 text-[11px] text-red-300">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>
                {isAr ? 'تم شطب كلمات تجميل اصطناعية:' : 'Scrubbed AI beautification buzzwords:'}{' '}
                <strong className="font-mono text-red-200">
                  {prompts.physicsAnalysis.scannedBlacklistTermsFound.join(', ')}
                </strong>
              </span>
            </div>
          )}
      </div>
    </div>
  );
}
