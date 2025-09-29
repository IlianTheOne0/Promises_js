export function setupLocationEvents(loginService, navigationService)
{
  	window.addEventListener
	(
		"load", () =>
		{
			console.log(navigationService.isProtectedPage());
			if (navigationService.isOn("login.html"))
			{
				if (loginService.isLoggedIn()) { navigationService.redirectTo("list.html"); return; } return;
			}

			if (navigationService.isProtectedPage() && !loginService.isLoggedIn()) { navigationService.redirectTo("login.html"); return; }
		}
  	);
}