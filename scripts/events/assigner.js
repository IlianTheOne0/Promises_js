import { setupAccountButton } from "../events/login-events.js";
import { setupLanguageButton } from "../events/languages-events.js";
import { setupLocationEvents } from "../events/location-events.js";

export function assignEvents(services)
{
	assignLoginEvents(services.loginService);
	assignLanguageEvents(services.languageService, services.displayService);
	assignLocationEvents(services.loginService, services.navigationService);
}

export function assignLoginEvents(loginService)
{
	setupAccountButton(loginService);
}

export function assignLanguageEvents(languageService, displayService)
{
	setupLanguageButton(languageService, displayService);
}

export function assignLocationEvents(loginService, navigationService)
{
	setupLocationEvents(loginService, navigationService);
}