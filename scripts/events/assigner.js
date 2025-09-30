import { setupAccountButton } from "../events/login-events.js";
import { setupLanguageButton } from "../events/languages-events.js";
import { setupLocationEvents } from "../events/location-events.js";
import { setupAddEvents } from "../events/add-events.js";

export function assignEvents()
{
	assignLoginEvents();
	assignLanguageEvents();
	assignLocationEvents();
	assignAddEvents();
}

export function assignLoginEvents()
{
	setupAccountButton();
}

export function assignLanguageEvents()
{
	setupLanguageButton();
}

export function assignLocationEvents()
{
	setupLocationEvents();
}

export function assignAddEvents()
{
	setupAddEvents();
}