import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import vi from './locales/vi.json';

const LANGUAGE_KEY = '@app_language';

// Define the resources type
const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

// Get the device language, default to 'en'
const getDeviceLanguage = (): string => {
  const locale = Localization.getLocales()[0]?.languageCode || 'en';
  // Only support 'en' and 'vi', fallback to 'en' for other languages
  return locale === 'vi' ? 'vi' : 'en';
};

// Initialize language from AsyncStorage or device
const initLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
      return savedLanguage;
    }
    return getDeviceLanguage();
  } catch (error) {
    console.error('Error loading language:', error);
    return getDeviceLanguage();
  }
};

// Change language and persist to AsyncStorage
export const changeLanguage = async (language: 'en' | 'vi'): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// Get current language
export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

// Initialize i18n
const initI18n = async (): Promise<void> => {
  const language = await initLanguage();
  
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

// Initialize immediately
initI18n();

export default i18n;
