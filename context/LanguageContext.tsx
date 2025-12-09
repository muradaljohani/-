
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Types ---
type LanguageCode = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ja' | 'ru' | 'it' | 'pt';
type Direction = 'rtl' | 'ltr';

interface TranslationDictionary {
  [key: string]: string;
}

interface LanguageContextType {
  language: LanguageCode;
  direction: Direction;
  changeLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary; // The current translation object
}

// --- Dictionary Data ---
const translations: Record<LanguageCode, TranslationDictionary> = {
  ar: {
    brand_name: "ميلاف مراد",
    brand_sub: "المنصة الوطنية",
    nav_corp: "الشركة",
    nav_market: "السوق",
    nav_academy: "الأكاديمية",
    nav_jobs: "الوظائف",
    login: "دخول",
    logout: "تسجيل الخروج",
    dashboard: "لوحة التحكم",
    settings: "الإعدادات",
    theme_light: "الوضع النهاري",
    theme_dark: "الوضع الليلي",
    search_placeholder: "ابحث هنا...",
  },
  en: {
    brand_name: "Mylaf Murad",
    brand_sub: "National Platform",
    nav_corp: "Corporate",
    nav_market: "Market",
    nav_academy: "Academy",
    nav_jobs: "Jobs",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    settings: "Settings",
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
    search_placeholder: "Search here...",
  },
  fr: {
    brand_name: "Mylaf Murad",
    brand_sub: "Plateforme Nationale",
    nav_corp: "Entreprise",
    nav_market: "Marché",
    nav_academy: "Académie",
    nav_jobs: "Emplois",
    login: "Connexion",
    logout: "Déconnexion",
    dashboard: "Tableau de bord",
    settings: "Paramètres",
    theme_light: "Mode Clair",
    theme_dark: "Mode Sombre",
    search_placeholder: "Rechercher...",
  },
  es: {
    brand_name: "Mylaf Murad",
    brand_sub: "Plataforma Nacional",
    nav_corp: "Corporativo",
    nav_market: "Mercado",
    nav_academy: "Academia",
    nav_jobs: "Empleos",
    login: "Acceso",
    logout: "Cerrar sesión",
    dashboard: "Tablero",
    settings: "Ajustes",
    theme_light: "Modo Claro",
    theme_dark: "Modo Oscuro",
    search_placeholder: "Buscar...",
  },
  de: {
    brand_name: "Mylaf Murad",
    brand_sub: "Nationale Plattform",
    nav_corp: "Unternehmen",
    nav_market: "Markt",
    nav_academy: "Akademie",
    nav_jobs: "Jobs",
    login: "Anmelden",
    logout: "Abmelden",
    dashboard: "Instrumententafel",
    settings: "Einstellungen",
    theme_light: "Heller Modus",
    theme_dark: "Dunkler Modus",
    search_placeholder: "Suchen...",
  },
  zh: {
    brand_name: "Mylaf Murad",
    brand_sub: "国家平台",
    nav_corp: "企业",
    nav_market: "市场",
    nav_academy: "学院",
    nav_jobs: "工作",
    login: "登录",
    logout: "登出",
    dashboard: "仪表板",
    settings: "设置",
    theme_light: "亮色模式",
    theme_dark: "暗色模式",
    search_placeholder: "搜索...",
  },
  ja: {
    brand_name: "Mylaf Murad",
    brand_sub: "ナショナルプラットフォーム",
    nav_corp: "企業",
    nav_market: "市場",
    nav_academy: "アカデミー",
    nav_jobs: "仕事",
    login: "ログイン",
    logout: "ログアウト",
    dashboard: "ダッシュボード",
    settings: "設定",
    theme_light: "ライトモード",
    theme_dark: "ダークモード",
    search_placeholder: "検索...",
  },
  ru: {
    brand_name: "Mylaf Murad",
    brand_sub: "Национальная платформа",
    nav_corp: "Корпоративный",
    nav_market: "Рынок",
    nav_academy: "Академия",
    nav_jobs: "Вакансии",
    login: "Войти",
    logout: "Выйти",
    dashboard: "Панель",
    settings: "Настройки",
    theme_light: "Светлый режим",
    theme_dark: "Темный режим",
    search_placeholder: "Поиск...",
  },
  it: {
    brand_name: "Mylaf Murad",
    brand_sub: "Piattaforma Nazionale",
    nav_corp: "Aziendale",
    nav_market: "Mercato",
    nav_academy: "Accademia",
    nav_jobs: "Lavori",
    login: "Accesso",
    logout: "Disconnettersi",
    dashboard: "Cruscotto",
    settings: "Impostazioni",
    theme_light: "Modalità Chiara",
    theme_dark: "Modalità Scura",
    search_placeholder: "Cerca...",
  },
  pt: {
    brand_name: "Mylaf Murad",
    brand_sub: "Plataforma Nacional",
    nav_corp: "Corporativo",
    nav_market: "Mercado",
    nav_academy: "Academia",
    nav_jobs: "Empregos",
    login: "Entrar",
    logout: "Sair",
    dashboard: "Painel",
    settings: "Configurações",
    theme_light: "Modo Claro",
    theme_dark: "Modo Escuro",
    search_placeholder: "Pesquisar...",
  }
};

export const SUPPORTED_LANGUAGES: { code: LanguageCode; name: string; dir: Direction }[] = [
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'es', name: 'Español', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', dir: 'ltr' },
  { code: 'zh', name: '中文', dir: 'ltr' },
  { code: 'ja', name: '日本語', dir: 'ltr' },
  { code: 'ru', name: 'Русский', dir: 'ltr' },
  { code: 'it', name: 'Italiano', dir: 'ltr' },
  { code: 'pt', name: 'Português', dir: 'ltr' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to Arabic
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('murad_lang');
    return (saved as LanguageCode) || 'ar';
  });

  const [direction, setDirection] = useState<Direction>(language === 'ar' ? 'rtl' : 'ltr');

  // Effect to update DOM direction when language changes
  useEffect(() => {
    const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === language);
    const dir = langConfig?.dir || 'ltr';
    
    setDirection(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Save to storage
    localStorage.setItem('murad_lang', language);
  }, [language]);

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      direction, 
      changeLanguage, 
      t: translations[language] 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
