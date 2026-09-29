'use client';

import React, { useState } from 'react';
import { PhysicalValidationItem } from '@/types/selfie-engine';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Wrench, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showDetails, setShowDetails] = useState(false);

  const errors = checks.filter((c) => !c.passed && c.severity === 'error');
  const warnings = checks.filter((c) => c.severity === 'warning');
  const passedCount = checks.filter((c) => c.passed).length;
  const totalCount = checks.length;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-2.5 shadow-lg">
      {/* COMPACT SUMMARY (Requirements 9 & 10) */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {passedAll ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-zinc-100">
                {passedAll
                  ? (isAr ? 'لم يتم رصد أي تعارض فيزيائي' : 'No physical conflicts detected')
                  : (isAr ? `⚠ تم رصد ${errors.length} تعارض فيزيائي` : `⚠ ${errors.length} physical conflict detected`)}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                ({passedCount}/{totalCount} {isAr ? 'قواعد' : 'checks'})
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: Auto-Fix if error, plus View Details toggle */}
        <div className="flex items-center gap-2">
          {!passedAll && onAutoFix && (
            <button
              onClick={onAutoFix}
              className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-[11px] flex items-center gap-1 transition"
            >
              <Wrench className="w-3 h-3" />
              <span>{isAr ? 'إصلاح التعارض' : 'Auto-Fix'}</span>
            </button>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-medium transition"
          >
            <span>
              {showDetails
                ? (isAr ? 'إخفاء الفحوصات' : 'Hide Checks')
                : (isAr ? 'عرض تفاصيل الفحص' : 'View Validation Details')}
            </span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* EXPANDABLE VALIDATION DETAILS */}
      {showDetails && (
        <div className="pt-2 border-t border-zinc-800 space-y-2 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {checks.map((check, idx) => {
              const isError = !check.passed && check.severity === 'error';
              const isWarning = check.severity === 'warning';

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border flex items-start gap-2 ${
                    isError
                      ? 'bg-red-950/20 border-red-800/50 text-red-200'
                      : isWarning
                      ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {isError ? (
                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
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
      )}
    </div>
  );
}
