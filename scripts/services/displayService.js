import { AccountService } from "./accountService.js";
import { NavigationService } from "./navigationService.js";
import { FilmsService } from "./filmsService.js";
import { LanguageService } from "./languageService.js";

export class IDisplayService
{
	updateDisplay() { throw new Error("Method 'updateDisplay()' is not implemented"); }
	updateFilms() { throw new Error("Method 'updateFilms()' is not implemented"); }
}

export class DisplayService extends IDisplayService
{
	#films;

	constructor()
	{
		if (DisplayService._instance) { return DisplayService._instance; }
		super();
		if (location.href.includes("list.html") && new AccountService().isLoggedIn()) { this.#films = new FilmsService().getAllFilmsByUserId(new AccountService().getCurrentUser().id) || []; }
		DisplayService._instance = this;

		new LanguageService().subscribe(this.updateDisplay.bind(this));
	}

	set films(value) { this.#films = value; }

	#updateAccountDiv()
	{	
		const accountService = new AccountService();

		const container = window.document.getElementsByClassName("account-div")[0];

		const usernameP = container.querySelector("#username-p");
		const emailP = container.querySelector("#email-p");
		const loginButton = container.querySelector("#login-button");
		const logoutButton = container.querySelector("#logout-button");
		
		if (accountService.isLoggedIn())
		{
			const user = accountService.getCurrentUser();
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

		document.getElementById("login-button").innerHTML = data.header.buttons.log_in;
		document.getElementById("logout-button").innerHTML = data.header.buttons.log_out;

		this.#updateAccountDiv(new AccountService());
	}

	#updateMain(data)
	{
		switch (true)
		{
			case window.location.href.includes("index.html"):
			{
				document.querySelector("main h1").textContent = data.main.index.anon_user;
			} break;
			case window.location.href.includes("login.html"):
			{
				document.getElementById("login-form").querySelector("h1").textContent = data.main.login.login_h1;
				document.getElementById("register-form").querySelector("h1").textContent = data.main.login.register_h1;

				document.getElementsByName("login_login-input")[0].previousSibling.textContent = data.main.login.login;
				document.getElementsByName("login_password-input")[0].previousSibling.textContent = data.main.login.password;

				document.getElementsByName("register_login-input")[0].previousSibling.textContent = data.main.login.login;
				document.getElementsByName("register_email-input")[0].previousSibling.textContent = data.main.login.email;
				document.getElementsByName("register_password-input")[0].previousSibling.textContent = data.main.login.password;
				document.getElementsByName("register_repeat_password-input")[0].previousSibling.textContent = data.main.login.repeat_password;

				document.querySelector("#login-form button").textContent = data.main.form.submit_button;
				document.querySelector("#register-form button").textContent = data.main.form.submit_button;
			} break;
			case window.location.href.includes("add.html"):
			{
				const user = new AccountService().getCurrentUser();
				if (!user) { window.location.href = "login.html"; return; }

				document.querySelector("main form h1").textContent = data.main.add.title_h1;

				document.getElementsByName("addFilm_title-input")[0].previousSibling.textContent = data.main.add.title;
				document.getElementsByName("addFilm_director-input")[0].previousSibling.textContent = data.main.add.director;
				document.getElementsByName("addFilm_genre-input")[0].previousSibling.textContent = data.main.add.genre;
				document.getElementsByName("addFilm_year-input")[0].previousSibling.textContent = data.main.add.year;

				document.getElementsByName("addFilm_poster-input")[0].previousSibling.textContent = data.main.add.poster;

				document.querySelector("main form button").textContent = data.main.form.submit_button;
			} break;
			case window.location.href.includes("list.html"):
			{
				document.getElementById("title-input").placeholder = data.main.search.title_placeholder;

				document.getElementById("sort_genre-select").options[0].textContent = data.main.search.genre_select;
				document.getElementById("sort_year-select").options[0].textContent = data.main.search.year_select;
				
				document.getElementById("search-form").querySelector("button[type='submit']").textContent = data.main.search.search;
				document.getElementById("search-form").querySelector("button[type='reset']").textContent = data.main.search.reset_filter;
				
				this.updateFilms();
			} break;
		}
	}

	#updateFooter(data)
	{
		document.querySelector("body footer p").innerHTML = data.footer.p.rights;
	}

	async #addFilmToList(film)
	{
		const navigationService = new NavigationService();
		
		const main = document.querySelector("main .cards-div");

		if (!navigationService.isOn("list.html")) { return; }

		const filmElement = document.createElement("div");
		filmElement.classList.add("card");

		const img = new Image();
		img.src = film.poster;
		img.onerror = () => { filmElement.querySelector(".card-img").src = 'https://github.com/IlianTheOne0/Promises_js/blob/hm/task/assets/images/nothingToShow.png?raw=true'; }

		filmElement.innerHTML =
		`
			<img class="card-img" src="${film.poster}" alt="Poster: ${film.title}">
			<h2 class="card-title">${film.title}</h2>
			<h3 class="card-director">${film.director}</h3>
			<p class="card-genre">${film.genre}</p>
			<p class="card-year">${film.year}</p>
			<button class="card-delete-button" data-film-id="${film.id}">${await new LanguageService().translate("main.list.delete_button")}</button>
		`;

		main.appendChild(filmElement);
	}

	async updateDisplay(languageObject)
	{
		const data = languageObject.data;
		if (!data) { return; }

		this.#updateHeader(data);
		this.#updateMain(data);
		this.#updateFooter(data);
	}

	async updateFilms()
	{
		const data = await new LanguageService().getCurrentLanguageObject().then(lang => lang.data);
		if (!data) { return; }

		if (!window.location.href.includes("list.html")) { return; }
		
		const user = new AccountService().getCurrentUser();
		if (!user) { window.location.href = "login.html"; return; }

		document.querySelector("main .cards-div").innerHTML = "";

		if (this.#films.length === 0) { document.querySelector("main .cards-div").innerHTML = `<h1 style="color: white; position: absolute; top: calc(70% - 100px); left: 50%; transform: translate(-50%, -50%);">${data.main.list.no_films}</h1>`; return; }
		this.#films.forEach(film => this.#addFilmToList(film));
	}
}