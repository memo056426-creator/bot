'use client';

import React, { useState, useRef } from 'react';
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
import { LiveSceneSummary } from '@/components/selfie/LiveSceneSummary';

import { Atom, Smartphone, Compass } from 'lucide-react';

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

  // Ref to scroll to prompt output
  const promptOutputRef = useRef<HTMLDivElement>(null);

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

  const handleScrollToPrompt = () => {
    if (promptOutputRef.current) {
      promptOutputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      {/* 1. HEADER (Requirement 1: Compact, clean, with integrated Mode Selector) */}
      <Navbar
        language={language}
        onToggleLanguage={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        onOpenRules={() => setIsRulesOpen(true)}
        onReset={handleReset}
        appMode={appMode}
        onSelectMode={(mode) => setAppMode(mode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* MODE 1: SELFIE SCENE COMPATIBILITY STUDIO */}
        {appMode === 'selfie' && (
          <div className="space-y-4 sm:space-y-5">
            {/* 5. QUICK PRESETS (Requirement 5: Compact, collapsible section) */}
            <SelfiePresetsBar
              onSelectArchetype={handleSelectSelfieArchetype}
              activeId={activeArchetypeId}
              language={language}
            />

            {/* 14 & 15. RESPONSIVE WORKSTATION ARCHITECTURE: Mobile First, Desktop Expanded */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
              {/* PRIMARY COLUMN: Main Workflow Scene Builder (7 cols on lg, full width on mobile) */}
              <div className="lg:col-span-7 space-y-4">
                {/* 2, 3, 4. MAIN WORKFLOW: 4-Stage Wizard with Sticky Progress & Fixed Navigation */}
                <SelfieSceneComposer
                  state={selfieState}
                  onChange={handleSelfieStateChange}
                  onGeneratePrompt={handleScrollToPrompt}
                  language={language}
                />
              </div>

              {/* SECONDARY & TECHNICAL COLUMN: Summary, Spatial Metrics, Validation, Output (5 cols on lg) */}
              <div className="lg:col-span-5 space-y-3.5 lg:sticky lg:top-18">
                {/* 6. LIVE SCENE SUMMARY (Requirement 6: Compact Chips/Rows) */}
                <LiveSceneSummary
                  state={selfieState}
                  armReachMeters={selfiePrompts.spatialSummary.armReachMeters}
                  language={language}
                />

                {/* 9 & 10. PHYSICAL VALIDATION (Requirements 9 & 10: Compact, no false precision, expandable) */}
                <PhysicalValidationCard
                  checks={selfiePrompts.validationReport.checks}
                  passedAll={selfiePrompts.validationReport.passedAll}
                  onAutoFix={handleSelfieAutoFix}
                  language={language}
                />

                {/* 7 & 8. SPATIAL METRICS (Requirements 7 & 8: Compact key info + View Details + User vs Engine) */}
                <SpatialVisualizer
                  state={selfieState}
                  armReachMeters={selfiePrompts.spatialSummary.armReachMeters}
                  language={language}
                />

                {/* 11 & 12. FINAL PROMPT OUTPUT (Requirements 11 & 12: ChatGPT/Gemini primary, More menu, Copy CTA) */}
                <div ref={promptOutputRef}>
                  <SelfieOutputView
                    compiled={selfiePrompts}
                    onSimulate={() => setIsSimulationOpen(true)}
                    language={language}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: GENERAL PHYSICS ENGINE */}
        {appMode === 'general_physics' && (
          <div className="space-y-5 sm:space-y-6">
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
      <footer className="mt-8 border-t border-zinc-800/80 bg-zinc-950 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-zinc-400 text-xs">
              {isAr ? 'استوديو سيلفي التوافق المشهدي' : 'Selfie Scene Compatibility Studio'}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">v3.8</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            {isAr
              ? 'مبني وفق ميثاق التوافق المشهدي ومنع التجميل الرقمي لنماذج ChatGPT و Gemini.'
              : 'Engineered according to scene compatibility standards for ChatGPT & Gemini.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
