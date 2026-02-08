import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from './ui/select';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
];

export function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="text-sm text-muted-foreground">
        {t('languageSelector.title')}:
      </label>
      <Select
        id="language-select"
        value={i18n.language}
        onChange={handleLanguageChange}
        className="w-32"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </Select>
    </div>
  );
}
