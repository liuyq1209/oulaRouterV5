import zhLocal from './zh-CN';
import zhTWLocal from './zh-TW';
import enUSLocal from './en-US';

const locales = {
  'zh-CN': zhLocal,
  'zh-TW': zhTWLocal,
  'en-US': enUSLocal,
};

type GLocaleWindow = {
  g_locale: keyof typeof locales;
};

export type LocaleType = keyof typeof locales;

const getLanguage = (): string => {
  return 'zh-CN';
  // eslint-disable-next-line no-unreachable
  const lang = window.localStorage.getItem('umi_locale');
  return (
    lang ||
    (window as unknown as GLocaleWindow).g_locale ||
    navigator.language ||
    'zh-CN'
  );
};

export { getLanguage };

export default (): Record<string, string> => {
  const gLocale = getLanguage();
  if (locales[gLocale]) {
    return locales[gLocale];
  }
  return locales['zh-CN'];
};
