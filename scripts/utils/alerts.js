import { LanguageService } from "../services/languageService.js";

const nativeAlert = window.alert;

export async function alert(valueName)
{
	const message = await new LanguageService().translate(valueName);
	console.log(message);
	nativeAlert.call(window, message);
}