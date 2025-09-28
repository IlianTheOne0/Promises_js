import { setupAccountButton } from "../events/login-events.js";
import { setupLanguageButton } from "../events/languages-events.js";

export function assignEvents(services)
{
	assignLoginEvents(services.loginService);
	assignLanguageEvents(services.languageService, services.displayService);
}

export function assignLoginEvents(loginService)
{
	setupAccountButton(loginService);
}

export function assignLanguageEvents(languageService, displayService)
{
	setupLanguageButton(languageService, displayService);
}