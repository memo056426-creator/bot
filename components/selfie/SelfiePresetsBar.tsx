'use client';

import React, { useState } from 'react';
import { SelfieSceneState } from '@/types/selfie-engine';
import {
  Sparkles,
  Waves,
  Coffee,
  Car,
  Building,
  Compass,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface SelfieArchetype {
  id: string;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  icon: any;
  state: Partial<SelfieSceneState>;
}

export const SELFIE_ARCHETYPES: SelfieArchetype[] = [
  {
    id: 'jeddah_corniche_sunset',
    titleAr: 'كورنيش جدة (غروب ورطوبة)',
    titleEn: 'Jeddah Corniche Sunset',
    badgeAr: 'واجهة بحرية',
    badgeEn: 'Waterfront',
    icon: Waves,
    state: {
      sceneType: 'beach_corniche_selfie',
      locationCategory: 'waterfront_corniche',
      locationId: 'jeddah_corniche',
      pose: 'standing_asymmetric_weight',
      cameraPosition: 'handheld_arm_extended_front',
      cameraAngle: 'eye_level',
      framing: 'bust_torso',
      lighting: 'golden_hour',
      timeOfDay: 'golden_hour_sunset',
      weather: 'humid_coastal_haze',
      backgroundActivity: 'light',
      clothingType: 'casual everyday streetwear or light linen shirt',
      includeSaudiRealism: true,
      includeImperfectionLayer: true,
    },
  },
  {
    id: 'cafe_table_specialty',
    titleAr: 'طاولة مقهى مختص (كوب مستقر)',
    titleEn: 'Specialty Cafe Seated',
    badgeAr: 'طاولة مقهى',
    badgeEn: 'Cafe Table',
    icon: Coffee,
    state: {
      sceneType: 'restaurant_table_selfie',
      locationCategory: 'restaurants_cafes',
      locationId: 'specialty_coffee_table',
      pose: 'seated_table_casual',
      cameraPosition: 'table_arm_propped',
      cameraAngle: 'slight_high_angle',
      framing: 'bust_torso',
      lighting: 'cafe_warm_practical_amber',
      timeOfDay: 'late_afternoon',
      weather: 'clear_dry',
      backgroundActivity: 'light',
      clothingType: 'neat daily attire (thobe or smart casual)',
      includeSaudiRealism: true,
      includeImperfectionLayer: true,
    },
  },
  {
    id: 'car_driver_stationary',
    titleAr: 'مقعد السائق (سيارة متوقفة)',
    titleEn: 'Stationary Driver Seat',
    badgeAr: 'كابينة سيارة',
    badgeEn: 'Car Cabin',
    icon: Car,
    state: {
      sceneType: 'inside_car_driver_selfie',
      locationCategory: 'car_interior',
      locationId: 'car_driver_seat',
      pose: 'inside_car_driver_one_hand_wheel',
      cameraPosition: 'car_cabin_arm_reach',
      cameraAngle: 'eye_level',
      framing: 'close_face',
      lighting: 'open_shade',
      timeOfDay: 'late_afternoon',
      weather: 'clear_dry',
      backgroundActivity: 'sparse',
      clothingType: 'casual everyday white Saudi thobe',
      includeSaudiRealism: true,
      includeImperfectionLayer: true,
    },
  },
  {
    id: 'elevator_mirror_modern',
    titleAr: 'مرآة مصعد (انعكاس هاتف)',
    titleEn: 'Elevator Mirror',
    badgeAr: 'سيلفي مرآة',
    badgeEn: 'Mirror Reflection',
    icon: Building,
    state: {
      sceneType: 'mirror_selfie',
      locationCategory: 'public_buildings',
      locationId: 'building_elevator_mirror',
      pose: 'mirror_phone_held',
      cameraPosition: 'mirror_reflection_camera_visible',
      cameraAngle: 'eye_level',
      framing: 'waist_up',
      lighting: 'office_troffer_led',
      timeOfDay: 'late_afternoon',
      weather: 'clear_dry',
      backgroundActivity: 'sparse',
      clothingType: 'clean contemporary corporate casual',
      includeSaudiRealism: true,
      includeImperfectionLayer: true,
    },
  },
  {
    id: 'desert_highway_pullout',
    titleAr: 'استراحة طريق صحراوي',
    titleEn: 'Desert Highway Stop',
    badgeAr: 'طريق صحراوي',
    badgeEn: 'Desert Stop',
    icon: Compass,
    state: {
      sceneType: 'desert_stop_selfie',
      locationCategory: 'desert_roadtrips',
      locationId: 'desert_highway_stop',
      pose: 'leaning_against_contact_surface',
      cameraPosition: 'handheld_arm_extended_front',
      cameraAngle: 'slight_low_angle',
      framing: 'wide_environmental_selfie',
      lighting: 'direct_sun',
      timeOfDay: 'late_afternoon',
      weather: 'dusty_desert_atmosphere',
      backgroundActivity: 'sparse',
      clothingType: 'comfortable travel clothing with sunglasses',
      includeSaudiRealism: true,
      includeImperfectionLayer: true,
    },
  },
  {
    id: 'supermarket_casual_aisle',
    titleAr: 'ممر سوبرماركت (سلة تسوق)',
    titleEn: 'Supermarket Aisle',
    badgeAr: 'تسوق يومي',
    badgeEn: 'Daily Grocery',
    icon: ShoppingBag,
    state: {
      sceneType: 'standing_selfie',
      locationCategory: 'shopping',
      locationId: 'supermarket_aisle',
      pose: 'holding_shopping_basket',
      cameraPosition: 'handheld_arm_extended_front',
      cameraAngle: 'eye_level',
      framing: 'bust_torso',
      lighting: 'retail_fluorescent_tubes',
      timeOfDay: 'night',
      weather: 'clear_dry',
      backgroundActivity: 'light',
      clothingType: 'casual relaxed home-run clothing',
      includeSaudiRealism: true,
      includeImperfectionLayer: true,
    },
  },
];

interface SelfiePresetsBarProps {
  onSelectArchetype: (archetype: SelfieArchetype) => void;
  activeId?: string;
  language: 'ar' | 'en';
}

export function SelfiePresetsBar({
  onSelectArchetype,
  activeId,
  language,
}: SelfiePresetsBarProps) {
  const isAr = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);

  const activePreset = SELFIE_ARCHETYPES.find((a) => a.id === activeId);

  return (
    <div className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-xl overflow-hidden transition-all">
      {/* Compact Header Bar (Requirement 5) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/50 transition"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold">{isAr ? 'سيناريوهات سريعة (Quick Presets)' : 'Quick Presets'}</span>
          {activePreset && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
              {isAr ? activePreset.titleAr : activePreset.titleEn}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
          <span>{isOpen ? (isAr ? 'إخفاء' : 'Collapse') : (isAr ? 'عرض النماذج' : 'Expand')}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/30 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 animate-in fade-in">
          {SELFIE_ARCHETYPES.map((arch) => {
            const Icon = arch.icon;
            const isActive = activeId === arch.id;

            return (
              <button
                key={arch.id}
                onClick={() => {
                  onSelectArchetype(arch);
                  setIsOpen(false);
                }}
                className={`text-start p-2 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                  isActive
                    ? 'bg-zinc-900 border-emerald-500/70 text-emerald-300 shadow-sm'
                    : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-bold line-clamp-1">{isAr ? arch.titleAr : arch.titleEn}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {isAr ? arch.badgeAr : arch.badgeEn}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
