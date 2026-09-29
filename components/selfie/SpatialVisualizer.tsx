'use client';

import React from 'react';
import { SelfieSceneState } from '@/types/selfie-engine';
import { POSE_DEFINITIONS, LOCATIONS_DATABASE } from '@/lib/selfie-database';
import { Smartphone, Compass, Sun, MapPin, Footprints, Armchair, ShieldCheck } from 'lucide-react';

interface SpatialVisualizerProps {
  state: SelfieSceneState;
  armReachMeters: number;
  language: 'ar' | 'en';
}

export function SpatialVisualizer({ state, armReachMeters, language }: SpatialVisualizerProps) {
  const isAr = language === 'ar';
  const location = LOCATIONS_DATABASE.find((l) => l.id === state.locationId) || LOCATIONS_DATABASE[0];
  const poseDef = POSE_DEFINITIONS[state.pose] || POSE_DEFINITIONS.standing_asymmetric_weight;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 text-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <span className="font-semibold text-zinc-300 text-xs flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          {isAr ? 'القياسات الفراغية والهندسية الحقيقية (Spatial Metrics)' : 'Spatial & Biomechanical Metrics'}
        </span>
        <span className="text-[10px] text-zinc-400 font-mono">
          {location.nameAr}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Arm Reach */}
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] uppercase font-semibold">{isAr ? 'مدى الذراع' : 'Arm Reach'}</span>
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-mono font-bold text-emerald-400">
              {armReachMeters.toFixed(2)}
            </span>
            <span className="text-[10px] text-zinc-500">meters</span>
          </div>
          <span className="text-[9px] text-emerald-500/90 mt-0.5">
            {state.sceneType === 'mirror_selfie'
              ? (isAr ? 'مسار انعكاس للمرآة' : 'Mirror ray distance')
              : (isAr ? 'في نطاق الذراع البشري' : 'Within natural arm span')}
          </span>
        </div>

        {/* Biomechanics Support */}
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] uppercase font-semibold">{isAr ? 'الارتكاز والدعم' : 'Ground Support'}</span>
            {poseDef.requiresSupport ? (
              <Armchair className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Footprints className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
          <span className="text-xs font-bold text-zinc-200 line-clamp-1">
            {poseDef.requiresSupport ? (isAr ? 'مقعد مع انضغاط' : 'Seated Cushion') : (isAr ? 'أرضية ثابتة' : 'Grounded Feet')}
          </span>
          <span className="text-[9px] text-zinc-400 mt-0.5">
            g = 9.80 m/s² (متجهة الجاذبية)
          </span>
        </div>

        {/* Camera Angle */}
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] uppercase font-semibold">{isAr ? 'زاوية الكاميرا' : 'Camera Angle'}</span>
            <Compass className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-xs font-bold text-zinc-200 capitalize">
            {state.cameraAngle.replace(/_/g, ' ')}
          </span>
          <span className="text-[9px] text-zinc-400 mt-0.5">
            {state.framing.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Diegetic Lighting */}
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] uppercase font-semibold">{isAr ? 'مصدر الإضاءة' : 'Lighting Origin'}</span>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-amber-300 line-clamp-1 capitalize">
            {state.lighting.replace(/_/g, ' ')}
          </span>
          <span className="text-[9px] text-zinc-400 mt-0.5 capitalize">
            {state.timeOfDay.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}
