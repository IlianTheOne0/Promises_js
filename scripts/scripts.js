import { LanguageService } from "./services/languageService.js";
import { DisplayService } from "./services/displayService.js";

import { assignEvents } from "./events/assigner.js";
import { LoginService } from "./services/loginService.js";

async function initializeApp()
{
  	const languageService = new LanguageService();
	const displayService = new DisplayService();

  	assignEvents();

  	await languageService.initializeLanguage("en");
	await displayService.updateDisplayLanguage(await languageService.getCurrentLanguage());
}

initializeApp();

// console.log(localStorage.getItem("films"));
// console.log(new LoginService().getCurrentUser().id);

// localStorage.clear();