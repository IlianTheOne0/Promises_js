import { FilmsService } from "../services/filmsService.js";
import { AccountService } from "../services/accountService.js";

import { alert } from "../utils/alerts.js";

export function setupAddEvents()
{
	if (!window.location.href.includes("add.html")) { return; }
	
	const filmsService = new FilmsService();
	const accountService = new AccountService();

	document.getElementById("addFilm-form").addEventListener
	(
		"submit",
		async (e) =>
		{
			e.preventDefault();

			const formData = new FormData(e.target);

			const title = formData.get("addFilm_title-input").trim();
			const director = formData.get("addFilm_director-input").trim();
			const genre = formData.get("addFilm_genre-input").trim();
			const year = formData.get("addFilm_year-input").trim();
			const poster = formData.get("addFilm_poster-input").trim();

			if (!title || !director || !genre || !year) { alert("errors.empty_field"); return; }
			if (isNaN(Number(year)) || Number(year) < 1800 || Number(year) > new Date().getFullYear()) { alert("errors.invalid_year"); return; }
			if (poster && !/^https?:\/\/.+\..+/.test(poster)) { alert("errors.invalid_poster_url"); return; }

			try { await filmsService.addFilm(accountService.getCurrentUser().id, { title, director, genre, year, poster }); window.location.href = "list.html"; e.target.reset(); }
			catch (error) { window.alert(error.message); }
		}
	);
}