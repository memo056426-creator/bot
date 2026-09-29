'use client';

import React, { useState, useEffect } from 'react';
import { SimulationResult, TargetEngine } from '@/types/physics-engine';
import { X, Play, CheckCircle2, XCircle, Sparkles, Activity, ShieldCheck, Atom } from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptText: string;
  targetEngine: TargetEngine;
  language: 'ar' | 'en';
}

export function SimulationModal({
  isOpen,
  onClose,
  promptText,
  targetEngine,
  language,
}: SimulationModalProps) {
  const isAr = language === 'ar';
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, targetEngine }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to simulate prompt');
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error occurred during simulation');
    } finally {
      setLoading(false);
    }
  }, [promptText, targetEngine]);

  useEffect(() => {
    if (isOpen && promptText) {
      const timer = setTimeout(() => {
        runSimulation();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen, promptText, runSimulation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Atom className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-100">
                {isAr ? 'اختبار ومحاكاة الاستجابة مع Gemini' : 'Gemini Physics Simulation Test'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isAr
                  ? 'فحص استجابة النموذج للقيود الفيزيائية وقوانين البصريات'
                  : 'Verifying strict compliance with physical & optical rules'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-zinc-300">
                {isAr ? 'جاري محاكاة وتدقيق البرومبت فيزيائياً بواسطة Gemini...' : 'Running physics verification with Gemini...'}
              </p>
              <p className="text-xs text-zinc-500">
                {isAr ? 'التحقق من قانون التربيع العكسي، مثلث التعريض، والجلد الحقيقي' : 'Checking inverse-square law, exposure triangle, and PBR boundaries'}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
              <p className="font-bold mb-1">{isAr ? 'تعذر إتمام المحاكاة:' : 'Simulation Error:'}</p>
              <p>{error}</p>
              <button
                onClick={runSimulation}
                className="mt-2 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-white font-medium"
              >
                {isAr ? 'إعادة المحاولة' : 'Retry'}
              </button>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              {/* Overall Evaluation */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-emerald-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {isAr ? 'نتيجة التدقيق الفيزيائي العام:' : 'Physics Engine Verification Assessment:'}
                </span>
                <p className="text-xs leading-relaxed">{result.evaluation}</p>
              </div>

              {/* Compliance Checklist */}
              <div>
                <span className="text-xs font-semibold text-zinc-300 block mb-2">
                  {isAr ? 'قائمة التحقق من المعايير الصارمة:' : 'Strict Rule Compliance Checklist:'}
                </span>
                <div className="space-y-2">
                  {result.complianceChecks?.map((check, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-2.5"
                    >
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold text-zinc-200 block text-xs">{check.rule}</span>
                        <p className="text-zinc-400 text-[11px] leading-relaxed mt-0.5">{check.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Scene Output */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isAr ? 'المحاكاة البصرية الافتراضية للمشهد (Simulated Forensic Render):' : 'Forensic Optical Scene Simulation:'}</span>
                </span>
                <p className="text-zinc-300 leading-relaxed text-xs font-mono bg-zinc-950 p-3 rounded-lg border border-zinc-800 whitespace-pre-wrap">
                  {result.simulatedSceneRender}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex justify-end bg-zinc-900/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
