'use client';

import { useEffect } from 'react';

export function DocumentLang({ locale }: { locale: string }) {
  const lang = locale === 'en' ? 'en' : locale === 'ja' ? 'ja' : 'zh-TW';

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
