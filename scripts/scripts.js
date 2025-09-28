import { LoginService } from "./services/loginService.js";
import { LanguageService } from "./services/languageService.js";
import { DisplayService } from "./services/displayService.js";

import { updateLoginDiv } from "./items/login-item.js";
import { assignEvents } from "./events/assigner.js";

function loadServices()
{
  	const loginService = new LoginService();
  	const languageService = new LanguageService();
  	const displayService = new DisplayService(languageService);

  return { loginService, languageService, displayService };
}

async function initializeApp()
{
  	const services = loadServices();

  	assignEvents(services);

  	updateLoginDiv(services.loginService);

  	await services.languageService.initializeLanguage("en");
}

initializeApp();