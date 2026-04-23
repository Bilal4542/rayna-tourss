import React, { createContext, useContext, useState, useEffect } from "react";

// ── Exchange rates relative to AED (base currency stored in DB) ────────────
export const EXCHANGE_RATES = {
  AED: 1,
  INR: 22.7,
  USD: 0.272,
  EUR: 0.25,
  GBP: 0.214,
  JPY: 40.8,
  AUD: 0.417,
  SGD: 0.365,
  HKD: 2.13,
  SAR: 1.02,
  OMR: 0.105,
  KZT: 122,
  MYR: 1.28,
  THB: 9.67,
  IDR: 4261,
  AMD: 108.9,
  GEL: 0.727,
  MOP: 2.19,
  ZAR: 5.07,
  TRY: 8.85,
  VND: 6675,
  UZS: 3484,
  DKK: 1.88,
  MUR: 12.4,
};

export const CURRENCY_SYMBOLS = {
  AED: "AED",
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  SGD: "S$",
  HKD: "HK$",
  SAR: "SAR",
  OMR: "OMR",
  KZT: "₸",
  MYR: "RM",
  THB: "฿",
  IDR: "Rp",
  AMD: "֏",
  GEL: "₾",
  MOP: "MOP",
  ZAR: "R",
  TRY: "₺",
  VND: "₫",
  UZS: "so'm",
  DKK: "kr",
  MUR: "₨",
};

const LanguageCurrencyContext = createContext(null);

export const LanguageCurrencyProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("rc_lang") || "English"
  );
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("rc_currency") || "AED"
  );

  // Apply language direction to document and trigger translation
  useEffect(() => {
    const langCode = language === "Arabic" ? "ar" : "en";
    
    // Always keep LTR layout even if Arabic is selected
    document.documentElement.dir = "ltr";
    document.documentElement.lang = langCode;
    
    const prevLang = localStorage.getItem("rc_lang");
    localStorage.setItem("rc_lang", language);

    // Set Google Translate cookie to handle the translation (e.g. /en/ar)
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/`;
    
    // If the language actually changed from previous, reload to apply Google translation
    if (prevLang && prevLang !== language) {
      window.location.reload();
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem("rc_currency", currency);
  }, [currency]);

  // Convert a price from AED to selected currency
  const convertPrice = (priceInAED) => {
    const rate = EXCHANGE_RATES[currency] ?? 1;
    return priceInAED * rate;
  };

  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

  return (
    <LanguageCurrencyContext.Provider
      value={{ language, setLanguage, currency, setCurrency, convertPrice, currencySymbol }}
    >
      {children}
    </LanguageCurrencyContext.Provider>
  );
};

export const useLanguageCurrency = () => {
  const ctx = useContext(LanguageCurrencyContext);
  if (!ctx) throw new Error("useLanguageCurrency must be used within LanguageCurrencyProvider");
  return ctx;
};
