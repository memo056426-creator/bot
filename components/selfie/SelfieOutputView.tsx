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
  Play,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SelfieOutputViewProps {
  compiled: CompiledSelfiePrompt;
  onSimulate: () => void;
  language: 'ar' | 'en';
}

export function SelfieOutputView({ compiled, onSimulate, language }: SelfieOutputViewProps) {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'chatgpt' | 'gemini' | 'image' | 'json'>('chatgpt');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const getModelTitle = (): string => {
    switch (activeTab) {
      case 'chatgpt':
        return 'ChatGPT-4o / GPT-4.5 Directive';
      case 'gemini':
        return 'Gemini 3.8 / 2.5 Flash XML Simulation';
      case 'image':
        return 'Midjourney v6.1 / Flux.1 RAW';
      case 'json':
        return 'Structured Scene Schema (JSON)';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getActiveText();
    const ext = activeTab === 'json' ? 'json' : 'txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selfie-prompt-${activeTab}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentContent = getActiveText();
  const wordCount = currentContent.trim().split(/\s+/).length;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-3.5">
      {/* Top Controls: Primary Tabs (ChatGPT, Gemini, More) + Actions (Requirement 11) */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-zinc-800/80">
        <div className="flex items-center gap-1.5 text-xs">
          {/* ChatGPT Button */}
          <button
            onClick={() => {
              setActiveTab('chatgpt');
              setShowMoreMenu(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'chatgpt'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>ChatGPT</span>
          </button>

          {/* Gemini Button */}
          <button
            onClick={() => {
              setActiveTab('gemini');
              setShowMoreMenu(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'gemini'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Gemini</span>
          </button>

          {/* More Menu Toggle (Midjourney/Flux + JSON inside More) */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'image' || activeTab === 'json'
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <span>{isAr ? 'المزيد (More)' : 'More'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showMoreMenu && (
              <div className="absolute top-full mt-1 start-0 z-30 w-44 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1 text-xs animate-in fade-in">
                <button
                  onClick={() => {
                    setActiveTab('image');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full text-start flex items-center gap-2 px-2.5 py-2 rounded-lg transition ${
                    activeTab === 'image' ? 'bg-zinc-800 text-amber-300 font-semibold' : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Midjourney / Flux</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('json');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full text-start flex items-center gap-2 px-2.5 py-2 rounded-lg transition ${
                    activeTab === 'json' ? 'bg-zinc-800 text-purple-300 font-semibold' : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>RAW JSON Schema</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSimulate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition"
            title={isAr ? 'فحص ومحاكاة المشهد بواسطة Gemini' : 'Simulate Scene in Gemini'}
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">{isAr ? 'محاكاة مع Gemini' : 'Simulate'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition"
            title={isAr ? 'تحميل كملف' : 'Download file'}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Model & Word Count Metadata (Requirement 12) */}
      <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1 font-mono">
        <span className="text-zinc-300 font-semibold">{getModelTitle()}</span>
        <span>{wordCount} words</span>
      </div>

      {/* PROMPT READING AREA (Requirement 12) */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 max-h-[340px] overflow-y-auto scrollbar-thin select-all">
        <pre className="text-xs font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap break-words">
          {getActiveText()}
        </pre>
      </div>

      {/* CLEAR PRIMARY ACTION: COPY PROMPT (Requirement 12) */}
      <div>
        <button
          onClick={handleCopy}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all active:scale-[0.99]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-zinc-950" />
              <span>{isAr ? 'تم نسخ البرومبت بنجاح!' : 'Prompt Copied to Clipboard!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-zinc-950" />
              <span>{isAr ? 'نسخ البرومبت (Copy Prompt)' : 'Copy Prompt'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
