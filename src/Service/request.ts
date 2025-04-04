import { SettingsLoader } from "./settings";

declare global {
	interface Window {
		Gl: {
			get: (url: string) => Promise<any>;
		};
	}
}

export function initializeGlobalRequestInstance() {
	window["Gl"] = {
		async get(url: string) {
			const key = SettingsLoader.get("key");
			return await fetch(url, {
				headers: {
					"PRIVATE-TOKEN": key,
				},
			});
		},
	};
}
