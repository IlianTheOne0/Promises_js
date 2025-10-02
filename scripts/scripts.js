import { LanguageService } from "./services/languageService.js";
import { DisplayService } from "./services/displayService.js";
import { AccountService } from "./services/accountService.js";

import { assignEvents } from "./events/assigner.js";

async function initializeApp()
{
  	const languageService = new LanguageService();
	const displayService = new DisplayService();

  	assignEvents();

  	await languageService.initializeLanguage("en");
	await displayService.updateDisplay(await languageService.getCurrentLanguage());
}

initializeApp();