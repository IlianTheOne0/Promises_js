export function setupAccountButton(loginService)
{
  	setupLoginEvents();
  	setupLogoutEvents(loginService);
}

function setupLoginEvents()
{
  	const btn = window.document.getElementById("login-button");
  	if (!btn) { return; }

  	btn.addEventListener
	(
		"click",
		async (e) => { window.location.href = "pages/login.html"; }
	);
}

function setupLogoutEvents(loginManager)
{
  	const btn = window.document.getElementById("logout-button");
  	if (!btn) { return; }
  
	btn.addEventListener
	(
		"click",
		async (e) =>
		{
	    	e.preventDefault();
	    	try { await loginService.logout(); }
			catch (err) { console.error("Logout failed:", err); alert("Logout error"); }
		}
	);
}