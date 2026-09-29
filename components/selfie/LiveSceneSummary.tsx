'use client';

import React from 'react';
import { SelfieSceneState } from '@/types/selfie-engine';
import { LOCATIONS_DATABASE, POSE_DEFINITIONS, SCENE_TYPE_DEFINITIONS } from '@/lib/selfie-database';
import { Sparkles, Layers, UserCheck } from 'lucide-react';

interface LiveSceneSummaryProps {
  state: SelfieSceneState;
  armReachMeters: number;
  language: 'ar' | 'en';
}

export function LiveSceneSummary({ state, armReachMeters, language }: LiveSceneSummaryProps) {
  const isAr = language === 'ar';
  const location = LOCATIONS_DATABASE.find((l) => l.id === state.locationId) || LOCATIONS_DATABASE[0];
  const poseDef = POSE_DEFINITIONS[state.pose] || POSE_DEFINITIONS.standing_asymmetric_weight;
  const sceneDef = SCENE_TYPE_DEFINITIONS[state.sceneType];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          {isAr ? 'ملخص المشهد الحي' : 'Scene Summary'}
        </span>
        <span className="text-[10px] font-mono text-zinc-400">Live State</span>
      </div>

      {/* Chips / Compact Rows */}
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        {/* User Selection Chips */}
        <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700/80 text-zinc-200 font-medium">
          {isAr ? sceneDef?.nameAr.split('(')[0] : sceneDef?.nameEn}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700/80 text-zinc-200 font-medium">
          {isAr ? location.nameAr : location.nameEn}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700/80 text-zinc-200 font-medium">
          {isAr ? poseDef.nameAr.split('(')[0] : poseDef.nameEn.split('(')[0]}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700/80 text-zinc-200 font-medium capitalize">
          {state.cameraAngle.replace(/_/g, ' ')}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700/80 text-zinc-200 font-medium capitalize">
          {state.timeOfDay.replace(/_/g, ' ')}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700/80 text-zinc-200 font-medium capitalize">
          {state.backgroundActivity} activity
        </span>

        {/* Engine Inferred Metric Chip */}
        <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 font-mono font-semibold" title={isAr ? 'مدى الذراع المستنتج فيزيائياً' : 'Engine inferred arm reach'}>
          {armReachMeters.toFixed(2)}m
        </span>
      </div>
    </div>
  );
}
