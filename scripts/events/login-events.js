import { AccountService } from "../services/accountService.js";

import { alert } from "../utils/alerts.js";

export function setupAccountButton()
{
  	setupLoginEvents();
  	setupLogoutEvents();
  	setupFormEvents();
}

function setupLoginEvents()
{
  	const btn = window.document.getElementById("login-button");
  	if (!btn) { return; }

  	btn.addEventListener
	(
		"click",
		async (e) => { window.location.href = "login.html"; }
	);
}

async function setupFormEvents()
{
	if (!window.location.href.includes("login.html")) { return; }

	const accountService = new AccountService();

	document.getElementById("login-form").addEventListener
	(
		"submit",
		async (e) =>
		{
			e.preventDefault();

			const formData = new FormData(e.target);

			const login = formData.get("login_login-input").trim();
			const password = formData.get("login_password-input").trim();

			if (!login || !password) { alert("errors.empty_field"); return; }

			try { await accountService.login(login, password); window.location.href = "list.html"; e.target.reset(); }
			catch (error) { window.alert(error.message); }
		}
	);

	document.getElementById("register-form").addEventListener
	(
		"submit",
		async (e) =>
		{
			e.preventDefault();

			const formData = new FormData(e.target);

			const login = formData.get("register_login-input").trim();
			const email = formData.get("register_email-input").trim();
			const password = formData.get("register_password-input").trim();
			const repeatPassword = formData.get("register_repeat_password-input").trim();

			if (!login || !email || !password || !repeatPassword) { alert("errors.empty_field"); return; }
			if (password !== repeatPassword) { alert("errors.password_repeat_incorrect"); return; }

			try { await accountService.register(login, email, password); alert("errors.registration_success"); e.target.reset(); }
			catch (error) { alert(error); }
		}
	);
}

function setupLogoutEvents()
{
	const accountService = new AccountService();

  	const btn = window.document.getElementById("logout-button");
  	if (!btn) { return; }
  
	btn.addEventListener
	(
		"click",
		async (e) =>
		{
	    	e.preventDefault();
	    	try { await accountService.logout(); window.location.href = "index.html"; }
			catch (error) { alert("Logout error: " + error); }
		}
	);
}