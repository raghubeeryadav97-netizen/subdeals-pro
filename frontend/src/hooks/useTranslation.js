import { useState, useCallback } from 'react';
import { t, setLanguage, getLanguage } from '../i18n';

export const useTranslation = () => {
  const [lang, setLang] = useState(getLanguage());

  const changeLang = useCallback((newLang) => {
    setLanguage(newLang);
    setLang(newLang);
  }, []);

  const translate = useCallback((key) => t(key), [lang]);

  return { t: translate, lang, changeLang };
};