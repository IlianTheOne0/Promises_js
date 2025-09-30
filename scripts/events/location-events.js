import { NavigationService } from "../services/navigationService.js";
import { LoginService } from "../services/loginService.js";

export function setupLocationEvents()
{
	const navigationService = new NavigationService();
	const loginService = new LoginService();

  	window.addEventListener
	(
		"load", () =>
		{
			if (navigationService.isOn("login.html"))
			{
				if (loginService.isLoggedIn()) { navigationService.redirectTo("list.html"); return; } return;
			}

			if (navigationService.isProtectedPage() && !loginService.isLoggedIn()) { navigationService.redirectTo("login.html"); return; }
		}
  	);
}