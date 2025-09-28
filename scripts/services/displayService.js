export class IDisplayService
{
	updateDisplayLanguage() { throw new Error("Method 'updateDisplay()' is not implemented"); }
}

export class DisplayService extends IDisplayService
{
	constructor(languageManager)
	{
		if (DisplayService._instance) { return DisplayService._instance; }
		super();
		DisplayService._instance = this;

		languageManager.subscribe(this.updateDisplayLanguage.bind(this));
	}

	async #updateHeader(data)
	{
		document.title = data.header.title;

		try
		{
			const response = await fetch("data/languages/all.json");
			const languages = (await response.json()).available;

			const index = languages.findIndex(language => language.code === data.code);
			const nextIndex = (index + 1) % languages.length;

			const current = languages[index].label;
			const next = languages[nextIndex].label;

			document.querySelector("#language-button span:first-child").textContent = current;
			document.querySelector("#language-button span:last-child").textContent = next;
		}
		catch (e) { console.error("Language button update failed:", e); }

		document.querySelector("body header nav a:nth-child(1)").textContent = data.header.links.add;
		document.querySelector("body header nav a:nth-child(2)").textContent = data.header.links.library;
		document.querySelector("body header nav a:nth-child(3)").textContent = data.header.links.remove;

		document.getElementById("login-button").innerHTML = data.header.buttons.log_in;
		document.getElementById("logout-button").innerHTML = data.header.buttons.log_out;
	}

	#updateFooter(data)
	{
		document.querySelector("body footer p").innerHTML = data.footer.p.rights;
	}

	async updateDisplayLanguage(object)
	{
		const data = object.data;
		if (!data) { return; }

		this.#updateHeader(data);
		this.#updateFooter(data);
	}
}