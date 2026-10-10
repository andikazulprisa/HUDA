import { useEffect, useState } from "react";

const STORAGE_KEY = "huda-quran-reading-settings";

const DEFAULT_SETTINGS = {
  arabFontSize: 36,
  translationFontSize: 16,
  showTransliteration: true,
  showTranslation: true,
  verseSpacing: "normal",
};

function getInitialSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
      };
    }
  } catch (error) {
    console.error("Gagal membaca pengaturan Al-Quran:", error);
  }

  return DEFAULT_SETTINGS;
}

export default function useQuranReadingSettings() {
  const [settings, setSettings] = useState(getInitialSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Gagal menyimpan pengaturan Al-Quran:", error);
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return { settings, updateSetting };
}
