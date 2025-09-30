class IFilmsService
{
	addFilm(film) { throw new Error("Method 'addFilm()' is not implemented"); }
	removeFilm(filmId) { throw new Error("Method 'removeFilm()' is not implemented"); }
	
	updateFilm(film) { throw new Error("Method 'updateFilm()' is not implemented"); }
	
	getAllFilms() { throw new Error("Method 'getAllFilms()' is not implemented"); }
	getFilmById(filmId) { throw new Error("Method 'getFilmById()' is not implemented"); }
};

export class FilmsService extends IFilmsService
{
	constructor()
	{
		if (FilmsService._instance) { return FilmsService._instance; }
		super();
		FilmsService._instance = this;
	}

	async addFilm(film)
	{
		fetch
		(
			"../data/movies.json",
			{
				method: "POST",
				body: JSON.stringify(film),
				headers: { "Content-Type": "application/json" }
			}
		)
		.then(response => response.json())
		.then(data => console.log('Success:', data))
		.catch(error => console.error('Error:', error));
	}
	async removeFilm(filmId)
	{
		fetch("../data/movies.json/" + filmId, { method: "DELETE" })
		.then(response => response.json())
		.then(data => console.log('Success:', data))
		.catch(error => console.error('Error:', error));
	}

	async updateFilm(film)
	{
		fetch
		(
			"../data/movies.json/" + film.id,
			{
				method: "PUT",
				body: JSON.stringify(film),
				headers: { "Content-Type": "application/json" }
			}
		)
		.then(response => response.json())
		.then(data => console.log('Success:', data))
		.catch(error => console.error('Error:', error));
	}

	async getAllFilmsByUserId(userId)
	{
		const response = await fetch(`../data/movies.json?userId=${userId}`);
		const data = await response.json();

		const films = data[userId] ?? [];
		return films;
	}
	async getFilmByUserIdAndFilmId(userId, filmId)
	{
		const response = await fetch(`../data/movies.json/${filmId}?userId=${userId}`);
		const film = await response.json();
		return film;
	}
}