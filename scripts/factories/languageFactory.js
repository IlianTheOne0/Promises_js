export class LanguageFactory
{
	static async create(languageCode)
	{
    	try
		{
	      	const response = await fetch(`data/languages/${languageCode}.json`);
      		if (!response.ok) throw new Error(`Language ${languageCode} not found`);
      		const data = await response.json();
      		return new Language(languageCode, data);
    	}
		catch (e) { console.error("Language load error:", e); return null; }
  	}
}

export class Language
{
	constructor(code, data) { this.code = code; this.data = data; }
}