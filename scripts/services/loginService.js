export class ILoginService
{
  	async login(username, password) { throw new Error("login() not implemented"); }
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
			catch (e) { this.#currentUser = null; }
		}
    }

  	async login(username, password)
	{
	    if (!username || !password) return Promise.reject(new Error("Provide username and password"));

    	return new Promise
		(
			(resolve, reject) =>
			{
      			const users = JSON.parse(this.#storage.getItem("users") || "[]");
				const user = users.find(u => u.username === username && u.password === password);
				
				if (user)
				{
					this.#currentUser = { username: user.username, email: user.email || null };
					this.#storage.setItem("currentUser", JSON.stringify(this.#currentUser));
					resolve(this.#currentUser);
				}
				else { reject(new Error("Invalid username or password")); }
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