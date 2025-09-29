class INavigationService
{
  	isOn(pageFragment) { throw new Error("Method 'isOn()' is not implemented"); }
  	redirectTo(path) { throw new Error("Method 'redirectTo()' is not implemented"); }
  	isProtectedPage(currentPage) { throw new Error("Method 'isProtectedPage()' is not implemented"); }
}

export class NavigationService extends INavigationService
{
	constructor()
	{
		if (NavigationService._instance) { return NavigationService._instance; }
		super();
		NavigationService._instance = this;
	}

	isOn(pageFragment) { return window.location.href.includes(pageFragment); }
  	redirectTo(path) { window.location.href = path; }
	isProtectedPage() { const protectedPages = ["add.html", "list.html", "remove.html"]; return protectedPages.some(page => this.isOn(page)); }
}