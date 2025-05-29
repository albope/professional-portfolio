// src/components/ui/LanguageSwitcher.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from './Button' // Asegúrate que la ruta es correcta
import { i18n } from '../../../i18n-config' // Ajusta la ruta si es necesario

export function LanguageSwitcher() {
  const pathname = usePathname()

  const getLocalizedPath = (locale: string) => {
    if (!pathname) return '/'
    const segments = pathname.split('/')
    segments[1] = locale // Asume que el locale es el primer segmento después de /
    return segments.join('/')
  }

  const currentLang = pathname.split('/')[1]

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-300 dark:border-slate-700 p-1">
      {i18n.locales.map((locale) => (
        <Link key={locale} href={getLocalizedPath(locale)} passHref>
          <Button 
            variant={currentLang === locale ? 'default' : 'ghost'} 
            size="sm" // Asegúrate que tienes este tamaño en Button.tsx
            className="rounded-full text-xs px-3" // Ajusta padding si es necesario
          >
            {locale.toUpperCase()}
          </Button>
        </Link>
      ))}
    </div>
  )
}