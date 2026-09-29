'use client';

import React, { useState } from 'react';
import { CompiledSelfiePrompt } from '@/types/selfie-engine';
import {
  Copy,
  Check,
  Download,
  Bot,
  Zap,
  Flame,
  FileCode2,
  Terminal,
  ShieldCheck,
  Play,
  Share2,
} from 'lucide-react';

interface SelfieOutputViewProps {
  compiled: CompiledSelfiePrompt;
  onSimulate: () => void;
  language: 'ar' | 'en';
}

export function SelfieOutputView({ compiled, onSimulate, language }: SelfieOutputViewProps) {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'chatgpt' | 'gemini' | 'image' | 'json'>('chatgpt');
  const [copied, setCopied] = useState<string | null>(null);

  const getActiveText = (): string => {
    switch (activeTab) {
      case 'chatgpt':
        return compiled.chatgptPrompt;
      case 'gemini':
        return compiled.geminiPrompt;
      case 'image':
        return compiled.imageGenPrompt;
      case 'json':
        return compiled.jsonSpecification;
      default:
        return compiled.chatgptPrompt;
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = () => {
    const text = getActiveText();
    const ext = activeTab === 'json' ? 'json' : 'txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selfie-scene-${activeTab}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentContent = getActiveText();
  const wordCount = currentContent.trim().split(/\s+/).length;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-100">
              {isAr ? 'البرومبت النهائي المتوافق فيزيائياً' : 'Validated Selfie Scene Prompt'}
            </h3>
            <p className="text-xs text-zinc-400">
              {isAr
                ? 'نموذج مشهد متماسك مبني وفق تسلسل التوافق وهندسة كاميرا الهاتف'
                : 'Cohesive scene model with zero sentence-gluing and strict arm-reach constraints'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSimulate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isAr ? 'فحص ومحاكاة مع Gemini' : 'Simulate in Gemini'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
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
            <span>ChatGPT Selfie Directive</span>
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
            <span>Gemini XML Simulation</span>
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
            <span>Midjourney & Flux RAW</span>
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
            <span>JSON Scene Schema</span>
          </button>
        </div>

        {/* Copy & Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(getActiveText(), activeTab)}
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
                <span>{isAr ? 'نسخ البرومبت' : 'Copy'}</span>
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

      {/* Terminal View */}
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/80 border-b border-zinc-800 text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <span className="ms-2 text-zinc-300 font-medium">
              {activeTab === 'chatgpt'
                ? 'selfie-chatgpt-system.md'
                : activeTab === 'gemini'
                ? 'selfie-gemini-simulation.xml'
                : activeTab === 'image'
                ? 'selfie-midjourney-flux.txt'
                : 'selfie-scene-model.json'}
            </span>
          </div>

          <span>{wordCount} words</span>
        </div>

        <pre className="p-4 text-xs font-mono text-zinc-200 leading-relaxed overflow-x-auto max-h-[420px] scrollbar-thin select-all whitespace-pre-wrap break-words">
          {getActiveText()}
        </pre>
      </div>
    </div>
  );
}
