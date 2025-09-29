import { LoginService } from "./loginService.js";

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

	#updateAccountDiv(loginService)
	{	
		const container = window.document.getElementsByClassName("account-div")[0];

		const usernameP = container.querySelector("#username-p");
		const emailP = container.querySelector("#email-p");
		const loginButton = container.querySelector("#login-button");
		const logoutButton = container.querySelector("#logout-button");
		
		if (loginService.isLoggedIn())
		{
			const user = loginService.getCurrentUser();
			usernameP.textContent = user.username;
			emailP.textContent = user.email || "N/A";

			usernameP.classList.remove("hidden");
			emailP.classList.remove("hidden");
			logoutButton.classList.remove("hidden");
			loginButton?.classList?.add("hidden");
		}
		else
		{
			usernameP.classList.add("hidden");
			emailP.classList.add("hidden");
			logoutButton.classList.add("hidden");
			loginButton?.classList?.remove("hidden");
		}
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

		this.#updateAccountDiv(new LoginService());
	}

	#updateMain(data)
	{
		if (window.location.href.includes("login.html"))
		{
			document.getElementById("login-form").querySelector("h1").textContent = data.main.login.login_h1;
			document.getElementById("register-form").querySelector("h1").textContent = data.main.login.register_h1;

			document.getElementsByName("login_login-input")[0].previousSibling.textContent = data.main.login.login;
			document.getElementsByName("login_password-input")[0].previousSibling.textContent = data.main.login.password;

			document.getElementsByName("register_login-input")[0].previousSibling.textContent = data.main.login.login;
			document.getElementsByName("register_email-input")[0].previousSibling.textContent = data.main.login.email;
			document.getElementsByName("register_password-input")[0].previousSibling.textContent = data.main.login.password;
			document.getElementsByName("register_repeat_password-input")[0].previousSibling.textContent = data.main.login.repeat_password;

			document.querySelector("#login-form button").textContent = data.main.login.submit_button;
			document.querySelector("#register-form button").textContent = data.main.login.submit_button;
		}
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
		this.#updateMain(data);
	}
}