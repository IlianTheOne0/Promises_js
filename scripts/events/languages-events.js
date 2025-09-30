import { LanguageService } from "../services/languageService.js";

export function setupLanguageButton()
{
	const languageService = new LanguageService();

  	document.getElementById("language-button")?.addEventListener
	(
		"click",
		async () =>
		{
    		const response = await fetch("data/languages/all.json");
    		const languages = (await response.json()).available;

    		const current = languageService.getCurrentLanguage();
    		const index = languages.findIndex(language => language.code === current);
    		const nextLang = languages[(index + 1) % languages.length].code;

    		await languageService.setLanguage(nextLang);
		}
	);
}