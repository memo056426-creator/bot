'use client';

import React, { useState } from 'react';
import { SelfieSceneState } from '@/types/selfie-engine';
import { POSE_DEFINITIONS, LOCATIONS_DATABASE } from '@/lib/selfie-database';
import {
  Compass,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Cpu,
  UserCheck,
  Footprints,
  Armchair,
  Sun,
  ShieldCheck,
} from 'lucide-react';

interface SpatialVisualizerProps {
  state: SelfieSceneState;
  armReachMeters: number;
  language: 'ar' | 'en';
}

export function SpatialVisualizer({ state, armReachMeters, language }: SpatialVisualizerProps) {
  const isAr = language === 'ar';
  const [showDetails, setShowDetails] = useState(false);

  const location = LOCATIONS_DATABASE.find((l) => l.id === state.locationId) || LOCATIONS_DATABASE[0];
  const poseDef = POSE_DEFINITIONS[state.pose] || POSE_DEFINITIONS.standing_asymmetric_weight;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-3 shadow-lg">
      {/* Header with Title and Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          {isAr ? 'القياسات الفراغية' : 'Spatial Metrics'}
        </span>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition"
        >
          <span>
            {showDetails
              ? (isAr ? 'إخفاء التفاصيل' : 'Hide Details')
              : (isAr ? 'عرض التفاصيل الفيزيائية' : 'View Physics Details')}
          </span>
          {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* COMPACT CORE METRICS (Requirement 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80">
          <span className="text-[10px] text-zinc-500 block">{isAr ? 'المسافة' : 'Distance'}</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">{armReachMeters.toFixed(2)} m</span>
        </div>

        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80">
          <span className="text-[10px] text-zinc-500 block">{isAr ? 'الكاميرا' : 'Camera'}</span>
          <span className="font-semibold text-zinc-200 capitalize truncate block">
            {state.cameraAngle.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80">
          <span className="text-[10px] text-zinc-500 block">{isAr ? 'التأطير' : 'Framing'}</span>
          <span className="font-semibold text-zinc-200 capitalize truncate block">
            {state.framing.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80">
          <span className="text-[10px] text-zinc-500 block">{isAr ? 'الإضاءة' : 'Lighting'}</span>
          <span className="font-semibold text-amber-300 capitalize truncate block">
            {state.lighting.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* EXPANDABLE FULL DETAILS: USER CHOICE VS ENGINE INFERENCE (Requirement 8) */}
      {showDetails && (
        <div className="pt-2 border-t border-zinc-800/80 space-y-3 animate-in fade-in text-xs">
          {/* Section A: User Selection */}
          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-400 font-semibold text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-zinc-300" />
              <span>{isAr ? 'اختيارات المستخدم (User Selection):' : 'User Selection:'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
              <div>
                <span className="text-zinc-500 block text-[10px]">{isAr ? 'الموقع:' : 'Location:'}</span>
                <span className="font-medium">{location.nameAr}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">{isAr ? 'الوضعية:' : 'Pose:'}</span>
                <span className="font-medium">{poseDef.nameAr.split('(')[0]}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">{isAr ? 'الوقت والطقس:' : 'Time & Weather:'}</span>
                <span className="capitalize">{state.timeOfDay.replace(/_/g, ' ')} | {state.weather.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">{isAr ? 'الملابس:' : 'Clothing:'}</span>
                <span className="truncate block">{state.clothingType}</span>
              </div>
            </div>
          </div>

          {/* Section B: Engine Inference */}
          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <Cpu className="w-3.5 h-3.5" />
              <span>{isAr ? 'استنتاجات المحرك الفيزيائي (Engine Inference):' : 'Engine Inference:'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-1.5 rounded bg-zinc-950/80 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">{isAr ? 'مدى الذراع المحسوب:' : 'Calculated Arm Reach:'}</span>
                <span className="font-mono text-emerald-300 font-bold">{armReachMeters.toFixed(2)} m (Within physiological limit)</span>
              </div>

              <div className="p-1.5 rounded bg-zinc-950/80 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">{isAr ? 'ارتكاز وتماسك السطح:' : 'Support & Contact Plane:'}</span>
                <span className="text-zinc-300">
                  {poseDef.requiresSupport ? (isAr ? 'مقعد منضغط بكتلة الجسم' : 'Body cushion mass compression') : (isAr ? 'ثبات أقدام غير متماثل مع الجاذبية' : 'Asymmetric ground weight transfer')}
                </span>
              </div>

              <div className="p-1.5 rounded bg-zinc-950/80 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">{isAr ? 'العلاقة الفراغية للكاميرا:' : 'Spatial Camera Relationship:'}</span>
                <span className="text-zinc-300">{state.cameraPosition.replace(/_/g, ' ')} ({state.cameraAngle.replace(/_/g, ' ')})</span>
              </div>

              <div className="p-1.5 rounded bg-zinc-950/80 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">{isAr ? 'توافق الإضاءة البيئية:' : 'Lighting Compatibility:'}</span>
                <span className="text-amber-300 capitalize">{state.lighting.replace(/_/g, ' ')} (Diegetic in-scene origin)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
