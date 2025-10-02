import { NavigationService } from "../services/navigationService.js";
import { AccountService } from "../services/accountService.js";

export function setupLocationEvents()
{
	const navigationService = new NavigationService();
	const accountService = new AccountService();

  	window.addEventListener
	(
		"load",
		() =>
		{
			if (navigationService.isOn("login.html"))
			{
				if (accountService.isLoggedIn()) { navigationService.redirectTo("list.html"); return; } return;
			}

			if (navigationService.isProtectedPage() && !accountService.isLoggedIn()) { navigationService.redirectTo("login.html"); return; }
		}
  	);
}