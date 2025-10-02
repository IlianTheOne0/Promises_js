import { LanguageFactory } from "../factories/languageFactory.js";

export class ILanguageService
{
	subscribe(observer) { throw new Error("Method 'subscribe()' is not implemented"); }

	initializeLanguage() { throw new Error("Method 'initializeLanguage()' is not implemented"); }
	getCurrentLanguage() { throw new Error("Method 'getCurrentLanguage()' is not implemented"); }
	setLanguage(language) { throw new Error("Method 'setLanguage()' is not implemented"); }

	async translate(valueName) { throw new Error("Method 'translate()' is not implemented"); }
}

export class LanguageService extends ILanguageService
{
	#observers = [];
	#currentLanguage = null;

	constructor()
	{
		if (LanguageService._instance) { return LanguageService._instance; }
		super();
		this.#currentLanguage = localStorage.getItem("language") || "en";
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
	getCurrentLanguageObject() { return LanguageFactory.create(this.#currentLanguage); }
	async setLanguage(language)
	{
		const languageObject = await LanguageFactory.create(language);
		localStorage.setItem("language", language);
		document.documentElement.lang = languageObject.code;
		this.#currentLanguage = languageObject.code;

		this.#notifyObservers(languageObject);
	}

	async translate(valueName)
	{
		try
		{
			const languageCode = this.getCurrentLanguage() ?? "en";

			const response = await fetch(`data/languages/${languageCode}.json`);
			if (!response.ok) { throw new Error(`Language ${languageCode} not found`); }

			const data = await response.json();

			const values = valueName.split(".");
			let result = data;
			for (const key of values)
			{
	  			if (result && key in result) { result = result[key];}
				else { result = undefined; break; }
			}
			
			return result ?? valueName;
		}
		catch (error) { console.error("Error fetching language data:", error); return valueName; }
	}
}