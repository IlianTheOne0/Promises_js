export function setupAccountButton(loginService)
{
  	setupLoginEvents();
  	setupLogoutEvents(loginService);
  	setupFormEvents(loginService);
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

async function setupFormEvents(loginService)
{
	if (!window.location.href.includes("login.html")) { return; }
	
	document.getElementById("login-form").addEventListener
	(
		"submit",
		async (e) =>
		{
			e.preventDefault();

			const formData = new FormData(e.target);

			const login = formData.get("login_login-input").trim();
			const password = formData.get("login_password-input").trim();

			if (!login || !password) { alert("Please fill in all fields."); return; }

			try { await loginService.login(login, password); window.location.href = "list.html"; e.target.reset(); }
			catch (e) { console.error("Login failed:", e); alert("Login error: " + e); }
		}
	);

	document.getElementById("register-form").addEventListener
	(
		"submit",
		async (e) =>
		{
			e.preventDefault();

			const formData = new FormData(e.target);
			console.log(e.target);
			console.log(formData);

			const login = formData.get("register_login-input").trim();
			const email = formData.get("register_email-input").trim();
			const password = formData.get("register_password-input").trim();
			const repeatPassword = formData.get("register_repeat_password-input").trim();

			if (!login || !email || !password || !repeatPassword) { alert("Please fill in all fields."); return; }
			if (password !== repeatPassword) { alert("Passwords do not match."); return; }

			try { await loginService.register(login, email, password); alert("Registration successful! You can now log in"); e.target.reset(); }
			catch (e) { console.error("Registration failed:", e); alert("Registration error: " + e); }
		}
	);
}

function setupLogoutEvents(loginService)
{
  	const btn = window.document.getElementById("logout-button");
  	if (!btn) { return; }
  
	btn.addEventListener
	(
		"click",
		async (e) =>
		{
	    	e.preventDefault();
	    	try { await loginService.logout(); window.location.href = "index.html"; }
			catch (e) { console.error("Logout failed:", e); alert("Logout error: " + e); }
		}
	);
}