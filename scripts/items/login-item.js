export function updateLoginDiv(loginService)
{	
	const container = window.document.getElementsByClassName("account-div")[0];
	if (!container) { console.log("No account div found"); return; }

	const usernameP = container.querySelector("#username-p");
	if (!usernameP) { console.log("No username paragraph found"); return; }
	const emailP = container.querySelector("#email-p");
	if (!emailP) { console.log("No email paragraph found"); return; }
	const loginButton = container.querySelector("#login-button");
	if (!loginButton) { console.log("No login button found"); return; }
	const logoutButton = container.querySelector("#logout-button");
	if (!logoutButton) { console.log("No logout button found"); return; }
	
  	if (loginService.isLoggedIn())
	{
    	const user = loginService.getCurrentUser();
    	usernameP.textContent = `Username: ${user.username}`;
    	emailP.textContent = `Email: ${user.email || "N/A"}`;

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