import { setupAccountButton as baseSetupAccountButton } from "../events/login-events.js";
import { setupLanguageButton as baseSetupLanguageButton } from "../events/languages-events.js";
import { setupLocationEvents as baseSetupLocationEvents } from "../events/location-events.js";
import { setupAddEvents as baseSetupAddEvents } from "../events/add-events.js";
import { setupListEvents as baseSetupListEvents } from "../events/list-events.js";

function decorate(func)
{
	return function(...args) { return func(...args); };
}

const setupAccountButton = decorate(baseSetupAccountButton);
const setupLanguageButton = decorate(baseSetupLanguageButton);
const setupLocationEvents = decorate(baseSetupLocationEvents);
const setupAddEvents = decorate(baseSetupAddEvents);
const setupListEvents = decorate(baseSetupListEvents);

export function assignEvents()
{
	const eventSetups =
	[
		setupAccountButton,
		setupLanguageButton,
		setupLocationEvents,
		setupAddEvents,
		setupListEvents
	];

	for (const setup of eventSetups) { setup(); }
}
