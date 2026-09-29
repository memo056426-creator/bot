'use client';

import React from 'react';
import { X, BookOpen, ShieldCheck, SunMedium, Camera, Layers, Activity, Dna, Clock, Ban } from 'lucide-react';

interface RulesDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
}

export function RulesDocumentationModal({ isOpen, onClose, language }: RulesDocumentationModalProps) {
  const isAr = language === 'ar';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-100">
                {isAr ? 'الميثاق الهندسي والمعايير الفيزيائية' : 'Technical Specifications & Physics Charter'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isAr ? 'القواعد الصارمة لمحاكاة الواقع ومنع التجميل الاصطناعي' : 'Core Architecture of the Physics-Based Generation Engine'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4>{isAr ? '1. منطق المحرك وتفكيك المدخلات (Core Engine Logic)' : '1. Core Engine Logic & Input Parsing'}</h4>
            </div>
            <p className="text-zinc-400">
              {isAr
                ? 'يعمل التطبيق كمحاكي فيزيائي بدلاً من نموذج توليد فني. يتم تفكيك أي وصف كيفي أو جمالي (مثل "صورة جميلة" أو "إضاءة ناعمة") إلى متغيرات رياضية، بصرية وميكانيكية ملموسة.'
                : 'Configures models to function strictly as a Physics Simulation Engine rather than an aesthetic art generator, parsing qualitative adjectives into concrete optical and mechanical equations.'}
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <SunMedium className="w-4 h-4 text-amber-400" />
              <h4>{isAr ? '2. وحدة البصريات والضوء (Optics & Light Module)' : '2. Optics & Light Module'}</h4>
            </div>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 ps-2">
              <li>
                <strong className="text-zinc-200">{isAr ? 'قانون التربيع العكسي:' : 'Inverse-Square Law:'}</strong>{' '}
                {isAr
                  ? 'حساب تضاؤل شدة الضوء حسب المعادلة I ∝ 1/d²، ومنع الإضاءة السطحية أو العائمة.'
                  : 'Enforces light attenuation according to I ∝ 1/d²; flat or infinite lighting is strictly prohibited.'}
              </li>
              <li>
                <strong className="text-zinc-200">{isAr ? 'درجة الحرارة بالكلفن:' : 'Kelvin Values:'}</strong>{' '}
                {isAr
                  ? 'تحديد كل مصدر ضوء بقيمة Kelvin دقيقة (مثلاً 2700K للتنجستن، 5600K للنهار).'
                  : 'All light sources defined by exact thermodynamic Kelvin values instead of generic color names.'}
              </li>
              <li>
                <strong className="text-zinc-200">{isAr ? 'معامل الانكسار IOR:' : 'Index of Refraction:'}</strong>{' '}
                {isAr
                  ? 'تطبيق قيم فيزيائية للتشتت تحت السطحي (1.40 لبشرة الإنسان، 1.33 للماء).'
                  : 'Physical IOR constants utilized for Subsurface Scattering (SSS) in skin, water, and glass.'}
              </li>
              <li>
                <strong className="text-zinc-200">{isAr ? 'الإضاءة المبررة فيزيائياً:' : 'Diegetic Lighting:'}</strong>{' '}
                {isAr
                  ? 'كل فوتون ضوء يجب أن ينبعث من مصدر مادي مرئي أو محدد داخل المشهد.'
                  : 'Every photon must originate from a traceable, physical in-scene source.'}
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <Camera className="w-4 h-4 text-blue-400" />
              <h4>{isAr ? '3. الكاميرا ومثلث التعريض (Camera & Exposure Triangle)' : '3. Camera & Exposure Triangle'}</h4>
            </div>
            <p className="text-zinc-400">
              {isAr
                ? 'إجبار النماذج على حساب مثلث التعريض الحقيقي: فتحة العدسة (Aperture مثل f/2.8)، سرعة الغالق (Shutter Speed مثل 1/125s)، وحساسية المستشعر (ISO). استخدام مستشعرات حقيقية مثل ARRI Alexa 65 أو أفلام كيميائية مثل Kodak Portra 400 بدلاً من كلمة "cinematic".'
                : 'Forces real camera exposure variables (Aperture, Shutter, ISO) and authentic sensor profiles (ARRI Alexa 65, Kodak Portra 400) eliminating generic cinematic buzzwords.'}
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4>{isAr ? '4. المواد والديناميكا الحرارية (PBR Materials)' : '4. Materials & Thermodynamics'}</h4>
            </div>
            <p className="text-zinc-400">
              {isAr
                ? 'شرط قطعي: رفض أي مادة تكون خشونتها صفر (Roughness = 0)، فالنعومة المثالية غير موجودة في الطبيعة (الحد الأدنى 0.08). تطبيق ظاهرة شليرين (Schlieren) عند درجات الحرارة المرتفعة، وتكثف الرطوبة في البرودة.'
                : 'Hard programmatic constraint: Roughness = 0 is rejected (minimum 0.08). Includes Schlieren heat distortion and surface condensation.'}
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <Dna className="w-4 h-4 text-rose-400" />
              <h4>{isAr ? '5. البيولوجيا الدقيقة ومنع البشرة البلاستيكية (Micro-Biology)' : '5. Micro-Biology Strictness'}</h4>
            </div>
            <p className="text-zinc-400">
              {isAr
                ? 'إلزام ظهور زغب الخوخ (Vellus Hair) الشفاف في الإضاءة الخلفية، وتوزيع غير متساوٍ للدهون والزهم (Sebum) لمنع لمعان المكياج التجميلي، وخرائط الشعيرات الدموية تحت الجلد لكسر اللون الموحد.'
                : 'Enforces translucent vellus hair (peach fuzz), non-uniform sebum maps (preventing cosmetic highlighter), and capillary flushing.'}
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <Camera className="w-4 h-4 text-emerald-400" />
              <h4>{isAr ? '6. ميثاق سيلفي التوافق المشهدي (Selfie Scene Compatibility)' : '6. Selfie Scene Compatibility Architecture'}</h4>
            </div>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 ps-2">
              <li>
                <strong className="text-zinc-200">{isAr ? 'هندسة مسافة الذراع (Arm Reach):' : 'Arm Reach Geometry:'}</strong>{' '}
                {isAr
                  ? 'الهاتف دوماً ضمن مسافة ذراع واقعية (0.45m إلى 0.85m)، مع حظر المنظور البعيد غير المنطقي.'
                  : 'Phone is strictly held within human arm extension (0.45m - 0.85m); no phantom telephoto perspectives.'}
              </li>
              <li>
                <strong className="text-zinc-200">{isAr ? 'فيزياء الجلوس والاستناد:' : 'Seated & Leaning Physics:'}</strong>{' '}
                {isAr
                  ? 'الجلوس يتطلب انضغاط حشوة المقعد، والاستناد يتطلب سطح تلامس فيزيائي وإزاحة لمركز الثقل.'
                  : 'Seated poses require cushion mass compression; leaning requires a rigid contact plane and center-of-gravity shift.'}
              </li>
              <li>
                <strong className="text-zinc-200">{isAr ? 'سيلفي السيارة المتوقفة:' : 'Stationary Vehicle Physics:'}</strong>{' '}
                {isAr
                  ? 'السيارة متوقفة بأمان؛ هندسة المقود والمقعد وتطابق الزجاج الجانبي.'
                  : 'Vehicle is strictly stationary; steering wheel clearance and window parallax exact.'}
              </li>
              <li>
                <strong className="text-zinc-200">{isAr ? 'سيلفي المرآة والانعكاس:' : 'Mirror Reflection Geometry:'}</strong>{' '}
                {isAr
                  ? 'يُسمح فقط عند وجود مرآة حقيقية، مع ظهور الهاتف في اليد ومطابقة زاوية النظر وشعاع الانعكاس.'
                  : 'Allowed only with valid reflective surface; camera visibly held and ray-trace vector matching.'}
              </li>
              <li>
                <strong className="text-zinc-200">{isAr ? 'الواقعية السعودية والعيوب الطبيعية:' : 'Saudi Realism & Imperfections:'}</strong>{' '}
                {isAr
                  ? 'أرصفة بلدية حقيقية، لوحات عربية، غبار طرقات طبيعي، مسام بشرة حقيقية وزغب الخوخ الشفاف.'
                  : 'Authentic municipal curbs, Arabic signage, road dust, and real dermatological pores.'}
              </li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <Ban className="w-4 h-4 text-red-400" />
              <h4>{isAr ? '7. فلتر التجميل الممنوع (The Blacklist Layer)' : '7. Blacklist / Anti-Smoothing Layer'}</h4>
            </div>
            <p className="text-zinc-400">
              {isAr
                ? 'شطب تلقائي لكلمات مثل: (beautiful, flawless, glowing, artistic, stylized, perfect, smooth skin, airbrushed, 8k, photorealistic) وتوليد قائمة كلمات سلبية ضخمة تحظر تلميع الذكاء الاصطناعي.'
                : 'Automatic lexical purge of beautification buzzwords, replaced with scientific negative prompt exclusions.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex justify-end bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition"
          >
            {isAr ? 'فهمت الميثاق' : 'Acknowledge Specs'}
          </button>
        </div>
      </div>
    </div>
  );
}
