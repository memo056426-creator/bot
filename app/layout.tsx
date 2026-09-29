import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'محرك البرومبت الفيزيائي | Physics Prompt Engine',
  description: 'توليد برومبتات فيزيائية صارمة وعالية الدقة موجهة إلى ChatGPT و Gemini مع محاكاة البصريات والمواد والكاميرا والبيولوجيا الدقيقة لمنع التجميل الاصطناعي.',
  openGraph: {
    title: 'محرك البرومبت الفيزيائي | Physics Prompt Engine',
    description: 'توليد برومبتات فيزيائية صارمة وعالية الدقة موجهة إلى ChatGPT و Gemini مع محاكاة البصريات والمواد والكاميرا والبيولوجيا الدقيقة لمنع التجميل الاصطناعي.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'محرك البرومبت الفيزيائي | Physics Prompt Engine',
    description: 'توليد برومبتات فيزيائية صارمة وعالية الدقة موجهة إلى ChatGPT و Gemini مع محاكاة البصريات والمواد والكاميرا والبيولوجيا الدقيقة لمنع التجميل الاصطناعي.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
