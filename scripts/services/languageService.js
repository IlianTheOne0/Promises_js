import { LanguageFactory } from "../factories/languageFactory.js";

export class ILanguageService
{
	subscribe(observer) { throw new Error("Method 'subscribe()' is not implemented"); }

	initializeLanguage() { throw new Error("Method 'initializeLanguage()' is not implemented"); }
	getCurrentLanguage() { throw new Error("Method 'getCurrentLanguage()' is not implemented"); }
	setLanguage(language) { throw new Error("Method 'setLanguage()' is not implemented"); }
}

export class LanguageService extends ILanguageService
{
	#observers = [];
	#currentLanguage = null;

	constructor()
	{
		if (LanguageService._instance) { return LanguageService._instance; }
		super();
		LanguageService._instance = this;
	}

	subscribe(observer) { this.#observers.push(observer); }
	#notifyObservers(obj) { this.#observers.forEach(observer => observer(obj)); }

	async initializeLanguage(defaultLang = "en")
	{
		const savedLang = localStorage.getItem("language") || defaultLang;
		await this.setLanguage(savedLang);
		this.#currentLanguage = savedLang;
	}
	getCurrentLanguage() { return this.#currentLanguage }
	async setLanguage(language)
	{
		const languageObject = await LanguageFactory.create(language);
		localStorage.setItem("language", language);
		document.documentElement.lang = language;
		this.#currentLanguage = language;

		this.#notifyObservers(languageObject);
	}
}