import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'hi' | 'en';

interface Translations {
  [key: string]: {
    hi: string;
    en: string;
  };
}

const translations: Translations = {
  // App name
  appName: { hi: 'मंडी मित्र', en: 'Mandi Mitra' },
  appTagline: { hi: 'आपका बाज़ार साथी', en: 'Your Market Companion' },
  
  // Welcome screen
  welcomeTitle: { hi: 'अपनी फसल बेचने का सही समय और जगह जानें', en: 'Know the right time and place to sell your crop' },
  welcomeSubtitle: { hi: 'Weather app की तरह, यह ऐप आपके इलाके के हिसाब से मंडी की जानकारी दिखाता है', en: 'Like a weather app, this app shows market information based on your area' },
  getStarted: { hi: 'शुरू करें', en: 'Get Started' },
  
  // Location screen
  allowLocation: { hi: 'Location Allow करें', en: 'Allow Location' },
  yourArea: { hi: 'आपका इलाका', en: 'Your Area' },
  madhyaPradesh: { hi: 'मध्य प्रदेश', en: 'Madhya Pradesh' },
  confirm: { hi: 'सही है', en: 'Confirm' },
  changeLocation: { hi: 'बदलें', en: 'Change' },
  selectDistrict: { hi: 'जिला चुनें', en: 'Select District' },
  privacyNote: { hi: 'Location सिर्फ जानकारी दिखाने के लिए उपयोग होती है', en: 'Location is only used to show relevant information' },
  detectingLocation: { hi: 'आपका स्थान पता लगा रहे हैं...', en: 'Detecting your location...' },
  
  // Crop selection
  selectCrop: { hi: 'फसल चुनें', en: 'Select Crop' },
  quantity: { hi: 'मात्रा (क्विंटल)', en: 'Quantity (Quintal)' },
  optional: { hi: 'वैकल्पिक', en: 'Optional' },
  viewMarket: { hi: 'Market देखें', en: 'View Market' },
  
  // Crops
  wheat: { hi: 'गेहूं', en: 'Wheat' },
  soybean: { hi: 'सोयाबीन', en: 'Soybean' },
  chana: { hi: 'चना', en: 'Chana' },
  rice: { hi: 'धान', en: 'Rice' },
  maize: { hi: 'मक्का', en: 'Maize' },
  tomato: { hi: 'टमाटर', en: 'Tomato' },
  onion: { hi: 'प्याज', en: 'Onion' },
  potato: { hi: 'आलू', en: 'Potato' },
  garlic: { hi: 'लहसुन', en: 'Garlic' },
  moong: { hi: 'मूंग', en: 'Moong' },
  masoor: { hi: 'मसूर', en: 'Masoor' },
  
  // Market screen
  nearbyMandis: { hi: 'आस-पास की मंडियां', en: 'Nearby Mandis' },
  currentPrice: { hi: 'आज का भाव', en: 'Current Price' },
  perQuintal: { hi: '₹/क्विंटल', en: '₹/Quintal' },
  priceTrend: { hi: 'भाव का रुख', en: 'Price Trend' },
  rising: { hi: 'बढ़ रहा है', en: 'Rising' },
  stable: { hi: 'स्थिर', en: 'Stable' },
  falling: { hi: 'गिर रहा है', en: 'Falling' },
  demand: { hi: 'मांग', en: 'Demand' },
  high: { hi: 'ज़्यादा', en: 'High' },
  medium: { hi: 'सामान्य', en: 'Medium' },
  low: { hi: 'कम', en: 'Low' },
  kmAway: { hi: 'किमी दूर', en: 'km away' },
  viewTrend: { hi: '7 दिन का रुख देखें', en: 'View 7-day trend' },
  bestOption: { hi: 'सबसे अच्छा विकल्प', en: 'Best Option' },
  
  // Price trend
  last7Days: { hi: 'पिछले 7 दिनों का भाव', en: 'Last 7 days price' },
  lastUpdated: { hi: 'आखिरी अपडेट', en: 'Last updated' },
  back: { hi: 'वापस', en: 'Back' },
  
  // Decision support
  todaySignal: { hi: 'आज का संकेत', en: "Today's Signal" },
  waitBeneficial: { hi: '1-2 दिन रुकना फायदेमंद हो सकता है', en: 'Waiting 1-2 days may be beneficial' },
  sellNow: { hi: 'आज बेचना सही हो सकता है', en: 'Selling today may be a good idea' },
  pricesRising: { hi: 'पिछले दिनों में भाव बढ़े हैं', en: 'Prices have been rising recently' },
  pricesFalling: { hi: 'भाव गिरने की संभावना है', en: 'Prices may fall further' },
  disclaimer: { hi: 'यह सिर्फ जानकारी है, अंतिम फैसला आपका है', en: 'This is just information, the final decision is yours' },
  
  // Settings
  settings: { hi: 'सेटिंग्स', en: 'Settings' },
  priceAlerts: { hi: 'भाव अलर्ट', en: 'Price Alerts' },
  alertDescription: { hi: 'भाव बदलने पर अलर्ट पाएं', en: 'Get alerts when prices change' },
  alertThreshold: { hi: 'कितना बदलाव हो तो बताएं?', en: 'Notify when price changes by' },
  language: { hi: 'भाषा', en: 'Language' },
  dataSource: { hi: 'डेटा स्रोत', en: 'Data Source' },
  govtRecords: { hi: 'सरकारी मंडी रिकॉर्ड', en: 'Government Mandi Records' },
  
  // Navigation
  home: { hi: 'होम', en: 'Home' },
  markets: { hi: 'मंडी', en: 'Markets' },
  alerts: { hi: 'अलर्ट', en: 'Alerts' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('hi');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
