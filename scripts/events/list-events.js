import { FilmsService } from "../services/filmsService.js";
import { AccountService } from "../services/accountService.js";
import { DisplayService } from "../services/displayService.js";
import { LanguageService } from "../services/languageService.js";

export async function setupListEvents()
{
	setupButtons();
	await setupGenreSelect();
	await setupOrderSelect();
}

function setupButtons()
{
	const searchForm = document.getElementById("search-form");
	if (!searchForm) { return; }

	searchForm.addEventListener
	(
		"submit",
		async event => { event.preventDefault(); await processSearch(event.target); }
	);

	searchForm.addEventListener
	(
		"reset",
		event => { event.preventDefault(); processReset(); }
	);

	searchForm.querySelector("#title-input")?.addEventListener
	(
		"input",
		() => changeButtonsState()
	);

	document.querySelector("main .cards-div")?.addEventListener
	(
		"click",
		async event =>
		{
			const target = event.target;
			if (!(target instanceof HTMLElement)) { return; }
			if (!target.classList.contains("card-delete-button")) { return; }

			const filmId = parseInt(target.getAttribute("data-film-id"));
			if (isNaN(filmId)) { return; }

			const userId = new AccountService().getCurrentUser().id;
			new FilmsService().removeFilm(userId, filmId);

			const displayService = new DisplayService();
			displayService.films = new FilmsService().getAllFilmsByUserId(userId);
			displayService.updateFilms();

			await setupGenreSelect();
			await setupOrderSelect();
		}
	);
}

async function setupGenreSelect()
{
	const genreSelect = document.getElementById("sort_genre-select");
	if (!genreSelect) { return; }

	const films = new FilmsService().getAllFilmsByUserId(new AccountService().getCurrentUser().id);
	const genres = [];
	films.forEach(film => { if (!genres.includes(film.genre)) { genres.push(film.genre); } });
	genres.sort();

	const languageService = new LanguageService();
	genreSelect.innerHTML = `<option value="">${await languageService.translate("main.search.genre_select")}</option>`;
	genres.forEach(genre => genreSelect.innerHTML += `<option value="${genre}">${genre}</option>`);

	if (setupGenreSelect.initialized) { return; }
	genreSelect.addEventListener("change", () => changeButtonsState());
}

async function setupOrderSelect()
{
	const orderSelect = document.getElementById("sort_order-select");
	if (!orderSelect) { return; }

	const languageService = new LanguageService();
	orderSelect.innerHTML = `<option value="">${await languageService.translate("main.search.order_select")}</option>`;
	orderSelect.innerHTML += `<option value="false">${await languageService.translate("main.search.order_select_descending")}</option>`;
	orderSelect.innerHTML += `<option value="true">${await languageService.translate("main.search.order_select_ascending")}</option>`;

	if (setupOrderSelect.initialized) { return; }
	orderSelect.addEventListener("change", () => changeButtonsState());
}

async function processSearch(target)
{
	const formData = new FormData(target);
	if (!formData) { return; }

	const input = formData.get("title")?.toString().toLowerCase() ?? "";
	const genre = formData.get("genre")?.toString().toLowerCase() ?? "";
	const order = formData.get("order")?.toString() ?? "";

	const filmsService = new FilmsService();
	const displayService = new DisplayService();

	let films = filmsService.getAllFilmsByUserId(new AccountService().getCurrentUser().id) || [];
	
	if (input.length > 0) { films = films.filter(film => film.title.toLowerCase().includes(input)); }
	if (genre.length > 0) { films = films.filter(film => film.genre.toLowerCase() === genre); }

	if (order.valueOf() === "true") { films.sort((a, b) => a.year - b.year); }
	else if (order.valueOf() === "false") { films.sort((a, b) => b.year - a.year); }

	displayService.films = films;
	await displayService.updateFilms();
}

async function processReset()
{
	const titleInput = document.getElementById("title-input");
	if (!titleInput) { return; }

	const genreSelect = document.getElementById("sort_genre-select");
	if (!genreSelect) { return; }

	const orderSelect = document.getElementById("sort_order-select");
	if (!orderSelect) { return; }

	titleInput.value = "";
	genreSelect.selectedIndex = 0;
	orderSelect.selectedIndex = 0;

	changeButtonsState();

	const displayService = new DisplayService();
	displayService.films = new FilmsService().getAllFilmsByUserId(new AccountService().getCurrentUser().id);
	
	await displayService.updateFilms();
}

function changeButtonsState()
{
	const searchForm = document.getElementById("search-form");
	if (!searchForm) { return; }

	const titleInput = document.getElementById("title-input");
	if (!titleInput) { return; }

	const genreSelect = document.getElementById("sort_genre-select");
	if (!genreSelect) { return; }

	const orderSelect = document.getElementById("sort_order-select");
	if (!orderSelect) { return; }

	const submitButton = searchForm.querySelector("button[type='submit']");
	if (!submitButton) { return; }

	const resetButton = searchForm.querySelector("button[type='reset']");
	if (!resetButton) { return; }

	if (titleInput.value.length === 0 && genreSelect.selectedIndex === 0 && orderSelect.selectedIndex === 0)
	{
		submitButton.disabled = true;
		resetButton.disabled = true;
	}
	else
	{
		submitButton.disabled = false;
		resetButton.disabled = false;
	}
}