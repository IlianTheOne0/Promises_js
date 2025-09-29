import { LoginService } from "./services/loginService.js";
import { LanguageService } from "./services/languageService.js";
import { DisplayService } from "./services/displayService.js";
import { NavigationService } from "./services/navigationService.js";

import { assignEvents } from "./events/assigner.js";

let services = null;

function loadServices()
{
  	const loginService = new LoginService();
  	const languageService = new LanguageService();
  	const displayService = new DisplayService(languageService);
	const navigationService = new NavigationService();

  	return { loginService, languageService, displayService, navigationService };
}

async function initializeApp()
{
  	const services = loadServices();

  	assignEvents(services);

  	await services.languageService.initializeLanguage("en");
	await services.displayService.updateDisplayLanguage(services.loginService);	
}

initializeApp();