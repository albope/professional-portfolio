import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default function RootPage() {
  // Detectar idioma del navegador
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';

  // Si el navegador está en inglés, redirigir a /en, sino a /es (default)
  const preferredLang = acceptLanguage.toLowerCase().startsWith('en') ? 'en' : 'es';

  redirect(`/${preferredLang}`);
}
