export function setupLanguageButton(languageManager)
{
  	document.getElementById("language-button")?.addEventListener
	(
		"click",
		async () =>
		{
    		const response = await fetch("data/languages/all.json");
    		const languages = (await response.json()).available;

    		const current = languageManager.getCurrentLanguage();
    		const index = languages.findIndex(language => language.code === current);
    		const nextLang = languages[(index + 1) % languages.length].code;

    		await languageManager.setLanguage(nextLang);
		}
	);
}