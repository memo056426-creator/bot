import {
  PhysicsPromptConfig,
  GeneratedPrompts,
} from '@/types/physics-engine';
import {
  AI_BEAUTIFICATION_BLACKLIST,
  PHYSICS_WHITELIST_TERMS,
} from '@/lib/physics-constants';

export function scrubBlacklist(text: string, customBlacklist: string[] = []): { cleanText: string; scrubbedWords: string[] } {
  const allBlacklist = Array.from(new Set([...AI_BEAUTIFICATION_BLACKLIST, ...customBlacklist]));
  const scrubbedWords: string[] = [];
  let cleanText = text;

  allBlacklist.forEach((term) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    if (regex.test(cleanText)) {
      scrubbedWords.push(term);
      cleanText = cleanText.replace(regex, '');
    }
  });

  // Clean double spaces
  cleanText = cleanText.replace(/\s{2,}/g, ' ').trim();
  return { cleanText, scrubbedWords };
}

export function compileLocalPrompts(config: PhysicsPromptConfig): GeneratedPrompts {
  const { cleanText, scrubbedWords } = config.lexical.autoScrubBlacklist
    ? scrubBlacklist(config.userIdea, config.lexical.customBlacklist)
    : { cleanText: config.userIdea, scrubbedWords: [] };

  const roughnessVal = Math.max(0.08, Number(config.materials.roughness.toFixed(2)));
  const kelvinVal = config.optics.kelvin;
  const distanceVal = config.optics.lightDistanceMeters;
  const diegeticSrc = config.optics.diegeticSource || 'ambient natural window light';

  // Negative Prompt List
  const negativeList = [
    ...AI_BEAUTIFICATION_BLACKLIST,
    ...config.lexical.customBlacklist,
    '3d render',
    'cgi',
    'doll skin',
    'wax figure',
    'over-processed',
    'digital smoothing',
    'highlighter makeup',
    'perfect symmetry',
    'floating unnatural rim light',
    'uniform skin tone',
    'oversaturated colors',
    'blur gradient artifacts',
  ];
  const uniqueNegatives = Array.from(new Set(negativeList)).join(', ');

  // 1. ChatGPT Prompt (System Directive & Role Enforcer)
  const chatgptPrompt = `[SYSTEM DIRECTIVE: STRICT PHYSICAL SIMULATION ENGINE - ZERO ARTISTIC SMOOTHING]
Act exclusively as an advanced computational physics simulation and optical renderer. Do not generate poetic, artistic, or beautified descriptions. Adhere strictly to the physical and optical constraints below:

### 1. CORE SIMULATION OBJECTIVE
Deconstruct and realize the following scene with forensic accuracy:
"${cleanText}"

### 2. OPTICS & RADIOMETRY PROTOCOL
- Inverse-Square Law: Light intensity strictly attenuates according to I ∝ 1/d² from source (distance: ${distanceVal} meters). No infinite, floating, or flat fill lights permitted.
- Thermodynamic Color Temperature: Primary illuminant calibrated at exactly ${kelvinVal}K (${diegeticSrc}). Secondary bounce adheres to accurate surface reflectance and Rayleigh/Mie volumetric scattering.
- Volumetric Particles: Suspended ${config.optics.volumetricType.replace('_', ' ')} with density index ${config.optics.volumetricDensity}. Color bleeding factor: ${config.optics.colorBleedAmount}.

### 3. CAMERA & EXPOSURE TRIANGLE
- Camera Sensor Profile: ${config.camera.sensorOrFilm}
- Lens Specification: ${config.camera.lensFocalLength}
- Exposure Triangle: Aperture ${config.camera.aperture} | Shutter Speed ${config.camera.shutterSpeed} | ISO ${config.camera.iso}
- Physical Optical Aberrations: ${config.camera.chromaticAberration ? 'Subtle longitudinal/lateral chromatic aberration on high-contrast fringes;' : ''} ${config.camera.barrelDistortion ? 'Mild optical barrel lens distortion;' : ''} ${config.camera.filmGrainOptical ? 'Organic chemical film/sensor analog grain distribution;' : ''}

### 4. PBR MATERIALS & THERMODYNAMICS
- Surface Roughness: ${roughnessVal} (Programmatic Rule: Roughness >= 0.08, perfect mirror polish strictly prohibited in natural environments).
- Metalness: ${config.materials.metalness.toFixed(2)} | Refractive Index (IOR): ${config.materials.ior}
- Ambient Temperature: ${config.materials.ambientTempCelsius}°C. Thermal phenomenon: ${config.materials.thermalEffect.replace(/_/g, ' ')}.

### 5. CLASSICAL MECHANICS & KINEMATICS
- Gravitational Vector: Constant g = 9.8 m/s² directed downwards. Must physically dictate fabric draping, structural tension, and skin/adipose tissue sagging.
- Equilibrium: Rigorous Center-of-Mass balance check enforced. ${config.mechanics.fluidDynamics !== 'none' ? `Fluid dynamics governed by ${config.mechanics.fluidDynamics.replace(/_/g, ' ')}.` : ''}

${config.biology.includeLivingSubject ? `### 6. MICRO-BIOLOGY & DERMATOLOGICAL REALISM
- Backlight Interaction: Render fine translucent vellus hair (peach fuzz) along contours under direct light paths.
- Specular Mapping: Non-uniform sebum distribution (natural oiliness across T-zone, nose bridge, temple margins; no synthetic cosmetic highlighter).
- Micro-Circulation: Capillary mapping with irregular subcutaneous flushing and subdermal hemoglobin undertones.
- Epidermal Micro-Asymmetry: Asymmetrical skin pores, expression lines, and natural structural variance.` : ''}

### 7. MANDATORY NEGATIVE EXCLUSIONS (NEGATIVE PROMPT)
Under no circumstances apply beautification filters, airbrushing, or digital smoothing.
PROHIBITED TERMS & ARTIFACTS: [${uniqueNegatives}]`;

  // 2. Gemini Protocol (Machine-Executable XML & Simulation Matrix)
  const geminiPrompt = `<PHYSICS_ENGINE_SIMULATION version="3.8" mode="STRICT_REALISM">
  <METADATA>
    <TARGET_ENGINE>Gemini Multimodal Simulation</TARGET_ENGINE>
    <SIMULATION_FIDELITY>${config.intensity.toUpperCase()}</SIMULATION_FIDELITY>
    <ANTI_SMOOTHING_OVERRIDE>ENFORCED</ANTI_SMOOTHING_OVERRIDE>
  </METADATA>

  <SCENE_INPUT>
    <RAW_DESCRIPTION>${cleanText}</RAW_DESCRIPTION>
  </SCENE_INPUT>

  <OPTICAL_CALIBRATION>
    <LIGHT_SOURCE diegetic="true" distance_meters="${distanceVal}" kelvin="${kelvinVal}K">
      ${diegeticSrc}
    </LIGHT_SOURCE>
    <ATTENUATION_LAW>I = I_0 / (d^2) [STRICT_INVERSE_SQUARE]</ATTENUATION_LAW>
    <ATMOSPHERIC_SCATTERING type="${config.optics.volumetricType}" density="${config.optics.volumetricDensity}" />
    <COLOR_BLEED coefficient="${config.optics.colorBleedAmount}" />
  </OPTICAL_CALIBRATION>

  <OPTICAL_SENSOR_EXPOSURE>
    <SENSOR_EMULSION>${config.camera.sensorOrFilm}</SENSOR_EMULSION>
    <FOCAL_LENGTH>${config.camera.lensFocalLength}</FOCAL_LENGTH>
    <APERTURE>${config.camera.aperture}</APERTURE>
    <SHUTTER_SPEED>${config.camera.shutterSpeed}</SHUTTER_SPEED>
    <ISO_SENSITIVITY>${config.camera.iso}</ISO_SENSITIVITY>
    <LENS_ABERRATIONS chromatic="${config.camera.chromaticAberration}" barrel_distortion="${config.camera.barrelDistortion}" analog_grain="${config.camera.filmGrainOptical}" />
  </OPTICAL_SENSOR_EXPOSURE>

  <PBR_THERMODYNAMICS>
    <SURFACE_ROUGHNESS min_allowed="0.08" actual="${roughnessVal}" />
    <SURFACE_METALNESS>${config.materials.metalness.toFixed(2)}</SURFACE_METALNESS>
    <INDEX_OF_REFRACTION ior="${config.materials.ior}" />
    <AMBIENT_TEMPERATURE celsius="${config.materials.ambientTempCelsius}" />
    <THERMAL_EFFECT>${config.materials.thermalEffect}</THERMAL_EFFECT>
  </PBR_THERMODYNAMICS>

  <MECHANICS_AND_GRAVITY>
    <GRAVITATIONAL_CONSTANT unit="m/s^2">9.8</GRAVITATIONAL_CONSTANT>
    <CENTER_OF_MASS_CHECK status="VERIFIED_STABLE" />
    <MASS_INERTIA_AND_FLUIDS>${config.mechanics.fluidDynamics}</MASS_INERTIA_AND_FLUIDS>
  </MECHANICS_AND_GRAVITY>

  ${config.biology.includeLivingSubject ? `<BIOLOGICAL_CONSTRAINTS>
    <VELLUS_HAIR status="ACTIVE" note="Translucent microscopic hair highlighted by rim illumination" />
    <SEBUM_SPECULARITY uniform="FALSE" pattern="Randomized dermal pore oil distribution" />
    <CAPILLARY_MAPS status="ACTIVE" note="Subdermal vascularization and micro-erythema" />
    <MICRO_ASYMMETRY status="ACTIVE" note="Organic anatomical variance" />
  </BIOLOGICAL_CONSTRAINTS>` : ''}

  <TEMPORAL_ENTROPY>
    <WEAR_STAGE>${config.entropy.temporalWear}</WEAR_STAGE>
    <UV_DEGRADATION>${config.entropy.uvDegradation}</UV_DEGRADATION>
    <SURFACE_OXIDATION>${config.entropy.oxidationRust}</SURFACE_OXIDATION>
    <AMBIENT_OCCLUSION_DIRT>${config.entropy.ambientOcclusionDirt}</AMBIENT_OCCLUSION_DIRT>
  </TEMPORAL_ENTROPY>

  <PROMPT_BLACKLIST_ENFORCEMENT>
    <EXCLUDE>${uniqueNegatives}</EXCLUDE>
  </PROMPT_BLACKLIST_ENFORCEMENT>
</PHYSICS_ENGINE_SIMULATION>`;

  // 3. Image Generator Parametric Prompt (Midjourney / Flux / SDXL)
  const bioPrompts = config.biology.includeLivingSubject
    ? 'subsurface scattering IOR 1.40, visible vellus hair under rim light, non-uniform sebum sheen on skin, visible cutaneous pores, micro-erythema capillary mapping, realistic natural facial asymmetry, unretouched dermatological documentation'
    : '';

  const cameraSpecs = `shot on ${config.camera.sensorOrFilm}, ${config.camera.lensFocalLength}, ${config.camera.aperture}, ${config.camera.shutterSpeed}, ISO ${config.camera.iso}, authentic optical lens chromatic aberration, analog organic film grain`;
  const opticsSpecs = `diegetic illumination from ${diegeticSrc} at ${kelvinVal}K color temperature, inverse-square law light falloff, volumetric ${config.optics.volumetricType.replace(/_/g, ' ')}, realistic bounce radiosity`;
  const materialSpecs = `PBR physical textures, surface roughness ${roughnessVal}, metalness ${config.materials.metalness.toFixed(2)}, ambient temperature ${config.materials.ambientTempCelsius}°C, ${config.materials.thermalEffect.replace(/_/g, ' ')}, ambient occlusion dust in micro-crevices`;

  const imageGenPrompt = `${cleanText}, ${cameraSpecs}, ${opticsSpecs}, ${materialSpecs}${bioPrompts ? `, ${bioPrompts}` : ''}, forensic unedited documentary photograph --ar 16:9 --style raw --v 6.1 --no ${uniqueNegatives}`;

  // 4. JSON Specification
  const jsonSpecification = JSON.stringify(
    {
      simulation_engine: 'Physics-Based Realism Engine v3.8',
      scene_descriptor: cleanText,
      optics: {
        inverse_square_law: true,
        source_distance_meters: distanceVal,
        color_temperature_kelvin: kelvinVal,
        diegetic_light_source: diegeticSrc,
        volumetric_medium: {
          type: config.optics.volumetricType,
          density: config.optics.volumetricDensity,
        },
        color_bleeding_coefficient: config.optics.colorBleedAmount,
      },
      camera_exposure: {
        body_sensor_emulsion: config.camera.sensorOrFilm,
        lens: config.camera.lensFocalLength,
        aperture: config.camera.aperture,
        shutter_speed: config.camera.shutterSpeed,
        iso: config.camera.iso,
        optical_artifacts: {
          chromatic_aberration: config.camera.chromaticAberration,
          barrel_distortion: config.camera.barrelDistortion,
          optical_grain: config.camera.filmGrainOptical,
        },
      },
      pbr_materials: {
        roughness: roughnessVal,
        metalness: config.materials.metalness,
        index_of_refraction: config.materials.ior,
        ambient_temperature_celsius: config.materials.ambientTempCelsius,
        thermal_phenomenon: config.materials.thermalEffect,
      },
      classical_mechanics: {
        gravity_vector: '0, -9.8, 0 m/s^2',
        center_of_mass_verified: true,
        fluid_behavior: config.mechanics.fluidDynamics,
      },
      biological_fidelity: config.biology.includeLivingSubject
        ? {
            vellus_hair_backlight: true,
            non_uniform_sebum_specularity: true,
            capillary_blood_mapping: true,
            epidermal_pore_variance: true,
            micro_anatomical_asymmetry: true,
          }
        : null,
      temporal_entropy: {
        wear_stage: config.entropy.temporalWear,
        uv_degradation: config.entropy.uvDegradation,
        oxidation_rust: config.entropy.oxidationRust,
        ambient_occlusion_dust: config.entropy.ambientOcclusionDirt,
      },
      negative_constraints: uniqueNegatives.split(', '),
    },
    null,
    2
  );

  // Realism calculation score
  let realismScore = 70;
  if (config.optics.inverseSquareLawStrict) realismScore += 5;
  if (roughnessVal >= 0.08 && roughnessVal <= 0.95) realismScore += 5;
  if (config.camera.chromaticAberration) realismScore += 4;
  if (config.biology.includeLivingSubject && config.biology.vellusHair && config.biology.capillaryMapping) realismScore += 8;
  if (config.entropy.ambientOcclusionDirt) realismScore += 4;
  if (scrubbedWords.length > 0) realismScore += 4;
  realismScore = Math.min(99, realismScore);

  return {
    chatgptPrompt,
    geminiPrompt,
    imageGenPrompt,
    negativePrompt: uniqueNegatives,
    jsonSpecification,
    physicsAnalysis: {
      scannedBlacklistTermsFound: scrubbedWords,
      injectedWhitelistTerms: PHYSICS_WHITELIST_TERMS.slice(0, 8),
      opticsSummary: `${kelvinVal}K Diegetic Light (${diegeticSrc}) with 1/d² inverse-square falloff`,
      cameraSummary: `${config.camera.sensorOrFilm} | ${config.camera.lensFocalLength} @ ${config.camera.aperture}, ${config.camera.shutterSpeed}, ISO ${config.camera.iso}`,
      materialsSummary: `PBR Roughness ${roughnessVal} (Strict Non-Zero), IOR ${config.materials.ior}, Temp ${config.materials.ambientTempCelsius}°C`,
      realismScore,
    },
  };
}
