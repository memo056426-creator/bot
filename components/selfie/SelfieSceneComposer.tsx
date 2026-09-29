'use client';

import React, { useState, useMemo } from 'react';
import {
  SelfieSceneState,
  SceneType,
  LocationCategory,
  PoseType,
  CameraAngle,
  FramingType,
  LightingSource,
  TimeOfDay,
  WeatherCondition,
  BackgroundActivityLevel,
} from '@/types/selfie-engine';
import {
  SCENE_TYPE_DEFINITIONS,
  LOCATION_CATEGORIES,
  LOCATIONS_DATABASE,
  POSE_DEFINITIONS,
} from '@/lib/selfie-database';
import {
  MapPin,
  User,
  Sun,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react';

interface SelfieSceneComposerProps {
  state: SelfieSceneState;
  onChange: (newState: SelfieSceneState) => void;
  onGeneratePrompt?: () => void;
  language: 'ar' | 'en';
}

export function SelfieSceneComposer({
  state,
  onChange,
  onGeneratePrompt,
  language,
}: SelfieSceneComposerProps) {
  const isAr = language === 'ar';
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // 1. Get Scene Definition & Filtered Categories
  const sceneDef = SCENE_TYPE_DEFINITIONS[state.sceneType];
  const allowedCategories = useMemo(() => {
    return LOCATION_CATEGORIES.filter((cat) =>
      sceneDef.allowedCategories.includes(cat.id)
    );
  }, [sceneDef]);

  // 2. Filter Locations by Category and Scene Type
  const filteredLocations = useMemo(() => {
    return LOCATIONS_DATABASE.filter(
      (loc) => loc.category === state.locationCategory
    );
  }, [state.locationCategory]);

  const selectedLocation = useMemo(() => {
    return (
      LOCATIONS_DATABASE.find((l) => l.id === state.locationId) ||
      filteredLocations[0] ||
      LOCATIONS_DATABASE[0]
    );
  }, [state.locationId, filteredLocations]);

  // 3. Filter Allowed Poses by Location
  const allowedPoses = useMemo(() => {
    return selectedLocation.allowedPoses.map((pKey) => ({
      key: pKey,
      ...POSE_DEFINITIONS[pKey],
    }));
  }, [selectedLocation]);

  // 4. Filter Allowed Lighting by Location and Time
  const isNight = state.timeOfDay === 'night' || state.timeOfDay === 'blue_hour';
  const availableLightingOptions: { id: LightingSource; nameAr: string; nameEn: string }[] = useMemo(() => {
    const list: { id: LightingSource; nameAr: string; nameEn: string }[] = [];

    if (!isNight) {
      list.push(
        { id: 'direct_sun', nameAr: 'ضوء شمس نهار مباشر مع ظلال واضحة', nameEn: 'Direct Sunlight' },
        { id: 'harsh_noon', nameAr: 'شمس الظهيرة الحادة (ظلال عمودية قصيرة)', nameEn: 'Harsh Midday Sun' },
        { id: 'open_shade', nameAr: 'ظل معماري مفتوح ناعم (Open Shade)', nameEn: 'Open Shade' },
        { id: 'golden_hour', nameAr: 'الساعة الذهبية قبل الغروب (3200K)', nameEn: 'Golden Hour' },
        { id: 'overcast_diffused', nameAr: 'سماء غائمة وإضاءة مشتتة ناعمة', nameEn: 'Overcast Diffused' }
      );
    }

    if (selectedLocation.category === 'gas_stations') {
      list.push({ id: 'gas_station_canopy_fixtures', nameAr: 'كشافات مظلة محطة الوقود البيضاء', nameEn: 'Gas Station Canopy LEDs' });
    }
    if (selectedLocation.category === 'restaurants_cafes') {
      list.push({ id: 'cafe_warm_practical_amber', nameAr: 'إضاءة مقهى دافئة معلقة (2700K)', nameEn: 'Warm Cafe Pendants' });
    }
    if (selectedLocation.category === 'office_work' || selectedLocation.category === 'public_buildings') {
      list.push({ id: 'office_troffer_led', nameAr: 'إنارة مكاتب سقفية بيضاء (Troffer LED)', nameEn: 'Office Troffer LEDs' });
    }
    if (selectedLocation.category === 'car_interior') {
      list.push({ id: 'car_interior_dome_light_dim', nameAr: 'إضاءة سقف الكابينة الخافتة مع تسرب خارجي', nameEn: 'Dim Interior Dome Light' });
    }

    list.push(
      { id: 'street_led_poles', nameAr: 'أعمدة إنارة الشوارع LED البلدية', nameEn: 'Municipal Streetlamp Poles' },
      { id: 'parking_led_canopy', nameAr: 'كشافات مواقف السيارات التجارية', nameEn: 'Parking Lot Floodlights' },
      { id: 'storefront_light_spill', nameAr: 'تسرب ضوء واجهات المتاجر واللوحات', nameEn: 'Storefront Light Spill' },
      { id: 'mixed_practical_ambient', nameAr: 'إضاءة بيئية عملية مدمجة', nameEn: 'Mixed Practical Ambient' }
    );

    return list;
  }, [isNight, selectedLocation]);

  // Handlers for Cascade Updates
  const handleSceneTypeChange = (newType: SceneType) => {
    const newDef = SCENE_TYPE_DEFINITIONS[newType];
    const newCat = newDef.allowedCategories[0] || 'city_streets';
    const locsInCat = LOCATIONS_DATABASE.filter((l) => l.category === newCat);
    const newLoc = locsInCat[0] || LOCATIONS_DATABASE[0];
    const newPose = newLoc.allowedPoses[0] || 'standing_asymmetric_weight';

    onChange({
      ...state,
      sceneType: newType,
      locationCategory: newCat,
      locationId: newLoc.id,
      pose: newPose,
    });
  };

  const handleCategoryChange = (newCat: LocationCategory) => {
    const locsInCat = LOCATIONS_DATABASE.filter((l) => l.category === newCat);
    const newLoc = locsInCat[0] || LOCATIONS_DATABASE[0];
    const newPose = newLoc.allowedPoses[0] || 'standing_asymmetric_weight';

    onChange({
      ...state,
      locationCategory: newCat,
      locationId: newLoc.id,
      pose: newPose,
    });
  };

  const handleLocationChange = (newLocId: string) => {
    const loc = LOCATIONS_DATABASE.find((l) => l.id === newLocId) || LOCATIONS_DATABASE[0];
    const newPose = loc.allowedPoses.includes(state.pose)
      ? state.pose
      : loc.allowedPoses[0] || 'standing_asymmetric_weight';

    onChange({
      ...state,
      locationId: newLocId,
      pose: newPose,
    });
  };

  const stepsList = [
    { num: 1, titleAr: 'Location', titleEn: 'Location', icon: MapPin },
    { num: 2, titleAr: 'Pose & Camera', titleEn: 'Pose & Camera', icon: User },
    { num: 3, titleAr: 'Lighting & Weather', titleEn: 'Lighting & Weather', icon: Sun },
    { num: 4, titleAr: 'Realism', titleEn: 'Realism', icon: Sparkles },
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
      {/* 3. STICKY STEP PROGRESS INDICATOR AT TOP (Requirement 3) */}
      <div className="sticky top-14 z-20 bg-zinc-950/95 backdrop-blur-md px-4 py-3 border-b border-zinc-800/90 shadow-sm">
        <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          {stepsList.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = activeStep > step.num;
            const isActive = activeStep === step.num;
            const isUpcoming = activeStep < step.num;

            return (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => {
                    // Allow jumping to any completed step or active step
                    if (isCompleted || isActive) {
                      setActiveStep(step.num as any);
                    }
                  }}
                  disabled={isUpcoming}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                      : isCompleted
                      ? 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800 cursor-pointer'
                      : 'text-zinc-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className="whitespace-nowrap">{isAr ? step.titleAr : step.titleEn}</span>
                </button>

                {idx < stepsList.length - 1 && (
                  <div
                    className={`h-[1px] w-3 sm:w-6 shrink-0 ${
                      activeStep > step.num ? 'bg-emerald-500/80' : 'bg-zinc-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN WORKFLOW: ONLY CURRENT STAGE CONTROLS DISPLAYED (Requirement 2) */}
      <div className="p-4 sm:p-6 space-y-4 flex-1">
        {/* STAGE 1: LOCATION */}
        {activeStep === 1 && (
          <div className="space-y-3.5 animate-in fade-in">
            {/* Scene Type */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'نوع المشهد (Scene Type):' : 'Scene Type:'}
              </label>
              <select
                value={state.sceneType}
                onChange={(e) => handleSceneTypeChange(e.target.value as SceneType)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-medium focus:border-emerald-500 focus:outline-none"
              >
                {Object.entries(SCENE_TYPE_DEFINITIONS).map(([key, def]) => (
                  <option key={key} value={key}>
                    {isAr ? def.nameAr : def.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  {isAr ? 'تصنيف البيئة (Location Category):' : 'Location Category:'}
                </label>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {allowedCategories.length} {isAr ? 'متوافقة' : 'compatible'}
                </span>
              </div>
              <select
                value={state.locationCategory}
                onChange={(e) => handleCategoryChange(e.target.value as LocationCategory)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-medium focus:border-cyan-500 focus:outline-none"
              >
                {allowedCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isAr ? cat.nameAr : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Specific Location */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'الموقع المحدد (Specific Location):' : 'Specific Location:'}
              </label>
              <select
                value={selectedLocation.id}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-medium focus:border-blue-500 focus:outline-none"
              >
                {filteredLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {isAr ? loc.nameAr : loc.nameEn}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-400 mt-2 p-2 rounded bg-zinc-950 border border-zinc-800 leading-relaxed">
                {isAr ? selectedLocation.descriptionAr : selectedLocation.descriptionEn}
              </p>
            </div>
          </div>
        )}

        {/* STAGE 2: POSE & CAMERA */}
        {activeStep === 2 && (
          <div className="space-y-3.5 animate-in fade-in">
            {/* Pose */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'الوضعية الحركية (Pose):' : 'Pose & Biomechanics:'}
              </label>
              <select
                value={state.pose}
                onChange={(e) => onChange({ ...state, pose: e.target.value as PoseType })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-medium focus:border-purple-500 focus:outline-none"
              >
                {allowedPoses.map((p) => (
                  <option key={p.key} value={p.key}>
                    {isAr ? p.nameAr : p.nameEn}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-purple-300/90 mt-2 p-2 rounded bg-zinc-950 border border-zinc-800 leading-relaxed">
                {isAr
                  ? POSE_DEFINITIONS[state.pose]?.biomechanicsDescAr
                  : POSE_DEFINITIONS[state.pose]?.biomechanicsDescEn}
              </p>
            </div>

            {/* Camera Angle */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'زاوية الكاميرا (Camera Angle):' : 'Camera Angle:'}
              </label>
              <select
                value={state.cameraAngle}
                onChange={(e) => onChange({ ...state, cameraAngle: e.target.value as CameraAngle })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-medium focus:border-amber-500 focus:outline-none"
              >
                <option value="eye_level">{isAr ? 'مستوى العين (طبيعي وعفوي)' : 'Eye Level'}</option>
                <option value="slight_high_angle">{isAr ? 'مرتفعة قليلاً (سيلفي كلاسيكي)' : 'Slight High Angle'}</option>
                <option value="high_angle">{isAr ? 'مرتفعة واضحة (High Angle)' : 'High Angle'}</option>
                <option value="slight_low_angle">{isAr ? 'منخفضة قليلاً' : 'Slight Low Angle'}</option>
                <option value="low_angle">{isAr ? 'منخفضة (Low Angle)' : 'Low Angle'}</option>
                <option value="three_quarter">{isAr ? 'ثلاثة أرباع (3/4 Angle)' : 'Three-Quarter'}</option>
                <option value="off_center">{isAr ? 'إزاحة غير متناظرة (Off-Center)' : 'Off-Center'}</option>
              </select>
            </div>

            {/* Framing */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  {isAr ? 'التأطير البصري (Framing):' : 'Framing:'}
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {isAr ? 'ضمن مدى الذراع البشري' : 'Human Arm Limit Enforced'}
                </span>
              </div>
              <select
                value={state.framing}
                onChange={(e) => onChange({ ...state, framing: e.target.value as FramingType })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-medium focus:border-rose-500 focus:outline-none"
              >
                <option value="close_face">{isAr ? 'مقرب للوجه (Close Face - ~0.45m)' : 'Close Face (~0.45m)'}</option>
                <option value="head_and_shoulders">{isAr ? 'رأس وكتفان (Head & Shoulders - ~0.55m)' : 'Head & Shoulders (~0.55m)'}</option>
                <option value="bust_torso">{isAr ? 'الصدر والجذع (Bust - ~0.65m)' : 'Bust / Torso (~0.65m)'}</option>
                <option value="waist_up">{isAr ? 'من الخصر للأعلى (Waist Up - ~0.75m)' : 'Waist Up (~0.75m)'}</option>
                <option value="wide_environmental_selfie">{isAr ? 'سيلفي بيئي واسع (عدسة 24mm ~0.82m)' : 'Wide Environmental (24mm optic ~0.82m)'}</option>
              </select>
            </div>
          </div>
        )}

        {/* STAGE 3: LIGHTING & WEATHER */}
        {activeStep === 3 && (
          <div className="space-y-3.5 animate-in fade-in">
            {/* Time of Day */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'الوقت الزمني (Time of Day):' : 'Time of Day:'}
              </label>
              <select
                value={state.timeOfDay}
                onChange={(e) => onChange({ ...state, timeOfDay: e.target.value as TimeOfDay })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-medium focus:border-amber-500 focus:outline-none"
              >
                <option value="early_morning">{isAr ? 'الصباح الباكر' : 'Early Morning'}</option>
                <option value="harsh_noon">{isAr ? 'الظهيرة الساطعة (شمس عمودية)' : 'Harsh Midday Sun'}</option>
                <option value="late_afternoon">{isAr ? 'العصر المعتدل' : 'Late Afternoon'}</option>
                <option value="golden_hour_sunset">{isAr ? 'الساعة الذهبية / الغروب' : 'Golden Hour / Sunset'}</option>
                <option value="blue_hour">{isAr ? 'الشفق الأزرق بعد الغروب' : 'Blue Hour'}</option>
                <option value="night">{isAr ? 'الليل (إضاءات الشارع والمحلات)' : 'Night'}</option>
              </select>
            </div>

            {/* Lighting Source */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'مصدر الإضاءة الفعلي المبرر (Diegetic Source):' : 'Diegetic Lighting Source:'}
              </label>
              <select
                value={state.lighting}
                onChange={(e) => onChange({ ...state, lighting: e.target.value as LightingSource })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-medium focus:border-yellow-500 focus:outline-none"
              >
                {availableLightingOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {isAr ? opt.nameAr : opt.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Weather */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'الحالة الجوية وحالة السطح (Weather):' : 'Weather & Surface Condition:'}
              </label>
              <select
                value={state.weather}
                onChange={(e) => onChange({ ...state, weather: e.target.value as WeatherCondition })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-medium focus:border-sky-500 focus:outline-none"
              >
                <option value="clear_dry">{isAr ? 'صافٍ وجاف طبيعي' : 'Clear & Dry'}</option>
                <option value="cloudy_overcast">{isAr ? 'غائم جزئياً' : 'Partly Cloudy'}</option>
                <option value="humid_coastal_haze">{isAr ? 'رطوبة وضباب ساحلي خفيف' : 'Humid Coastal Haze'}</option>
                <option value="windy">{isAr ? 'رياح تحرك الشعر وأطراف الثوب' : 'Windy'}</option>
                <option value="light_rain">{isAr ? 'مطر خفيف ورذاذ' : 'Light Rain'}</option>
                <option value="post_rain_wet_surface">{isAr ? 'أرضية مبللة ببرك غير متساوية' : 'Post-Rain Wet Ground'}</option>
                <option value="dusty_desert_atmosphere">{isAr ? 'أجواء صحراوية مغبرة خفيفة' : 'Dusty Desert Air'}</option>
              </select>
            </div>
          </div>
        )}

        {/* STAGE 4: REALISM */}
        {activeStep === 4 && (
          <div className="space-y-3.5 animate-in fade-in">
            {/* Background Activity */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'كثافة النشاط البشري في الخلفية:' : 'Background Activity Density:'}
              </label>
              <select
                value={state.backgroundActivity}
                onChange={(e) =>
                  onChange({ ...state, backgroundActivity: e.target.value as BackgroundActivityLevel })
                }
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="sparse">{isAr ? 'نادر / خافت (Sparse)' : 'Sparse'}</option>
                <option value="light">{isAr ? 'خفيف وعفوي (Light)' : 'Light'}</option>
                <option value="moderate">{isAr ? 'متوسط (Moderate)' : 'Moderate'}</option>
              </select>
            </div>

            {/* Clothing */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                {isAr ? 'نوع الملابس:' : 'Clothing Attire:'}
              </label>
              <input
                type="text"
                value={state.clothingType}
                onChange={(e) => onChange({ ...state, clothingType: e.target.value })}
                placeholder={isAr ? 'مثال: ثوب سعودي أبيض أنيق أو تيشيرت كاجوال' : 'e.g. Crisp white Saudi thobe or casual streetwear'}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Realism Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition">
                <input
                  type="checkbox"
                  checked={state.includeSaudiRealism}
                  onChange={(e) => onChange({ ...state, includeSaudiRealism: e.target.checked })}
                  className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0 mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">
                    {isAr ? 'الهوية البيئية السعودية' : 'Authentic Saudi Cues'}
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    {isAr ? 'أرصفة بالأصفر والأسود، لوحات عربية، غبار طرقات' : 'Curbs, Arabic signage, road dust'}
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition">
                <input
                  type="checkbox"
                  checked={state.includeImperfectionLayer}
                  onChange={(e) => onChange({ ...state, includeImperfectionLayer: e.target.checked })}
                  className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0 mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">
                    {isAr ? 'طبقة العيوب الحقيقية' : 'Imperfections & Anti-Smoothing'}
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    {isAr ? 'مسام جلدية، زغب وجه، تشوه عدسة الهاتف' : 'Skin pores, vellus hair, lens grain'}
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 4. FIXED & CLEAR NAVIGATION BUTTONS AT BOTTOM (Requirement 4) */}
      <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={() => setActiveStep((prev) => (prev > 1 ? ((prev - 1) as any) : prev))}
          disabled={activeStep === 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{isAr ? 'السابق (Back)' : 'Back'}</span>
        </button>

        {/* Continue / Generate Button */}
        <div>
          {activeStep < 4 ? (
            <button
              onClick={() => setActiveStep((prev) => (prev < 4 ? ((prev + 1) as any) : prev))}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition shadow-md"
            >
              <span>{isAr ? 'المتابعة (Continue)' : 'Continue'}</span>
              {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <button
              onClick={() => {
                if (onGeneratePrompt) {
                  onGeneratePrompt();
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 transition shadow-md active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-zinc-950" />
              <span>{isAr ? 'توليد البرومبت النهائي (Generate Prompt)' : 'Generate Prompt'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
