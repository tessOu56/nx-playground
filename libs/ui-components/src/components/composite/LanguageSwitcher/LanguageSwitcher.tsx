'use client';

import { type SupportedLanguage, useI18nSmart } from '@nx-playground/i18n';
import { type FC } from 'react';

import { Button } from '../../core/Button/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../core/Select/Select';

interface LanguageOption {
  code: string;
  name: string;
}

interface LanguageSwitcherProps {
  /** 語言選項 */
  languages?: LanguageOption[];
  /** 語言變更時的回調函數 (可選，會覆蓋默認的 i18n 邏輯) */
  onLanguageChange?: (languageCode: string) => void;
  /** CSS 類名 */
  className?: string;
  /** 顯示模式 */
  variant?: 'dropdown' | 'buttons';
  /** 下拉框佔位符 */
  placeholder?: string;
  /** 當前語言 */
  currentLanguage?: string;
  /** 語言變更函數 */
  changeLanguage?: (language: SupportedLanguage) => Promise<void>;
  /** 是否正在變更語言 */
  isLanguageChanging?: boolean;
}

// 默認支持的語言
const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'en', name: 'English' },
];

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  languages = DEFAULT_LANGUAGES,
  onLanguageChange,
  className = '',
  variant = 'dropdown',
  placeholder = '選擇語言',
}) => {
  const { currentLanguage, changeLanguage, isLanguageChanging } =
    useI18nSmart();

  const handleLanguageChange = (languageCode: string) => {
    if (!isLanguageChanging && languageCode !== currentLanguage) {
      if (onLanguageChange) {
        onLanguageChange(languageCode);
      } else {
        changeLanguage(languageCode as SupportedLanguage);
      }
    }
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {languages.map(({ code, name }) => (
          <Button
            key={code}
            onClick={() => handleLanguageChange(code)}
            disabled={isLanguageChanging}
            variant={code === currentLanguage ? 'primary' : 'outline'}
            size='sm'
          >
            {name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <Select
        value={currentLanguage}
        onValueChange={handleLanguageChange}
        disabled={isLanguageChanging}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {languages.map(({ code, name }) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
