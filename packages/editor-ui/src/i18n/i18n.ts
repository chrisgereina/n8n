import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messagesEn from './locales/en';
import messagesDe from './locales/de'; // TODO: Decide how to switch language
import axios from 'axios';

Vue.use(VueI18n);

export const i18n = new VueI18n({
	locale: 'en', // set locale
	fallbackLocale: 'en',
	messages: { ...messagesEn, ...messagesDe } , // set locale messages
	silentTranslationWarn: true,
});

const loadedLanguages = ['en']; // our default language that is preloaded

function setI18nLanguage (lang: string): string {
	i18n.locale = lang;
	axios.defaults.headers.common['Accept-Language'] = lang;
	document!.querySelector('html')!.setAttribute('lang', lang);
	return lang;
}

setI18nLanguage('de'); // TODO: Decide how to switch language

export function addNodeTranslations(translations: { [key: string]: string | object }) {
	const lang = Object.keys(translations)[0];
	const messages = translations[lang];
	const newNodesBase = {
		'n8n-nodes-base': Object.assign(
			i18n.messages[lang]['n8n-nodes-base'],
			messages,
		),
	};
	i18n.setLocaleMessage(lang, Object.assign(i18n.messages[lang], newNodesBase));
}

export function loadLanguageAsync(lang: string) {
	// If the same language
	if (i18n.locale === lang) {
		return Promise.resolve(setI18nLanguage(lang));
	}

	// If the language was already loaded
	if (loadedLanguages.includes(lang)) {
		return Promise.resolve(setI18nLanguage(lang));
	}

	// If the language hasn't been loaded yet
	return import(/* webpackChunkName: "locale-[request]" */ `./locales/${lang}`).then(
		messages => {
			i18n.setLocaleMessage(lang, messages.default);
			loadedLanguages.push(lang);
			return setI18nLanguage(lang);
		},
	);
}