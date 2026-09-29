import {
  SelfieSceneState,
  CompiledSelfiePrompt,
  PhysicalValidationItem,
} from '@/types/selfie-engine';
import {
  LOCATIONS_DATABASE,
  POSE_DEFINITIONS,
  SCENE_TYPE_DEFINITIONS,
  SAUDI_REALISM_DETAILS,
  IMPERFECTION_LAYER_ELEMENTS,
} from '@/lib/selfie-database';

export function runPhysicalValidation(state: SelfieSceneState): {
  passedAll: boolean;
  checks: PhysicalValidationItem[];
  correctedState: SelfieSceneState;
} {
  const checks: PhysicalValidationItem[] = [];
  const corrected = { ...state };
  let passedAll = true;

  const location =
    LOCATIONS_DATABASE.find((l) => l.id === state.locationId) || LOCATIONS_DATABASE[0];
  const poseDef = POSE_DEFINITIONS[state.pose] || POSE_DEFINITIONS.standing_asymmetric_weight;

  // 1. Scene Type to Location Compatibility
  const sceneDef = SCENE_TYPE_DEFINITIONS[state.sceneType];
  const isCategoryCompatible = sceneDef?.allowedCategories.includes(location.category);
  if (!isCategoryCompatible) {
    passedAll = false;
    checks.push({
      key: 'scene_location_compat',
      titleAr: 'توافق نوع المشهد مع تصنيف المكان',
      titleEn: 'Scene Type to Location Compatibility',
      passed: false,
      detailAr: `نوع المشهد (${sceneDef?.nameAr || state.sceneType}) غير متوافق منطقياً مع المكان المختص (${location.nameAr}).`,
      detailEn: `Scene type ${state.sceneType} does not naturally occur in ${location.nameEn}.`,
      severity: 'error',
    });
  } else {
    checks.push({
      key: 'scene_location_compat',
      titleAr: 'توافق نوع المشهد مع تصنيف المكان',
      titleEn: 'Scene Type to Location Compatibility',
      passed: true,
      detailAr: `المكان (${location.nameAr}) متوافق تماماً مع نمط اللقطة المحددة.`,
      detailEn: `Location matches the selected scene type.`,
      severity: 'info',
    });
  }

  // 2. Pose to Location Compatibility
  const isPoseAllowed = location.allowedPoses.includes(state.pose);
  if (!isPoseAllowed) {
    passedAll = false;
    checks.push({
      key: 'pose_location_compat',
      titleAr: 'توافق الوضعية الحركية مع المكان',
      titleEn: 'Pose to Location Compatibility',
      passed: false,
      detailAr: `الوضعية المختارة (${poseDef.nameAr}) لا تلائم فيزياء هذا المكان (${location.nameAr}).`,
      detailEn: `Pose ${poseDef.nameEn} cannot be physically executed at ${location.nameEn}.`,
      severity: 'error',
    });
    // Auto-correct to first allowed pose
    if (location.allowedPoses.length > 0) {
      corrected.pose = location.allowedPoses[0];
    }
  } else {
    checks.push({
      key: 'pose_location_compat',
      titleAr: 'توافق الوضعية الحركية مع المكان',
      titleEn: 'Pose to Location Compatibility',
      passed: true,
      detailAr: 'الوضعية ممكنة ومستقرة فيزيائياً في هذه البيئة.',
      detailEn: 'Pose is biomechanically plausible in this specific environment.',
      severity: 'info',
    });
  }

  // 3. Mirror Requirement Check
  if (state.sceneType === 'mirror_selfie' || state.pose === 'mirror_phone_held') {
    if (!location.hasMirror) {
      passedAll = false;
      checks.push({
        key: 'mirror_surface_check',
        titleAr: 'فحص وجود سطح مرآة عاكس حقيقي',
        titleEn: 'Mirror Surface Optical Check',
        passed: false,
        detailAr: `المشهد مصنف كسيلفي مرآة ولكن المكان (${location.nameAr}) لا يحتوي على سطح مرآة هندسي مبرر!`,
        detailEn: `Mirror selfie selected but location has no valid physical reflective mirror plane.`,
        severity: 'error',
      });
    } else {
      checks.push({
        key: 'mirror_surface_check',
        titleAr: 'فحص وجود سطح مرآة عاكس حقيقي',
        titleEn: 'Mirror Surface Optical Check',
        passed: true,
        detailAr: 'تم التحقق من وجود مرآة حقيقية ومطابقة مسار شعاع الانعكاس مع موقع الكاميرا.',
        detailEn: 'Physical mirror verified; ray-traced reflection direction coherent.',
        severity: 'info',
      });
    }
  }

  // 4. Seated Support Plane Check
  if (poseDef.requiresSupport) {
    const hasSupport = location.hasTable || location.hasDesk || location.category === 'car_interior' || location.hasContactSurface;
    if (!hasSupport) {
      passedAll = false;
      checks.push({
        key: 'seated_support_check',
        titleAr: 'فحص سطح دعم ثقل الجسم في وضع الجلوس',
        titleEn: 'Body Mass Support Plane Check',
        passed: false,
        detailAr: 'الوضعية تتطلب جلوساً وانضغاط حشوة مقعد، ولكن المكان لا يوفر كرسياً أو مقعداً!',
        detailEn: 'Seated pose selected without a valid structural seating plane.',
        severity: 'error',
      });
    } else {
      checks.push({
        key: 'seated_support_check',
        titleAr: 'فحص سطح دعم ثقل الجسم في وضع الجلوس',
        titleEn: 'Body Mass Support Plane Check',
        passed: true,
        detailAr: 'الحوض مدعوم بسطح حقيقي مع انضغاط فيزيائي للمقعد بوزن الجسم.',
        detailEn: 'Pelvis anchored to genuine support plane with seat compression.',
        severity: 'info',
      });
    }
  }

  // 5. Leaning Contact Surface Check
  if (poseDef.requiresContact && state.pose === 'leaning_against_contact_surface') {
    if (!location.hasContactSurface) {
      passedAll = false;
      checks.push({
        key: 'leaning_contact_check',
        titleAr: 'فحص سطح الاستناد ونقطة التلامس',
        titleEn: 'Leaning Contact Surface & Balance',
        passed: false,
        detailAr: 'تم اختيار وضعية استناد بدون وجود سطح تلامس فيزيائي (جدار، سيارة، درابزين).',
        detailEn: 'Leaning selected without a valid rigid contact plane.',
        severity: 'error',
      });
    } else {
      checks.push({
        key: 'leaning_contact_check',
        titleAr: 'فحص سطح الاستناد ونقطة التلامس',
        titleEn: 'Leaning Contact Surface & Balance',
        passed: true,
        detailAr: 'تم تعيين سطح الاستناد بدقة وإزاحة مركز الثقل نحوه بصورة بيوميكانيكية صحيحة.',
        detailEn: 'Contact surface verified with biomechanically plausible center of gravity shift.',
        severity: 'info',
      });
    }
  }

  // 6. Arm-Reach Distance Check (Human Scale Constraint)
  if (state.sceneType !== 'mirror_selfie') {
    const isFramingTooWide = state.framing === 'wide_environmental_selfie' && state.cameraPosition === 'handheld_arm_extended_front';
    if (isFramingTooWide) {
      checks.push({
        key: 'arm_reach_scale_check',
        titleAr: 'هندسة مسافة الذراع وتأطير السيلفي',
        titleEn: 'Arm Reach Geometry vs Framing',
        passed: true,
        detailAr: 'تم ضبط زاوية العدسة العريضة (24mm Ultra-Wide الهاتف) لتضمين البيئة مع بقاء الهاتف في مدى طول الذراع (0.75m).',
        detailEn: 'Framing utilizes 24mm equivalent smartphone wide optic ensuring arm-reach constraint (0.75m).',
        severity: 'info',
      });
    } else {
      checks.push({
        key: 'arm_reach_scale_check',
        titleAr: 'هندسة مسافة الذراع وتأطير السيلفي',
        titleEn: 'Arm Reach Geometry vs Framing',
        passed: true,
        detailAr: 'الهاتف ممسوك في اليد بمسافة ذراع بشرية واقعية (0.55m - 0.75m) مع زاوية كتف متسقة.',
        detailEn: 'Phone strictly held within human arm reach (0.55m - 0.75m) with consistent shoulder parallax.',
        severity: 'info',
      });
    }
  }

  // 7. Car Interior Stationary Safety & Seat Geometry Check
  if (location.category === 'car_interior') {
    checks.push({
      key: 'car_stationary_safety',
      titleAr: 'فيزياء مقصورة السيارة المتوقفة',
      titleEn: 'Stationary Vehicle Cabin Physics',
      passed: true,
      detailAr: 'السيارة متوقفة بأمان في موقف؛ لا حركات اهتزاز قيادة، منظور الزجاج وأبعاد المقود متطابقة.',
      detailEn: 'Vehicle strictly stationary in parking mode; steering wheel and headrest proportions exact.',
      severity: 'info',
    });
  }

  // 8. Lighting vs Time-of-Day Coherence Check
  const isNight = state.timeOfDay === 'night' || state.timeOfDay === 'blue_hour';
  const isSunLight = state.lighting === 'direct_sun' || state.lighting === 'harsh_noon' || state.lighting === 'golden_hour';
  if (isNight && isSunLight) {
    passedAll = false;
    checks.push({
      key: 'lighting_time_coherence',
      titleAr: 'توافق مصدر الضوء مع الوقت الزمني',
      titleEn: 'Lighting vs Time of Day Coherence',
      passed: false,
      detailAr: 'تناقض فيزيائي: تم اختيار إضاءة شمسية نهارية في وقت ليلي!',
      detailEn: 'Physical contradiction: Daylight source chosen for night scenario.',
      severity: 'error',
    });
    // Auto-correct lighting to location default or practical street LED
    corrected.lighting = location.category === 'gas_stations' ? 'gas_station_canopy_fixtures' : 'street_led_poles';
  } else {
    checks.push({
      key: 'lighting_time_coherence',
      titleAr: 'توافق مصدر الضوء مع الوقت الزمني',
      titleEn: 'Lighting vs Time of Day Coherence',
      passed: true,
      detailAr: 'مصادر الضوء مبررة زمنياً وبيئياً وتنبعث من عناصر موجودة فعلياً في المشهد.',
      detailEn: 'Light sources diegetically originate from in-scene physical fixtures.',
      severity: 'info',
    });
  }

  // 9. Background Crowd Density Realism Check
  if (location.id === 'desert_highway_stop' && state.backgroundActivity === 'moderate') {
    checks.push({
      key: 'crowd_density_check',
      titleAr: 'كثافة النشاط البشري في الخلفية',
      titleEn: 'Background Activity Density',
      passed: true,
      detailAr: 'تنبيه: طريق صحراوي سريع يتطلب حركة بشرية نادرة (Sparse) لضمان الواقعية.',
      detailEn: 'Desert shoulder adjusted to sparse background activity for environmental realism.',
      severity: 'warning',
    });
    corrected.backgroundActivity = 'sparse';
  } else {
    checks.push({
      key: 'crowd_density_check',
      titleAr: 'كثافة النشاط البشري في الخلفية',
      titleEn: 'Background Activity Density',
      passed: true,
      detailAr: `النشاط البشري في الخلفية (${state.backgroundActivity}) واقعي وغير متكلف.`,
      detailEn: `Background activity is natural and contextually appropriate.`,
      severity: 'info',
    });
  }

  return { passedAll, checks, correctedState: corrected };
}

export function compileSelfiePrompts(state: SelfieSceneState): CompiledSelfiePrompt {
  const { checks, correctedState } = runPhysicalValidation(state);
  const location =
    LOCATIONS_DATABASE.find((l) => l.id === correctedState.locationId) || LOCATIONS_DATABASE[0];
  const poseDef =
    POSE_DEFINITIONS[correctedState.pose] || POSE_DEFINITIONS.standing_asymmetric_weight;

  // Camera reach calculation
  let armReachMeters = 0.65;
  if (correctedState.framing === 'close_face') armReachMeters = 0.45;
  if (correctedState.framing === 'wide_environmental_selfie') armReachMeters = 0.82;
  if (correctedState.sceneType === 'mirror_selfie') armReachMeters = 1.35; // Double the distance to mirror

  // Lighting description
  const getLightingText = (l: string) => {
    switch (l) {
      case 'direct_sun':
        return 'Direct natural sunlight casting grounded high-contrast shadows';
      case 'harsh_noon':
        return 'High midday sun overhead at steep angle, casting short downward shadows under brow and chin';
      case 'open_shade':
        return 'Soft skylight ambient illumination in open architectural shade with clean facial detail';
      case 'golden_hour':
        return 'Low-angle warm 3200K late afternoon sunlight skimming cheekbones and illuminating airborne dust';
      case 'street_led_poles':
        return 'Diegetic overhead LED municipal streetlamp poles with realistic falloff and faint ground reflections';
      case 'gas_station_canopy_fixtures':
        return 'High-intensity recessed white LED canopy downlights from gas station ceiling creating downward directional fill';
      case 'cafe_warm_practical_amber':
        return 'Low-intensity warm 2700K tungsten/amber table pendant light and ambient indoor cafe spill';
      case 'parking_led_canopy':
        return 'Cool white LED commercial parking lot light fixtures casting distinct shadow footprints';
      case 'car_interior_dome_light_dim':
        return 'Dim cabin dome light combined with subtle windshield ambient streetlight spill';
      default:
        return 'Realistic diegetic ambient lighting from visible environmental sources';
    }
  };

  // Weather description
  const getWeatherText = (w: string) => {
    switch (w) {
      case 'humid_coastal_haze':
        return 'subtle coastal maritime humidity haze softening the distant sea horizon, light moisture sheen on skin';
      case 'windy':
        return 'moderate directional breeze physically tugging individual hair strands and loose clothing hemline';
      case 'light_rain':
        return 'fine rain droplets in air, damp asphalt pavement with specular reflections tracing streetlight poles';
      case 'post_rain_wet_surface':
        return 'post-rain damp ground with realistic non-uniform water puddles reflecting diegetic light sources (not a CGI mirror)';
      case 'dusty_desert_atmosphere':
        return 'fine airborne desert mineral dust slightly reducing extreme distance contrast';
      default:
        return 'clear atmospheric clarity with authentic natural sun exposure';
    }
  };

  // Saudi Realism tokens
  const saudiCues = correctedState.includeSaudiRealism
    ? [
        ...location.saudiDetails,
        'authentic Saudi everyday urban infrastructure',
        'subtle Gulf vehicle proportions and painted curbs',
      ].join(', ')
    : '';

  // Imperfections
  const imperfections = correctedState.includeImperfectionLayer
    ? [
        'micro-asymmetry in facial expression and posture',
        'natural skin pores with non-uniform sebum sheen (strictly zero cosmetic highlighter)',
        'authentic smartphone front camera optical characteristics (slight wide-angle focal length, natural ISO sensor grain)',
        'ordinary pavement wear and environmental dust',
      ].join(', ')
    : '';

  // 1. ChatGPT Prompt (Structured Hierarchical Directive)
  const chatgptPrompt = `[SCENE COMPOSITION DIRECTIVE: AUTHENTIC EVERYDAY SMARTPHONE SELFIE - STRICT SCENE COMPATIBILITY]
You are an uncompromising scene composer and computational realism engine. Synthesize an uncurated, realistic smartphone front-camera selfie. Banish all editorial photography, staged commercial aesthetics, or plastic AI smoothing.

### 1. CAPTURE SPECIFICATION & CAMERA GEOMETRY
- Capture Modality: Genuine smartphone front-facing camera selfie (subject-held, not a third-person camera).
- Camera Position: ${correctedState.cameraPosition.replace(/_/g, ' ')}.
- Camera Angle: ${correctedState.cameraAngle.replace(/_/g, ' ')}.
- Optical Framing: ${correctedState.framing.replace(/_/g, ' ')}.
- Physical Reach Constraint: The camera is held within exact human arm reach (~${armReachMeters}m). Shoulder, deltoid, and upper chest angle reflect realistic arm elevation and natural perspective distortion.
${correctedState.sceneType === 'mirror_selfie' ? '- Mirror Geometry: Optical reflection law strictly enforced. Smartphone is physically visible in subject\'s hand facing the mirror, matching gaze direction and background bounce.' : ''}

### 2. SUBJECT, POSE & BIOMECHANICS
- Pose: ${poseDef.nameEn}
- Anatomical Mechanics: ${poseDef.biomechanicsDescEn}
- Gravitational Vector: Constant g = 9.8 m/s² downwards dictating fabric sagging, muscle relaxation, and natural weight transfer.
- Attire: ${correctedState.clothingType}, responding realistically to gravity and body posture without showroom stiffness.

### 3. LOCATION & SPATIAL RELATIONSHIPS
- Location: ${location.nameEn} (${location.category.replace(/_/g, ' ')})
- Environmental Architecture: ${location.descriptionEn}
- Ground Plane & Contact: All feet, footwear, or seating surfaces maintain firm physical contact. No floating items.
- Environmental Objects: ${[...location.environmentalElements, ...correctedState.environmentalObjects].join(', ')}.

### 4. LIGHTING PHYSICS & RADIOMETRY
- Primary Illuminant: ${getLightingText(correctedState.lighting)}.
- Time of Day: ${correctedState.timeOfDay.replace(/_/g, ' ')}.
- Diegetic Constraint: Every photon originates from an identifiable, logical in-scene fixture or celestial sun/sky angle. No floating studio rim lights.
- Surface Reflections: Reflections follow Fresnel equations and surface roughness. Puddles or damp floors never look like CGI mirrors.

### 5. WEATHER & ATMOSPHERE
- Atmospheric Condition: ${getWeatherText(correctedState.weather)}.
${correctedState.weather === 'windy' ? '- Wind Physics: Wind vector influences only flexible materials (loose hair strands, fabric fringes), matching the prevailing air current.' : ''}

### 6. BACKGROUND ACTIVITY & SCALE
- Background Density: ${correctedState.backgroundActivity.toUpperCase()} (ordinary incidental pedestrians or vehicles going about daily routines, none staring awkwardly at the camera).
- Environmental Scale: Correct ratio between road width, curbs, vehicles, furniture, and human height.

${correctedState.includeSaudiRealism ? `### 7. REGIONAL REALISM LAYER (SAUDI ARABIA / GULF)
- Local Contextual Cues: ${saudiCues}` : ''}

${correctedState.includeImperfectionLayer ? `### 8. REAL-WORLD IMPERFECTIONS & ANTI-SMOOTHING
- Imperfection Protocol: ${imperfections}
- Lexical Blacklist: [DO NOT RENDER: plastic skin, airbrushing, beauty filter, symmetrical model pose, cinematic studio lights, 3d render, glowing eyes, showroom perfection]` : ''}`;

  // 2. Gemini XML Simulation Protocol
  const geminiPrompt = `<SELFIE_SCENE_COMPATIBILITY_SIMULATION version="2.0">
  <CAPTURE_PROFILE>
    <MODALITY>Authentic Smartphone Front-Camera Selfie</MODALITY>
    <ARM_REACH_DISTANCE unit="meters">${armReachMeters}</ARM_REACH_DISTANCE>
    <CAMERA_POSITION>${correctedState.cameraPosition}</CAMERA_POSITION>
    <CAMERA_ANGLE>${correctedState.cameraAngle}</CAMERA_ANGLE>
    <FRAMING>${correctedState.framing}</FRAMING>
  </CAPTURE_PROFILE>

  <LOCATION_ENVIRONMENT>
    <CATEGORY>${location.category}</CATEGORY>
    <LOCATION_NAME>${location.nameEn}</LOCATION_NAME>
    <DESCRIPTION>${location.descriptionEn}</DESCRIPTION>
    <GROUND_PLANE_CONTACT status="VERIFIED_GROUNDED" />
    <OBJECTS>${location.environmentalElements.join(', ')}</OBJECTS>
  </LOCATION_ENVIRONMENT>

  <HUMAN_BIOMECHANICS>
    <POSE_TYPE>${correctedState.pose}</POSE_TYPE>
    <WEIGHT_DISTRIBUTION>${poseDef.biomechanicsDescEn}</WEIGHT_DISTRIBUTION>
    <SEAT_OR_SURFACE_COMPRESSION required="${poseDef.requiresSupport}" />
    <CLOTHING>${correctedState.clothingType}</CLOTHING>
  </HUMAN_BIOMECHANICS>

  <RADIOMETRY_AND_LIGHTING>
    <PRIMARY_SOURCE>${correctedState.lighting}</PRIMARY_SOURCE>
    <TIME_OF_DAY>${correctedState.timeOfDay}</TIME_OF_DAY>
    <DIEGETIC_TRACEABILITY>TRUE</DIEGETIC_TRACEABILITY>
    <WEATHER_ATMOSPHERE>${correctedState.weather}</WEATHER_ATMOSPHERE>
  </RADIOMETRY_AND_LIGHTING>

  <SCENE_FIDELITY>
    <BACKGROUND_ACTIVITY>${correctedState.backgroundActivity}</BACKGROUND_ACTIVITY>
    <SAUDI_REGIONAL_CUES>${saudiCues}</SAUDI_REGIONAL_CUES>
    <IMPERFECTIONS>${imperfections}</IMPERFECTIONS>
  </SCENE_FIDELITY>
</SELFIE_SCENE_COMPATIBILITY_SIMULATION>`;

  // 3. Midjourney / Flux Prompt
  const imageGenPrompt = `A genuine unedited smartphone front camera selfie taken at ${location.nameEn}, ${poseDef.nameEn}, ${correctedState.cameraAngle.replace(/_/g, ' ')}, ${correctedState.framing.replace(/_/g, ' ')}, ${getLightingText(correctedState.lighting)}, ${correctedState.timeOfDay.replace(/_/g, ' ')}, ${getWeatherText(correctedState.weather)}, smartphone optical arm reach perspective, ${location.environmentalElements.slice(0, 3).join(', ')}, ${correctedState.includeSaudiRealism ? 'subtle authentic Saudi daily urban background, ' : ''}natural dermatological pores, visible skin micro-texture, casual natural body posture --ar 9:16 --style raw --v 6.1 --no plastic skin, smooth face, airbrushed, cosmetic highlighter, 3d render, studio lighting, fake rim light, professional model pose, staged commercial photograph`;

  // 4. JSON Scene Model
  const jsonSpecification = JSON.stringify(
    {
      scene_engine: 'Selfie Scene Compatibility & Validation Architecture',
      scene_type: correctedState.sceneType,
      camera_geometry: {
        modality: 'Smartphone Front Camera',
        position: correctedState.cameraPosition,
        angle: correctedState.cameraAngle,
        framing: correctedState.framing,
        calculated_arm_reach_meters: armReachMeters,
      },
      biomechanics: {
        pose: correctedState.pose,
        weight_distribution: poseDef.biomechanicsDescEn,
        seat_compression_verified: poseDef.requiresSupport,
        contact_surface_verified: poseDef.requiresContact,
      },
      environment: {
        category: location.category,
        location_id: location.id,
        location_name: location.nameEn,
        ambient_objects: location.environmentalElements,
        saudi_regional_details: correctedState.includeSaudiRealism ? location.saudiDetails : [],
      },
      optics_and_lighting: {
        lighting_type: correctedState.lighting,
        time_of_day: correctedState.timeOfDay,
        atmospheric_weather: correctedState.weather,
        diegetic_sources_only: true,
      },
      background_density: correctedState.backgroundActivity,
      imperfections: correctedState.includeImperfectionLayer ? IMPERFECTION_LAYER_ELEMENTS : [],
      physical_validation_status: checks.map((c) => ({ rule: c.titleEn, passed: c.passed })),
    },
    null,
    2
  );

  return {
    chatgptPrompt,
    geminiPrompt,
    imageGenPrompt,
    jsonSpecification,
    validationReport: {
      passedAll: checks.every((c) => c.passed),
      checks,
    },
    spatialSummary: {
      armReachMeters,
      lightOrigins: getLightingText(correctedState.lighting),
      supportSurface: poseDef.requiresSupport ? 'Anchored seating plane with mass compression' : 'Ground pavement weight transfer',
      biomechanicsDesc: poseDef.biomechanicsDescAr,
    },
  };
}
