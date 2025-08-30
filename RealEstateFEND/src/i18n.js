import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n.use(HttpBackend) // JSON dosyalarından çeviri yükler
	.use(LanguageDetector) // Tarayıcı dilini otomatik algılar
	.use(initReactI18next) // React'e bağlar
	.init({
		lng: "tr", // başlangıç dili
		fallbackLng: "tr", // fallback dili de Türkçe olsun
		debug: true,

		ns: ["sidebar", "navbar", "auth", "validation", "common"],
		defaultNS: "common",

		interpolation: {
			escapeValue: false, // React zaten otomatik olarak escape eder
		},

		backend: {
			loadPath: "/locales/{{lng}}/{{ns}}.json",
		},
	});

export default i18n;
