'use client';

import React, { useState } from 'react';
import {
  PhysicsPromptConfig,
  GeneratedPrompts,
  TargetEngine,
  PhysicsIntensity,
} from '@/types/physics-engine';
import {
  SelfieSceneState,
  CompiledSelfiePrompt,
} from '@/types/selfie-engine';
import { DEFAULT_CONFIG, PromptPreset } from '@/lib/physics-constants';
import { compileLocalPrompts } from '@/lib/prompt-compiler';
import { DEFAULT_SELFIE_STATE } from '@/lib/selfie-database';
import { compileSelfiePrompts, runPhysicalValidation } from '@/lib/selfie-compiler';

import { Navbar } from '@/components/Navbar';
import { PresetSelector } from '@/components/PresetSelector';
import { InputWorkbench } from '@/components/InputWorkbench';
import { PhysicsControlsAccordion } from '@/components/PhysicsControlsAccordion';
import { OutputDisplay } from '@/components/OutputDisplay';
import { SimulationModal } from '@/components/SimulationModal';
import { RulesDocumentationModal } from '@/components/RulesDocumentationModal';

// Selfie Engine Components
import { SelfiePresetsBar, SelfieArchetype } from '@/components/selfie/SelfiePresetsBar';
import { SelfieSceneComposer } from '@/components/selfie/SelfieSceneComposer';
import { PhysicalValidationCard } from '@/components/selfie/PhysicalValidationCard';
import { SpatialVisualizer } from '@/components/selfie/SpatialVisualizer';
import { SelfieOutputView } from '@/components/selfie/SelfieOutputView';

import { Atom, Smartphone, Sparkles, Layers, ShieldCheck, Compass } from 'lucide-react';

export default function Home() {
  const [appMode, setAppMode] = useState<'selfie' | 'general_physics'>('selfie');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  // General Physics State
  const [physicsConfig, setPhysicsConfig] = useState<PhysicsPromptConfig>(DEFAULT_CONFIG);
  const [activePresetId, setActivePresetId] = useState<string>('forensic_blacksmith');
  const [isGeneratingPhysics, setIsGeneratingPhysics] = useState(false);
  const [physicsPrompts, setPhysicsPrompts] = useState<GeneratedPrompts>(() =>
    compileLocalPrompts(DEFAULT_CONFIG)
  );

  // Selfie Compatibility State
  const [selfieState, setSelfieState] = useState<SelfieSceneState>(DEFAULT_SELFIE_STATE);
  const [activeArchetypeId, setActiveArchetypeId] = useState<string>('jeddah_corniche_sunset');
  const [selfiePrompts, setSelfiePrompts] = useState<CompiledSelfiePrompt>(() =>
    compileSelfiePrompts(DEFAULT_SELFIE_STATE)
  );

  // Modals
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const isAr = language === 'ar';

  // Handlers for General Physics
  const handleSelectPreset = (preset: PromptPreset) => {
    setActivePresetId(preset.id);
    const updated = {
      ...physicsConfig,
      ...preset.config,
      optics: { ...physicsConfig.optics, ...(preset.config.optics || {}) },
      camera: { ...physicsConfig.camera, ...(preset.config.camera || {}) },
      materials: { ...physicsConfig.materials, ...(preset.config.materials || {}) },
      mechanics: { ...physicsConfig.mechanics, ...(preset.config.mechanics || {}) },
      biology: { ...physicsConfig.biology, ...(preset.config.biology || {}) },
      entropy: { ...physicsConfig.entropy, ...(preset.config.entropy || {}) },
    };
    setPhysicsConfig(updated);
    setPhysicsPrompts(compileLocalPrompts(updated));
  };

  const handleGeneratePhysics = async () => {
    setIsGeneratingPhysics(true);
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(physicsConfig),
      });

      if (!response.ok) {
        throw new Error('Server prompt generation failed');
      }

      const data = await response.json();
      setPhysicsPrompts(data);
    } catch (err) {
      console.warn('Fallback to instant local deterministic compilation:', err);
      setPhysicsPrompts(compileLocalPrompts(physicsConfig));
    } finally {
      setIsGeneratingPhysics(false);
    }
  };

  const handleReset = () => {
    if (appMode === 'selfie') {
      setSelfieState(DEFAULT_SELFIE_STATE);
      setActiveArchetypeId('');
      setSelfiePrompts(compileSelfiePrompts(DEFAULT_SELFIE_STATE));
    } else {
      setPhysicsConfig(DEFAULT_CONFIG);
      setActivePresetId('');
      setPhysicsPrompts(compileLocalPrompts(DEFAULT_CONFIG));
    }
  };

  // Handlers for Selfie Engine
  const handleSelfieStateChange = (newState: SelfieSceneState) => {
    setSelfieState(newState);
    setSelfiePrompts(compileSelfiePrompts(newState));
  };

  const handleSelectSelfieArchetype = (archetype: SelfieArchetype) => {
    setActiveArchetypeId(archetype.id);
    const updated = {
      ...selfieState,
      ...archetype.state,
    };
    setSelfieState(updated);
    setSelfiePrompts(compileSelfiePrompts(updated));
  };

  const handleSelfieAutoFix = () => {
    const { correctedState } = runPhysicalValidation(selfieState);
    setSelfieState(correctedState);
    setSelfiePrompts(compileSelfiePrompts(correctedState));
  };

  const getCurrentPromptForSim = (): string => {
    if (appMode === 'selfie') {
      return selfiePrompts.chatgptPrompt;
    }
    switch (physicsConfig.targetEngine) {
      case 'chatgpt':
        return physicsPrompts.chatgptPrompt;
      case 'gemini':
        return physicsPrompts.geminiPrompt;
      case 'image_gen':
        return physicsPrompts.imageGenPrompt;
      case 'json':
        return physicsPrompts.jsonSpecification;
      default:
        return physicsPrompts.chatgptPrompt;
    }
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200"
    >
      {/* Top Navigation */}
      <Navbar
        language={language}
        onToggleLanguage={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        onOpenRules={() => setIsRulesOpen(true)}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        {/* Mode Switcher Banner */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
            <button
              onClick={() => setAppMode('selfie')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                appMode === 'selfie'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{isAr ? 'سيلفي التوافق المشهدي (Scene Compatibility Studio)' : 'Selfie Scene Compatibility Studio'}</span>
            </button>

            <button
              onClick={() => setAppMode('general_physics')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                appMode === 'general_physics'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Atom className="w-4 h-4" />
              <span>{isAr ? 'المحرك الفيزيائي العام (General Physics Engine)' : 'General Physics Engine'}</span>
            </button>
          </div>
        </div>

        {/* MODE 1: SELFIE SCENE COMPATIBILITY WORKSTATION (2-COLUMN SPLIT STUDIO) */}
        {appMode === 'selfie' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <section className="text-center space-y-2 relative py-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>
                  {isAr
                    ? 'نظام التوافق المشهدي: Location → Pose → Geometry → Light → Physics'
                    : 'Real-Time Scene Compatibility & Biomechanics Engine'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100">
                {isAr ? (
                  <>
                    استوديو توليد سيلفي واقعي لـ{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                      ChatGPT و Gemini
                    </span>
                  </>
                ) : (
                  <>
                    Realistic Selfie Scene Studio for{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                      ChatGPT & Gemini
                    </span>
                  </>
                )}
              </h1>

              <p className="max-w-2xl mx-auto text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'صورة هاتف حقيقية التقطها شخص في مكان حقيقي وليس جلسة تصوير مصطنعة. فلترة تلقائية تمنع التناقضات الفيزيائية بمسافة الذراع وانضغاط المقعد والإضاءة المبررة.'
                  : 'Authentic smartphone front-camera selfies. Automatically enforces arm-reach limits, seat compression, and diegetic lighting.'}
              </p>
            </section>

            {/* Quick Selfie Archetypes Bar */}
            <SelfiePresetsBar
              onSelectArchetype={handleSelectSelfieArchetype}
              activeId={activeArchetypeId}
              language={language}
            />

            {/* TWO-COLUMN WORKSTATION STUDIO GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Right / Left Column 1: Progressive 4-Stage Stepper Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <SelfieSceneComposer
                  state={selfieState}
                  onChange={handleSelfieStateChange}
                  language={language}
                />
              </div>

              {/* Right / Left Column 2: Sticky Studio Monitor & Live Prompt Terminal (5 cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
                {/* Spatial Metrics Visualizer */}
                <SpatialVisualizer
                  state={selfieState}
                  armReachMeters={selfiePrompts.spatialSummary.armReachMeters}
                  language={language}
                />

                {/* Physical Validation Matrix Card (15 rules check + 1-click Auto-Fix) */}
                <PhysicalValidationCard
                  checks={selfiePrompts.validationReport.checks}
                  passedAll={selfiePrompts.validationReport.passedAll}
                  onAutoFix={handleSelfieAutoFix}
                  language={language}
                />

                {/* Live Compiled Prompt Output Terminal */}
                <SelfieOutputView
                  compiled={selfiePrompts}
                  onSimulate={() => setIsSimulationOpen(true)}
                  language={language}
                />
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: GENERAL PHYSICS ENGINE */}
        {appMode === 'general_physics' && (
          <div className="space-y-6 sm:space-y-8">
            <section className="text-center space-y-2 relative py-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                <Atom className="w-3.5 h-3.5" />
                <span>
                  {isAr
                    ? 'المحرك الفيزيائي: بصريات، حرارة، وميكانيكا كلاسيكية'
                    : 'General Optical, Thermal & Classical Mechanics Simulation'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100">
                {isAr ? (
                  <>
                    محرك البرومبت الفيزيائي العام لـ{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                      ChatGPT و Gemini
                    </span>
                  </>
                ) : (
                  <>
                    General Physics Prompt Engine for{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                      ChatGPT & Gemini
                    </span>
                  </>
                )}
              </h1>

              <p className="max-w-2xl mx-auto text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'قانون التربيع العكسي لتضاؤل الضوء (1/d²)، مثلث التعريض الحقيقي للكاميرا، درجات حرارة كلفن، وخشونة PBR غير الصفرية لمنع التجميل والتنعيم الاصطناعي.'
                  : 'Deconstruct reality into deterministic physical variables: inverse-square light attenuation (1/d²), camera exposure triangles, thermodynamic Kelvin scales, and non-zero PBR roughness.'}
              </p>
            </section>

            {/* Presets */}
            <PresetSelector
              language={language}
              onSelectPreset={handleSelectPreset}
              activePresetId={activePresetId}
            />

            {/* Input Workbench */}
            <InputWorkbench
              userIdea={physicsConfig.userIdea}
              onChangeUserIdea={(idea) => {
                const next = { ...physicsConfig, userIdea: idea };
                setPhysicsConfig(next);
                setPhysicsPrompts(compileLocalPrompts(next));
              }}
              targetEngine={physicsConfig.targetEngine}
              onChangeTargetEngine={(engine: TargetEngine) => {
                const next = { ...physicsConfig, targetEngine: engine };
                setPhysicsConfig(next);
                setPhysicsPrompts(compileLocalPrompts(next));
              }}
              intensity={physicsConfig.intensity}
              onChangeIntensity={(intensity: PhysicsIntensity) => {
                const next = { ...physicsConfig, intensity };
                setPhysicsConfig(next);
                setPhysicsPrompts(compileLocalPrompts(next));
              }}
              onGenerate={handleGeneratePhysics}
              isGenerating={isGeneratingPhysics}
              language={language}
            />

            {/* Output Display */}
            <OutputDisplay
              prompts={physicsPrompts}
              targetEngine={physicsConfig.targetEngine}
              onRunSimulation={() => setIsSimulationOpen(true)}
              language={language}
            />

            {/* Controls Accordion */}
            <PhysicsControlsAccordion
              config={physicsConfig}
              onChange={(newConfig) => {
                setPhysicsConfig(newConfig);
                setPhysicsPrompts(compileLocalPrompts(newConfig));
              }}
              language={language}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        promptText={getCurrentPromptForSim()}
        targetEngine={appMode === 'selfie' ? 'chatgpt' : physicsConfig.targetEngine}
        language={language}
      />

      <RulesDocumentationModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-800/80 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-zinc-400">
              {isAr ? 'استوديو سيلفي التوافق المشهدي والفيزياء الواقعية' : 'Selfie Scene Compatibility & Physics Studio'}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">v3.8 Flash</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            {isAr
              ? 'مبني وفق ميثاق التوافق المشهدي ومنع التجميل الرقمي لنماذج ChatGPT و Gemini ومولدات الصور.'
              : 'Engineered according to scene compatibility standards & anti-smoothing constraints for ChatGPT & Gemini.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
