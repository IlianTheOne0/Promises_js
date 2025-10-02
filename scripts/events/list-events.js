import { FilmsService } from "../services/filmsService.js";
import { AccountService } from "../services/accountService.js";
import { DisplayService } from "../services/displayService.js";
import { LanguageService } from "../services/languageService.js";

export async function setupListEvents()
{
	setupButtons();
	await setupGenreSelect();
	await setupYearSelect();
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
			await setupYearSelect();
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

async function setupYearSelect()
{
	const yearSelect = document.getElementById("sort_year-select");
	if (!yearSelect) { return; }

	const films = new FilmsService().getAllFilmsByUserId(new AccountService().getCurrentUser().id);
	const years = [];
	films.forEach(film => { if (!years.includes(film.year)) { years.push(film.year); } });
	years.sort();

	const languageService = new LanguageService();
	yearSelect.innerHTML = `<option value="">${await languageService.translate("main.search.year_select")}</option>`;
	years.forEach(year => yearSelect.innerHTML += `<option value="${year}">${year}</option>`);

	if (setupYearSelect.initialized) { return; }
	yearSelect.addEventListener("change", () => changeButtonsState());
}

async function processSearch(target)
{
	const formData = new FormData(target);
	if (!formData) { return; }

	const input = formData.get("title")?.toString().toLowerCase() ?? "";
	const genre = formData.get("genre")?.toString().toLowerCase() ?? "";
	const year = formData.get("year")?.toString() ?? "";

	const filmsService = new FilmsService();
	const displayService = new DisplayService();

	let films = filmsService.getAllFilmsByUserId(new AccountService().getCurrentUser().id) || [];
	
	if (input.length > 0) { films = films.filter(film => film.title.toLowerCase().includes(input)); }
	if (genre.length > 0) { films = films.filter(film => film.genre.toLowerCase() === genre); }
	if (year.length > 0) { films = films.filter(film => film.year.toString() === year); }
	
	displayService.films = films;
	await displayService.updateFilms();
}

async function processReset()
{
	const titleInput = document.getElementById("title-input");
	if (!titleInput) { return; }

	const genreSelect = document.getElementById("sort_genre-select");
	if (!genreSelect) { return; }

	const yearSelect = document.getElementById("sort_year-select");
	if (!yearSelect) { return; }

	titleInput.value = "";
	genreSelect.selectedIndex = 0;
	yearSelect.selectedIndex = 0;
	
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

	const yearSelect = document.getElementById("sort_year-select");
	if (!yearSelect) { return; }
	
	const submitButton = searchForm.querySelector("button[type='submit']");
	if (!submitButton) { return; }

	const resetButton = searchForm.querySelector("button[type='reset']");
	if (!resetButton) { return; }

	if (titleInput.value.length === 0 && genreSelect.selectedIndex === 0 && yearSelect.selectedIndex === 0)
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