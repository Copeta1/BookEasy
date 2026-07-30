"use client";

import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const { i18n } = useTranslation();

  const setLang = (lng: "hr" | "en") => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <div className={`flex bg-stone-100 rounded-full p-0.5 text-xs font-semibold ${className}`}>
      <button
        onClick={() => setLang("hr")}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          i18n.language === "hr"
            ? "bg-white text-moss-700 shadow-sm"
            : "text-stone-500 hover:text-stone-700"
        }`}
      >
        HR
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          i18n.language === "en"
            ? "bg-white text-moss-700 shadow-sm"
            : "text-stone-500 hover:text-stone-700"
        }`}
      >
        EN
      </button>
    </div>
  );
}
