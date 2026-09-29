export type TargetEngine = 'chatgpt' | 'gemini' | 'image_gen' | 'universal' | 'json';

export type PhysicsIntensity = 'subtle' | 'cinematic' | 'forensic' | 'extreme_optical';

export interface OpticsSettings {
  kelvin: number; // e.g. 1800 - 10000
  lightDistanceMeters: number; // e.g. 0.5 - 20
  inverseSquareLawStrict: boolean;
  diegeticSource: string; // e.g. 'North-facing diffused window', 'Flickering 40W fluorescent', 'Single 3200K tungsten lamp'
  volumetricDensity: number; // 0 to 1 (dust, haze, smoke)
  volumetricType: 'dust_motes' | 'morning_mist' | 'industrial_smoke' | 'clean_vacuum' | 'sea_spray';
  colorBleedAmount: number; // 0 to 1
}

export interface CameraSettings {
  aperture: string; // e.g. 'f/1.4', 'f/2.8', 'f/8', 'f/16'
  shutterSpeed: string; // e.g. '1/8000s', '1/500s', '1/60s', '1/4s'
  iso: number; // e.g. 100, 400, 800, 3200
  sensorOrFilm: string; // e.g. 'ARRI Alexa 65', 'Kodak Portra 400', 'RED V-Raptor 8K', 'Ilford HP5 Plus (B&W)', 'Fujifilm Superia 400'
  lensFocalLength: string; // e.g. '24mm wide-angle', '50mm standard prime', '85mm portrait', '100mm macro'
  chromaticAberration: boolean;
  barrelDistortion: boolean;
  filmGrainOptical: boolean;
}

export interface MaterialSettings {
  roughness: number; // 0.08 to 1.0 (enforced >= 0.08)
  metalness: number; // 0.0 to 1.0
  ior: number; // e.g. 1.33 (water), 1.40 (skin), 1.52 (glass)
  iorPreset: 'skin' | 'water' | 'glass' | 'amber' | 'vegetation' | 'concrete' | 'custom';
  ambientTempCelsius: number; // -30 to +60
  thermalEffect: 'none' | 'schlieren_heat_distortion' | 'condensation_frost' | 'sweat_micro_droplets' | 'evaporation_steam';
}

export interface MechanicsSettings {
  gravityConstant: number; // 9.8 m/s^2
  centerOfMassEnforced: boolean;
  fabricSagAndTension: boolean;
  fluidDynamics: 'none' | 'water_splash_momentum' | 'viscous_oil_drag' | 'surface_tension_droplet' | 'powder_turbulent_drift';
}

export interface BiologySettings {
  includeLivingSubject: boolean;
  vellusHair: boolean; // Peach fuzz under backlight
  nonUniformSebum: boolean; // T-zone specular variation
  capillaryMapping: boolean; // Micro-flushing & subdermal veins
  irregularPores: boolean;
  microAsymmetry: boolean;
}

export interface EntropySettings {
  temporalWear: 'pristine_industrial' | 'moderate_wear' | 'heavy_weathering' | 'ancient_decay';
  uvDegradation: boolean; // Sun bleaching
  oxidationRust: boolean; // Surface oxidation
  ambientOcclusionDirt: boolean; // Dust in deep crevices
}

export interface LexicalFilterSettings {
  autoScrubBlacklist: boolean;
  autoInjectWhitelist: boolean;
  customBlacklist: string[];
  customWhitelist: string[];
}

export interface PhysicsPromptConfig {
  userIdea: string;
  language: 'ar' | 'en';
  targetEngine: TargetEngine;
  intensity: PhysicsIntensity;
  optics: OpticsSettings;
  camera: CameraSettings;
  materials: MaterialSettings;
  mechanics: MechanicsSettings;
  biology: BiologySettings;
  entropy: EntropySettings;
  lexical: LexicalFilterSettings;
}

export interface GeneratedPrompts {
  chatgptPrompt: string;
  geminiPrompt: string;
  imageGenPrompt: string;
  negativePrompt: string;
  jsonSpecification: string;
  physicsAnalysis: {
    scannedBlacklistTermsFound: string[];
    injectedWhitelistTerms: string[];
    opticsSummary: string;
    cameraSummary: string;
    materialsSummary: string;
    realismScore: number; // 0 - 100
  };
}

export interface SimulationResult {
  evaluation: string;
  complianceChecks: {
    rule: string;
    passed: boolean;
    detail: string;
  }[];
  simulatedSceneRender: string;
}
