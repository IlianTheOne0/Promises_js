import { LanguageService } from "./languageService.js";

export class ILoginService
{
  	async login(username, password) { throw new Error("login() not implemented"); }
	async register(username, email, password) { throw new Error("register() not implemented"); }
  	async logout() { throw new Error("logout() not implemented"); }
	
  	isLoggedIn() { throw new Error("isLoggedIn() not implemented"); }
  	getCurrentUser() { throw new Error("getCurrentUser() not implemented"); }
}

export class LoginService extends ILoginService
{
  	#currentUser = null;
  	#storage;

  	constructor()
	{
		if (LoginService.instance) { return LoginService.instance; }
		super();
		LoginService.instance = this;

    	this.#storage = window.localStorage;
    	const user = this.#storage.getItem("currentUser");
    	if (user)
		{
      		try { this.#currentUser = JSON.parse(user); }
			catch (error) { this.#currentUser = null; }
		}
    }

  	async login(username, password)
	{
	    if (!username || !password) { return Promise.reject(await new Error(new LanguageService().translate("errors.provide_credentials"))); }

    	return new Promise
		(
			async (resolve, reject) =>
			{
      			const users = JSON.parse(this.#storage.getItem("users") || "[]");
				const user = users.find(user => user.username === username && user.password === password);
				
				if (user)
				{
					this.#currentUser = { id: user.id, username: user.username, email: user.email || null };
					
					this.#storage.setItem("currentUser", JSON.stringify(this.#currentUser));

					resolve(this.#currentUser);
				}
				else { reject(new Error(await new LanguageService().translate("errors.invalid_credentials"))); }
    		}
		);
  	}
	async register(username, email, password)
	{
		if (!username || !email || !password) { return Promise.reject(new Error(await new LanguageService().translate("errors.provide_credentials"))); }

		return new Promise
		(
			async (resolve, reject) =>
			{
				const users = JSON.parse(this.#storage.getItem("users") || "[]");
				if (users.find(user => user.username === username)) { reject("errors.username_exists"); return; }
				if (users.find(user => user.email === email)) { reject("errors.email_exists"); return; }

				const newUser = { id: crypto.randomUUID(), username, email, password };
				users.push(newUser);
				
				this.#storage.setItem("users", JSON.stringify(users));
				resolve(newUser);
			}
		);
	}
  	async logout() { this.#currentUser = null; this.#storage.removeItem("currentUser"); return Promise.resolve(); }
	
	isLoggedIn() { return !!this.getCurrentUser(); }
  	getCurrentUser()
	{
		if (!this.#currentUser) { const user = this.#storage.getItem("currentUser"); this.#currentUser = user ? JSON.parse(user) : null; }
    	return this.#currentUser;
	}
}