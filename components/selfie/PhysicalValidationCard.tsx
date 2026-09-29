'use client';

import React from 'react';
import { PhysicalValidationItem } from '@/types/selfie-engine';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Wrench } from 'lucide-react';

interface PhysicalValidationCardProps {
  checks: PhysicalValidationItem[];
  passedAll: boolean;
  onAutoFix?: () => void;
  language: 'ar' | 'en';
}

export function PhysicalValidationCard({
  checks,
  passedAll,
  onAutoFix,
  language,
}: PhysicalValidationCardProps) {
  const isAr = language === 'ar';

  const errorsCount = checks.filter((c) => !c.passed && c.severity === 'error').length;
  const warningsCount = checks.filter((c) => c.severity === 'warning').length;

  return (
    <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg border ${
              passedAll
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-100">
              {isAr ? 'مصفوفة التحقق الفيزيائي التلقائي (Physical Validation)' : 'Automated Physical Validation Matrix'}
            </h4>
            <p className="text-[11px] text-zinc-400">
              {isAr
                ? 'فحص توافق مركز الثقل، مسافة الذراع، مصادر الضوء، وتلامس الأسطح'
                : 'Real-time verification of center of mass, arm reach, diegetic light, and surface contact'}
            </p>
          </div>
        </div>

        {/* Status Badge + Auto-fix */}
        <div className="flex items-center gap-2">
          {passedAll ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-mono text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {isAr ? 'متطابق فيزيائياً 100%' : '100% Physically Coherent'}
            </span>
          ) : (
            <button
              onClick={onAutoFix}
              className="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{isAr ? `إصلاح ${errorsCount} تعارض تلقائياً` : `Auto-Fix ${errorsCount} Issues`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Validation Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
        {checks.map((check, idx) => {
          const isError = !check.passed && check.severity === 'error';
          const isWarning = check.severity === 'warning';

          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 transition ${
                isError
                  ? 'bg-red-950/30 border-red-800/60 text-red-200'
                  : isWarning
                  ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                  : 'bg-zinc-900/50 border-zinc-800/70 text-zinc-300'
              }`}
            >
              {isError ? (
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              ) : isWarning ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-semibold block text-[11px]">
                  {isAr ? check.titleAr : check.titleEn}
                </span>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  {isAr ? check.detailAr : check.detailEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
