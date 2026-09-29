import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { PhysicsPromptConfig, GeneratedPrompts } from '@/types/physics-engine';
import { compileLocalPrompts } from '@/lib/prompt-compiler';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const config: PhysicsPromptConfig = await req.json();

    // 1. First generate deterministic baseline prompts
    const localResult = compileLocalPrompts(config);

    // If no GEMINI_API_KEY is present or if offline, return local compilation
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        ...localResult,
        source: 'local_engine',
      });
    }

    // 2. Invoke Gemini 3.8 Flash for deep reverse-engineering and physics translation layer
    const systemPrompt = `You are the core intelligence of the "Physics-Based Generation Engine" (AI Studio Build).
Your mission is to act as an uncompromising computational physics and optical simulation engineer.
Convert user input into hyper-realistic, mathematically and physically grounded prompts tailored for ChatGPT, Gemini, and Image generation models (Midjourney v6 / Flux).

HARD CONSTRAINTS:
1. ABSOLUTE REALISM: Completely reject artistic, airbrushed, or beautified tropes (beautiful, glowing, flawless, smooth, cinematic rim light).
2. OPTICS: Enforce Inverse-Square Law (I ∝ 1/d²), Thermodynamic Color Temperature (exact Kelvin values), and Index of Refraction (IOR). All light must be diegetic (traceable to an in-scene physical source).
3. PBR MATERIALS: Non-zero roughness (Roughness >= 0.08), metalness, ambient temperature effects (Schlieren distortion, condensation, sweat).
4. MECHANICS: Gravitational vector g = 9.8 m/s² dictating fabric draping and tissue tension. Center of mass equilibrium.
5. MICRO-BIOLOGY: Vellus hair (peach fuzz under backlight), non-uniform specular sebum (T-zone oils, no highlighter), irregular skin pores, subdermal capillary mapping.
6. TEMPORAL ENTROPY: UV degradation, oxidation, ambient occlusion grime in deep crevices.
7. CAMERA & EXPOSURE: Authentic sensor (ARRI, Hasselblad, Kodak Portra), exact aperture, shutter speed, ISO, chromatic aberration, optical grain.

Return your response in valid JSON matching this structure:
{
  "chatgptPrompt": "Deeply engineered system directive & user prompt for ChatGPT-4o/o1/4.5...",
  "geminiPrompt": "<PHYSICS_ENGINE_SIMULATION> structured machine XML block for Gemini...",
  "imageGenPrompt": "Parametric comma-separated raw prompt for Midjourney/Flux with --no block...",
  "negativePrompt": "Comma separated blacklist of 30+ beautification and plastic terms...",
  "jsonSpecification": "Pretty JSON string of physical parameters...",
  "physicsAnalysis": {
    "scannedBlacklistTermsFound": ["list", "of", "scrubbed", "words"],
    "injectedWhitelistTerms": ["list", "of", "whitelisted", "physical", "terms"],
    "opticsSummary": "Summary of optical calculations",
    "cameraSummary": "Summary of exposure triangle",
    "materialsSummary": "Summary of PBR parameters",
    "realismScore": 96
  }
}`;

    const userContents = `Please reverse-engineer this scene into physics specifications:
User Idea: "${config.userIdea}"
Language Preference: ${config.language === 'ar' ? 'Bilingual (Arabic explanation with English technical commands)' : 'English'}
Target Engine: ${config.targetEngine}
Physics Intensity: ${config.intensity}
Selected Optics: Kelvin ${config.optics.kelvin}K, Distance ${config.optics.lightDistanceMeters}m, Diegetic Source: "${config.optics.diegeticSource}", Volumetrics: ${config.optics.volumetricType} (density ${config.optics.volumetricDensity})
Selected Camera: Sensor: ${config.camera.sensorOrFilm}, Lens: ${config.camera.lensFocalLength}, Aperture: ${config.camera.aperture}, Shutter: ${config.camera.shutterSpeed}, ISO: ${config.camera.iso}
Selected Materials: Roughness: ${config.materials.roughness}, Metalness: ${config.materials.metalness}, IOR: ${config.materials.ior}, Temp: ${config.materials.ambientTempCelsius}°C, Thermal: ${config.materials.thermalEffect}
Selected Mechanics: Gravity g = 9.8m/s², Fluid: ${config.mechanics.fluidDynamics}
Selected Biology: Living subject = ${config.biology.includeLivingSubject}, Vellus hair = ${config.biology.vellusHair}, Sebum = ${config.biology.nonUniformSebum}, Capillaries = ${config.biology.capillaryMapping}
Selected Entropy: Wear = ${config.entropy.temporalWear}, UV = ${config.entropy.uvDegradation}, Rust = ${config.entropy.oxidationRust}, AO Dirt = ${config.entropy.ambientOcclusionDirt}
Scrub Blacklist: ${config.lexical.autoScrubBlacklist}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2, // low temperature for rigorous technical fidelity
      },
    });

    const text = response.text;
    if (text) {
      try {
        const parsed = JSON.parse(text) as GeneratedPrompts;
        return NextResponse.json({
          ...parsed,
          source: 'gemini-3.8-flash',
        });
      } catch (err) {
        console.error('Failed to parse Gemini JSON output, falling back to local compiler:', err);
      }
    }

    // Fallback if AI response was not parseable
    return NextResponse.json({
      ...localResult,
      source: 'local_engine_fallback',
    });
  } catch (error) {
    console.error('Error generating physics prompt:', error);
    // In case of error, fall back gracefully to local deterministic compilation
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
