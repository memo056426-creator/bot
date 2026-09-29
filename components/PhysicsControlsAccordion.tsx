'use client';

import React, { useState } from 'react';
import {
  PhysicsPromptConfig,
} from '@/types/physics-engine';
import {
  KELVIN_PRESETS,
  IOR_TABLE,
  SENSOR_FILM_PROFILES,
} from '@/lib/physics-constants';
import {
  SunMedium,
  Camera,
  Layers,
  Activity,
  Dna,
  Clock,
  ShieldAlert,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface PhysicsControlsProps {
  config: PhysicsPromptConfig;
  onChange: (newConfig: PhysicsPromptConfig) => void;
  language: 'ar' | 'en';
}

export function PhysicsControlsAccordion({ config, onChange, language }: PhysicsControlsProps) {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<
    'optics' | 'camera' | 'materials' | 'mechanics' | 'biology' | 'entropy' | 'lexical'
  >('optics');

  // Inverse-Square Calculation
  const intensityFactor = (1 / Math.pow(Math.max(0.2, config.optics.lightDistanceMeters), 2)).toFixed(3);

  const updateOptics = (updates: Partial<typeof config.optics>) => {
    onChange({ ...config, optics: { ...config.optics, ...updates } });
  };

  const updateCamera = (updates: Partial<typeof config.camera>) => {
    onChange({ ...config, camera: { ...config.camera, ...updates } });
  };

  const updateMaterials = (updates: Partial<typeof config.materials>) => {
    // Hard constraint: roughness cannot drop below 0.08
    if (updates.roughness !== undefined && updates.roughness < 0.08) {
      updates.roughness = 0.08;
    }
    onChange({ ...config, materials: { ...config.materials, ...updates } });
  };

  const updateMechanics = (updates: Partial<typeof config.mechanics>) => {
    onChange({ ...config, mechanics: { ...config.mechanics, ...updates } });
  };

  const updateBiology = (updates: Partial<typeof config.biology>) => {
    onChange({ ...config, biology: { ...config.biology, ...updates } });
  };

  const updateEntropy = (updates: Partial<typeof config.entropy>) => {
    onChange({ ...config, entropy: { ...config.entropy, ...updates } });
  };

  const updateLexical = (updates: Partial<typeof config.lexical>) => {
    onChange({ ...config, lexical: { ...config.lexical, ...updates } });
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-zinc-100">
              {isAr ? 'لوحة المعايير الفيزيائية والميكانيكية' : 'Physics & Optical Parameters Studio'}
            </h3>
            <p className="text-xs text-zinc-400">
              {isAr
                ? 'ضبط مباشر لمتغيرات الديناميكا الحرارية، الكاميرا، والبيولوجيا'
                : 'Direct control over optics, exposure, PBR materials & biology'}
            </p>
          </div>
        </div>

        {/* Hard Constraint Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-[11px] text-emerald-300 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{isAr ? 'القيود الفيزيائية الصارمة: مفعلة' : 'Hard Constraints: Enforced'}</span>
        </div>
      </div>

      {/* Tabs / Modules Navigation */}
      <div className="flex gap-1.5 overflow-x-auto py-3 border-b border-zinc-800/60 scrollbar-none text-xs">
        <button
          onClick={() => setActiveTab('optics')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition shrink-0 ${
            activeTab === 'optics'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
          }`}
        >
          <SunMedium className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? '1. البصريات والضوء' : '1. Optics & Kelvin'}</span>
        </button>

        <button
          onClick={() => setActiveTab('camera')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition shrink-0 ${
            activeTab === 'camera'
              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          <span>{isAr ? '2. مثلث الكاميرا' : '2. Camera & Sensor'}</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition shrink-0 ${
            activeTab === 'materials'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? '3. المواد PBR والحرارة' : '3. PBR Materials'}</span>
        </button>

        <button
          onClick={() => setActiveTab('mechanics')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition shrink-0 ${
            activeTab === 'mechanics'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span>{isAr ? '4. الجاذبية والميكانيكا' : '4. Gravity & Dynamics'}</span>
        </button>

        <button
          onClick={() => setActiveTab('biology')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition shrink-0 ${
            activeTab === 'biology'
              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
          }`}
        >
          <Dna className="w-3.5 h-3.5 text-rose-400" />
          <span>{isAr ? '5. البيولوجيا والجلد' : '5. Dermatology & Biology'}</span>
        </button>

        <button
          onClick={() => setActiveTab('entropy')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition shrink-0 ${
            activeTab === 'entropy'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAr ? '6. الإنتروبيا والتقادم' : '6. Temporal Entropy'}</span>
        </button>

        <button
          onClick={() => setActiveTab('lexical')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition shrink-0 ${
            activeTab === 'lexical'
              ? 'bg-red-500/15 text-red-300 border border-red-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span>{isAr ? '7. فلتر التجميل الممنوع' : '7. Anti-Beautification'}</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="pt-4">
        {/* 1. OPTICS TAB */}
        {activeTab === 'optics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kelvin Scale */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'درجة الحرارة اللونية (Kelvin)' : 'Thermodynamic Temperature (K)'}</span>
                  </label>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-bold border border-zinc-700">
                    {config.optics.kelvin}K
                  </span>
                </div>
                <input
                  type="range"
                  min={1800}
                  max={10000}
                  step={100}
                  value={config.optics.kelvin}
                  onChange={(e) => updateOptics({ kelvin: Number(e.target.value) })}
                  className="w-full h-2 bg-gradient-to-r from-amber-600 via-amber-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                  <span>1800K (شمعة)</span>
                  <span>5600K (ضوء شمس)</span>
                  <span>10000K (أزرق سماوي)</span>
                </div>

                {/* Quick Kelvin Presets */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {KELVIN_PRESETS.slice(0, 4).map((k) => (
                    <button
                      key={k.value}
                      onClick={() => updateOptics({ kelvin: k.value })}
                      className={`text-[10px] px-2 py-1 rounded-md border font-mono transition ${
                        config.optics.kelvin === k.value
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                          : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 border-zinc-700'
                      }`}
                    >
                      {k.value}K
                    </button>
                  ))}
                </div>
              </div>

              {/* Inverse Square Law & Distance */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isAr ? 'مسافة المصدر وقانون التربيع العكسي' : 'Inverse-Square Law Distance (d)'}</span>
                  </label>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 font-bold border border-zinc-700">
                    {config.optics.lightDistanceMeters} m
                  </span>
                </div>
                <input
                  type="range"
                  min={0.3}
                  max={12}
                  step={0.1}
                  value={config.optics.lightDistanceMeters}
                  onChange={(e) => updateOptics({ lightDistanceMeters: Number(e.target.value) })}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="mt-2.5 p-2 rounded-lg bg-zinc-950 border border-zinc-800/90 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">I ∝ 1/d² = 1 / ({config.optics.lightDistanceMeters})²</span>
                  <span className="text-cyan-400 font-bold">معامل الشدة: {intensityFactor}x</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inverseSquare"
                    checked={config.optics.inverseSquareLawStrict}
                    onChange={(e) => updateOptics({ inverseSquareLawStrict: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0"
                  />
                  <label htmlFor="inverseSquare" className="text-xs text-zinc-300">
                    {isAr ? 'إلزام انعدام الإضاءة العائمة (منع Flat Light)' : 'Strict Falloff (Disallow infinite flat lighting)'}
                  </label>
                </div>
              </div>
            </div>

            {/* Diegetic Lighting Source */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'مصدر الإضاءة المبرر فيزيائياً في المشهد (Diegetic Source)' : 'Diegetic Light Source in Scene'}
              </label>
              <input
                type="text"
                value={config.optics.diegeticSource}
                onChange={(e) => updateOptics({ diegeticSource: e.target.value })}
                placeholder={isAr ? 'مثال: نافذة شمالية نهارية غير مباشرة، مصباح تنجستن 40 واط، لهب موقد...' : 'e.g., North-facing window, 40W tungsten bulb, single streetlight...'}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <p className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3 text-emerald-400 shrink-0" />
                {isAr
                  ? 'يمنع محركنا أي إضاءة استوديو عائمة غير مبررة بمصدر فيزيائي داخل كادر المشهد.'
                  : 'All photons must trace directly to an in-scene physical emitting or reflective source.'}
              </p>
            </div>

            {/* Volumetrics & Atmospheric Interference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  {isAr ? 'جزيئات الغلاف الجوي المعلقة (Volumetrics)' : 'Atmospheric Volumetric Media'}
                </label>
                <select
                  value={config.optics.volumetricType}
                  onChange={(e) => updateOptics({ volumetricType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="dust_motes">{isAr ? 'ذرات غبار متطايرة (Dust Motes)' : 'Suspended Dust Motes'}</option>
                  <option value="morning_mist">{isAr ? 'ضباب صباحي رطب (Morning Mist)' : 'Morning Mist'}</option>
                  <option value="industrial_smoke">{isAr ? 'دخان صناعي وهباب (Industrial Smoke)' : 'Industrial Smoke'}</option>
                  <option value="sea_spray">{isAr ? 'رذاذ بحري ملحي (Sea Spray)' : 'Salt Sea Spray'}</option>
                  <option value="clean_vacuum">{isAr ? 'هواء نقي تماماً (Clean Vacuum)' : 'Clean Vacuum'}</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-200 mb-1.5">
                  <span>{isAr ? 'كثافة التشتت الضوئي' : 'Atmospheric Scattering Density'}</span>
                  <span className="font-mono text-zinc-400">{(config.optics.volumetricDensity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.optics.volumetricDensity}
                  onChange={(e) => updateOptics({ volumetricDensity: Number(e.target.value) })}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. CAMERA TAB */}
        {activeTab === 'camera' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Sensor / Emulsion */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  {isAr ? 'المستشعر أو الفيلم الكيميائي' : 'Sensor / Chemical Film Emulsion'}
                </label>
                <select
                  value={config.camera.sensorOrFilm}
                  onChange={(e) => updateCamera({ sensorOrFilm: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  {SENSOR_FILM_PROFILES.map((p) => (
                    <option key={p.id} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lens Focal Length */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  {isAr ? 'البعد البؤري للعدسة (Focal Length)' : 'Lens Focal Length'}
                </label>
                <select
                  value={config.camera.lensFocalLength}
                  onChange={(e) => updateCamera({ lensFocalLength: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="24mm wide-angle">24mm Wide Angle (معمار وتوثيق بيئي)</option>
                  <option value="35mm prime">35mm Prime (لقطات شوارع وفيزيائية بشرية)</option>
                  <option value="50mm standard prime">50mm Standard Prime (منظور عين طبيعي)</option>
                  <option value="85mm portrait prime">85mm Portrait (عمق ميدان حقيقي)</option>
                  <option value="100mm macro">100mm Macro (توثيق مسام وميكانيكا دقيقة)</option>
                </select>
              </div>

              {/* Aperture */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  {isAr ? 'فتحة العدسة (Aperture)' : 'Aperture (f-stop)'}
                </label>
                <select
                  value={config.camera.aperture}
                  onChange={(e) => updateCamera({ aperture: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
                >
                  <option value="f/1.4">f/1.4 (عزل خلفية ضحل جداً)</option>
                  <option value="f/2.8">f/2.8 (عزل بصري واقعي)</option>
                  <option value="f/4">f/4 (وضوح متوازن)</option>
                  <option value="f/8">f/8 (حدة تفاصيل عالية)</option>
                  <option value="f/16">f/16 (عمق ميدان شامل)</option>
                </select>
              </div>

              {/* Shutter Speed */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  {isAr ? 'سرعة الغالق (Shutter Speed)' : 'Shutter Speed'}
                </label>
                <select
                  value={config.camera.shutterSpeed}
                  onChange={(e) => updateCamera({ shutterSpeed: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
                >
                  <option value="1/8000s">1/8000s (تجميد حركة الموائع)</option>
                  <option value="1/1000s">1/1000s (حركة سريعة)</option>
                  <option value="1/250s">1/250s (إضاءة نهارية طبيعية)</option>
                  <option value="1/125s">1/125s (بورتريه قياسي)</option>
                  <option value="1/30s">1/30s (إضاءة ليلية خافتة)</option>
                </select>
              </div>

              {/* ISO Sensitivity */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  {isAr ? 'حساسية المستشعر (ISO)' : 'Sensor Sensitivity (ISO)'}
                </label>
                <select
                  value={config.camera.iso}
                  onChange={(e) => updateCamera({ iso: Number(e.target.value) })}
                  className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
                >
                  <option value={100}>ISO 100 (نقاء بصري استثنائي)</option>
                  <option value={400}>ISO 400 (حبيبات فيلم خفيفة)</option>
                  <option value={800}>ISO 800 (إضاءة معتدلة)</option>
                  <option value={1600}>ISO 1600 (حبيبات واضحة)</option>
                  <option value={3200}>ISO 3200 (إضاءة ليلية حقيقية)</option>
                </select>
              </div>
            </div>

            {/* Lens Physical Imperfections */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-200 block mb-2">
                {isAr ? 'تشوهات العدسة البصرية (Physical Optical Aberrations)' : 'Physical Optical Aberrations'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition">
                  <input
                    type="checkbox"
                    checked={config.camera.chromaticAberration}
                    onChange={(e) => updateCamera({ chromaticAberration: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-0"
                  />
                  <span className="text-xs text-zinc-300">
                    {isAr ? 'انحراف لوني (Chromatic Aberration)' : 'Chromatic Aberration'}
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition">
                  <input
                    type="checkbox"
                    checked={config.camera.barrelDistortion}
                    onChange={(e) => updateCamera({ barrelDistortion: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-0"
                  />
                  <span className="text-xs text-zinc-300">
                    {isAr ? 'تشوه برميلي هندسي (Barrel)' : 'Lens Barrel Distortion'}
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition">
                  <input
                    type="checkbox"
                    checked={config.camera.filmGrainOptical}
                    onChange={(e) => updateCamera({ filmGrainOptical: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-0"
                  />
                  <span className="text-xs text-zinc-300">
                    {isAr ? 'حبيبات فيلم كيميائية (Film Grain)' : 'Analog Film Grain'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 3. MATERIALS & THERMODYNAMICS */}
        {activeTab === 'materials' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Roughness (Strict Hard Constraint >= 0.08) */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-200">
                      {isAr ? 'خشونة السطح (PBR Roughness)' : 'Surface Roughness (PBR)'}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                      Min 0.08
                    </span>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 font-bold">
                    {config.materials.roughness.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.08}
                  max={1.0}
                  step={0.02}
                  value={config.materials.roughness}
                  onChange={(e) => updateMaterials({ roughness: Number(e.target.value) })}
                  className="w-full h-2 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                  <span>0.08 (أملس جزئياً - لا لمعان صفري)</span>
                  <span>1.0 (خشن بالكامل / مطفأ)</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                  {isAr
                    ? 'شرط صارم: يمنع النظام البرمجي القيمة 0، فالأسطح في الطبيعة لا تكون ملساء بنسبة 100% مطلقاً.'
                    : 'Hard Constraint: Roughness = 0 is programmatically rejected. Nature never produces frictionless mirrors.'}
                </p>
              </div>

              {/* Metalness */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-200">
                    {isAr ? 'معامل المعدنية (Metalness)' : 'Material Metalness'}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                    {config.materials.metalness.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.materials.metalness}
                  onChange={(e) => updateMaterials({ metalness: Number(e.target.value) })}
                  className="w-full h-2 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                  <span>0.0 (عازل / عضوي / بشرة)</span>
                  <span>1.0 (معدن نقي مصمت)</span>
                </div>
              </div>
            </div>

            {/* IOR (Index of Refraction) & Temperature */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  {isAr ? 'معامل الانكسار البصري (IOR Table)' : 'Index of Refraction (IOR)'}
                </label>
                <select
                  value={config.materials.iorPreset}
                  onChange={(e) => {
                    const presetKey = e.target.value as keyof typeof IOR_TABLE;
                    updateMaterials({
                      iorPreset: presetKey,
                      ior: IOR_TABLE[presetKey]?.value || 1.45,
                    });
                  }}
                  className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500"
                >
                  {Object.entries(IOR_TABLE).map(([k, item]) => (
                    <option key={k} value={k}>
                      {item.label} (IOR {item.value})
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-[11px] text-cyan-300 font-mono">
                  {isAr ? 'قيمة التشتت تحت السطحي المحسوبة:' : 'Calculated SSS Refractive Index:'}{' '}
                  <span className="font-bold">{config.materials.ior}</span>
                </div>
              </div>

              {/* Ambient Temperature & Schlieren */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-200">
                    {isAr ? 'درجة الحرارة المحيطة (°C)' : 'Ambient Temperature (°C)'}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-orange-400 font-bold">
                    {config.materials.ambientTempCelsius}°C
                  </span>
                </div>
                <input
                  type="range"
                  min={-20}
                  max={55}
                  step={1}
                  value={config.materials.ambientTempCelsius}
                  onChange={(e) => updateMaterials({ ambientTempCelsius: Number(e.target.value) })}
                  className="w-full h-2 bg-gradient-to-r from-blue-500 via-amber-400 to-rose-600 rounded-lg appearance-none cursor-pointer"
                />

                <div className="mt-2.5">
                  <label className="text-[11px] text-zinc-300 block mb-1">
                    {isAr ? 'التأثير الحراري الفيزيائي الثانوي:' : 'Secondary Thermodynamic Effect:'}
                  </label>
                  <select
                    value={config.materials.thermalEffect}
                    onChange={(e) => updateMaterials({ thermalEffect: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  >
                    <option value="none">{isAr ? 'لا تأثير حراري إضافي' : 'None'}</option>
                    <option value="schlieren_heat_distortion">
                      {isAr ? 'تموجات بصرية حرارية (Schlieren Effect)' : 'Schlieren Heat Distortion'}
                    </option>
                    <option value="sweat_micro_droplets">
                      {isAr ? 'إفراز قطرات عرق دقيقة (Sweat Droplets)' : 'Sweat Micro-Droplets'}
                    </option>
                    <option value="condensation_frost">
                      {isAr ? 'تكثف رطوبة / صقيع مادي (Condensation)' : 'Surface Condensation / Frost'}
                    </option>
                    <option value="evaporation_steam">
                      {isAr ? 'بخار تصاعدي حراري (Thermal Evaporation)' : 'Evaporation Steam'}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. MECHANICS & GRAVITY */}
        {activeTab === 'mechanics' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-200">
                  {isAr ? 'ثابت الجاذبية الأرضية (g = 9.8 m/s²)' : 'Gravitational Acceleration Vector (g)'}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-purple-300 font-bold">
                  9.80 m/s²
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'يتم تطبيق متجهة الجاذبية الفيزيائية إجبارياً على تدلي الأقمشة، وانثناء وتمدد الأنسجة العضلية والجلد، واستقرار مركز الكتلة (Center of Mass).'
                  : 'Enforces gravitational vector downward, physically calculating fabric draping, biological skin/fat tension, and pose equilibrium.'}
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.mechanics.centerOfMassEnforced}
                    onChange={(e) => updateMechanics({ centerOfMassEnforced: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-purple-500 focus:ring-0"
                  />
                  <span className="text-xs text-zinc-300">
                    {isAr ? 'التحقق من توازن مركز الثقل (رفض الوضعيات الخارقة للفيزياء)' : 'Enforce Center of Mass Equilibrium'}
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.mechanics.fabricSagAndTension}
                    onChange={(e) => updateMechanics({ fabricSagAndTension: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-purple-500 focus:ring-0"
                  />
                  <span className="text-xs text-zinc-300">
                    {isAr ? 'محاكاة وزن وثقل الأنسجة والأقمشة' : 'Simulate Fabric Sag & Tissue Tension'}
                  </span>
                </label>
              </div>
            </div>

            {/* Fluid Dynamics */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'ديناميكا الموائع والقصور الذاتي (Fluid Dynamics & Inertia)' : 'Fluid Dynamics & Kinematics'}
              </label>
              <select
                value={config.mechanics.fluidDynamics}
                onChange={(e) => updateMechanics({ fluidDynamics: e.target.value as any })}
                className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
              >
                <option value="none">{isAr ? 'لا سوائل نشطة في المشهد' : 'None'}</option>
                <option value="water_splash_momentum">
                  {isAr ? 'ارتطام مائي وتناثر قطرات حسب القصور الذاتي' : 'Water Splash & Inertia Droplets'}
                </option>
                <option value="viscous_oil_drag">
                  {isAr ? 'لزوجة زيتية عالية وجريان بطيء' : 'Viscous Oil Drag & Surface Adhesion'}
                </option>
                <option value="surface_tension_droplet">
                  {isAr ? 'توتر سطحي وتكوّن قطرات كروية كلاسيكية' : 'Surface Tension Spherical Beads'}
                </option>
                <option value="powder_turbulent_drift">
                  {isAr ? 'تطاير غبار أو مسحوق مضطرب' : 'Turbulent Powder Drift'}
                </option>
              </select>
            </div>
          </div>
        )}

        {/* 5. BIOLOGY & DERMATOLOGY */}
        {activeTab === 'biology' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">
                  {isAr ? 'تفعيل وحدة الكائنات الحية والبشر (Living Subject)' : 'Include Living Subject / Humans'}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {isAr ? 'تفعيل بروتوكول مكافحة البشرة البلاستيكية' : 'Unlocks anti-plastic biological protocols'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.biology.includeLivingSubject}
                onChange={(e) => updateBiology({ includeLivingSubject: e.target.checked })}
                className="w-5 h-5 rounded bg-zinc-800 border-zinc-700 text-rose-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {config.biology.includeLivingSubject && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Vellus Hair */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-200">
                      {isAr ? 'زغب الخوخ (Vellus Hair)' : 'Translucent Vellus Hair'}
                    </span>
                    <input
                      type="checkbox"
                      checked={config.biology.vellusHair}
                      onChange={(e) => updateBiology({ vellusHair: e.target.checked })}
                      className="rounded bg-zinc-800 border-zinc-700 text-rose-500 focus:ring-0"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {isAr
                      ? 'شعيرات دقيقة جداً وشفافة على حواف الوجه والجسم تضيء عند تفاعلها مع الإضاءة الخلفية (Backlight rim).'
                      : 'Microscopic translucent peach fuzz illuminated along facial silhouettes.'}
                  </p>
                </div>

                {/* Non-uniform Sebum */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-200">
                      {isAr ? 'توزيع الزهم الطبيعي (Sebum Maps)' : 'Non-Uniform Sebum Specularity'}
                    </span>
                    <input
                      type="checkbox"
                      checked={config.biology.nonUniformSebum}
                      onChange={(e) => updateBiology({ nonUniformSebum: e.target.checked })}
                      className="rounded bg-zinc-800 border-zinc-700 text-rose-500 focus:ring-0"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {isAr
                      ? 'لمعان زيتي غير متساوٍ على منطقة T-Zone والأنف، لمنع اللمعان التجميلي البلاستيكي.'
                      : 'Natural uneven skin oiliness, strictly prohibiting synthetic cosmetic highlighters.'}
                  </p>
                </div>

                {/* Capillary Mapping */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-200">
                      {isAr ? 'خرائط الشعيرات الدموية (Capillaries)' : 'Subdermal Capillary Mapping'}
                    </span>
                    <input
                      type="checkbox"
                      checked={config.biology.capillaryMapping}
                      onChange={(e) => updateBiology({ capillaryMapping: e.target.checked })}
                      className="rounded bg-zinc-800 border-zinc-700 text-rose-500 focus:ring-0"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {isAr
                      ? 'تورد غير متجانس وأوردة دقيقة تحت الجلد تكسر اللون الموحد للبشرة.'
                      : 'Micro-vascular flushing and hemoglobin undertones preventing flat monochrome flesh.'}
                  </p>
                </div>

                {/* Micro Asymmetry */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-200">
                      {isAr ? 'عدم التماثل البشري الدقيق (Micro-Asymmetry)' : 'Micro-Anatomical Asymmetry'}
                    </span>
                    <input
                      type="checkbox"
                      checked={config.biology.microAsymmetry}
                      onChange={(e) => updateBiology({ microAsymmetry: e.target.checked })}
                      className="rounded bg-zinc-800 border-zinc-700 text-rose-500 focus:ring-0"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {isAr
                      ? 'كسر التماثل التام في فتحات العيون والحواجب والمسام.'
                      : 'Procedural noise breaking artificial bilateral facial symmetry.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. TEMPORAL ENTROPY */}
        {activeTab === 'entropy' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'مرحلة التآكل والتقادم الزمني (Temporal Weathering)' : 'Temporal Weathering Stage'}
              </label>
              <select
                value={config.entropy.temporalWear}
                onChange={(e) => updateEntropy({ temporalWear: e.target.value as any })}
                className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
              >
                <option value="pristine_industrial">{isAr ? 'تشغيل صناعي حديث (Pristine Industrial)' : 'Pristine Industrial'}</option>
                <option value="moderate_wear">{isAr ? 'استخدام طبيعي معتاد (Moderate Wear)' : 'Moderate Wear'}</option>
                <option value="heavy_weathering">{isAr ? 'تقادم مناخي شديد (Heavy Weathering)' : 'Heavy Weathering'}</option>
                <option value="ancient_decay">{isAr ? 'تآكل أثري متقدم وإنتروبيا عالية (Ancient Decay)' : 'Ancient Decay'}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.entropy.uvDegradation}
                  onChange={(e) => updateEntropy({ uvDegradation: e.target.checked })}
                  className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-medium text-zinc-200 block">
                    {isAr ? 'بهتان الأشعة UV' : 'UV Degradation'}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {isAr ? 'شحوب ألوان الأسطح المشمسة' : 'Solar color bleaching'}
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.entropy.oxidationRust}
                  onChange={(e) => updateEntropy({ oxidationRust: e.target.checked })}
                  className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-medium text-zinc-200 block">
                    {isAr ? 'الأكسدة والصدأ' : 'Oxidation & Rust'}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {isAr ? 'تفاعل كيميائي مع الرطوبة' : 'Chemical moisture patina'}
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.entropy.ambientOcclusionDirt}
                  onChange={(e) => updateEntropy({ ambientOcclusionDirt: e.target.checked })}
                  className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-medium text-zinc-200 block">
                    {isAr ? 'غبار الزوايا العميقة' : 'Crevice AO Grime'}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {isAr ? 'تراكم في زوايا الظل المحيطي' : 'Ambient occlusion dirt'}
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* 7. LEXICAL FILTER */}
        {activeTab === 'lexical' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-red-900/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-semibold text-zinc-200">
                    {isAr ? 'شطب كلمات التجميل التلقائي (Blacklist Auto-Scrub)' : 'Anti-Beautification Lexical Scrubber'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.lexical.autoScrubBlacklist}
                  onChange={(e) => updateLexical({ autoScrubBlacklist: e.target.checked })}
                  className="rounded bg-zinc-800 border-zinc-700 text-red-500 focus:ring-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'يقوم المحرك بشطب أي مصطلحات سطحية تسبب تشويه الذكاء الاصطناعي (مثل: beautiful, flawless, 3d render, glowing, cinematic, smooth) واستبدالها بقيود فيزيائية.'
                  : 'Scans and purges qualitative buzzwords that trigger AI smoothing and airbrushed plastic rendering.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-emerald-900/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-zinc-200">
                    {isAr ? 'حقن المصطلحات التوثيقية المعتمدة (Whitelist Auto-Inject)' : 'Physical Whitelist Injection'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.lexical.autoInjectWhitelist}
                  onChange={(e) => updateLexical({ autoInjectWhitelist: e.target.checked })}
                  className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'يتم إدراج مصطلحات توثيقية تلقائياً: (macro documentation, dermatological detail, raw unedited capture, inverse-square attenuation).'
                  : 'Injects precision scientific tokens forcing the models to prioritize physical documentation.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
