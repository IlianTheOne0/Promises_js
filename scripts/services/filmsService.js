import { LanguageService } from "./languageService.js";

class IFilmsService
{
	addFilm(film) { throw new Error("Method 'addFilm()' is not implemented"); }
	removeFilm(filmId) { throw new Error("Method 'removeFilm()' is not implemented"); }
	updateFilm(film) { throw new Error("Method 'updateFilm()' is not implemented"); }

	getAllFilms() { throw new Error("Method 'getAllFilms()' is not implemented"); }
	getFilmById(filmId) { throw new Error("Method 'getFilmById()' is not implemented"); }
}

export class FilmsService extends IFilmsService
{
	#storage;

	constructor()
	{
		if (FilmsService._instance) { return FilmsService._instance; }
		super();
		FilmsService._instance = this;

		this.#storage = window.localStorage;
	}

	#getStorage() { return JSON.parse(this.#storage.getItem("films")) || {}; }
	#setStorage(data) { this.#storage.setItem("films", JSON.stringify(data)); }

	addFilm(userId, film)
	{
		if (!userId || !film || !film.title || !film.director || !film.genre || !film.year) { throw new Error(new LanguageService().translate("errors.empty_field")); }

		const filmsByUser = this.#getStorage();
		const userFilms = filmsByUser[userId] || [];

		const newFilm =
		{
			id: userFilms.length > 0 ? userFilms[userFilms.length - 1].id + 1 : 0,
			title: film.title,
			director: film.director,
			genre: film.genre,
			year: film.year,
			poster: film.poster || null,
		};

		userFilms.push(newFilm);
		filmsByUser[userId] = userFilms;
		this.#setStorage(filmsByUser);
	}

	removeFilm(userId, filmId)
	{
		const filmsByUser = this.#getStorage();
		if (!filmsByUser[userId]) { return; }

		filmsByUser[userId] = filmsByUser[userId].filter(film => film.id !== filmId);
		this.#setStorage(filmsByUser);
	}

	updateFilm(userId, film)
	{
		const filmsByUser = this.#getStorage();
		if (!filmsByUser[userId]) { return; }

		const index = filmsByUser[userId].findIndex(film => film.id === film.id);
		if (index !== -1) { filmsByUser[userId][index] = film; this.#setStorage(filmsByUser); }
	}

	getAllFilmsByUserId(userId)
	{
		const filmsByUser = this.#getStorage();
		return filmsByUser[userId] ?? [];
	}

	getFilmByUserIdAndFilmId(userId, filmId)
	{
		const films = this.getAllFilmsByUserId(userId);
		return films.find(film => film.id === filmId);
	}
}