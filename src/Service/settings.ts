import type {
	GitlabIssueImportPlugin,
	GitlabIssueImportSettings,
	GitlabIssueImportSetting,
	GitlabIssueImportSettingKey,
} from "@Types";
import { isGitlabIssueImportSetting } from "src/Types";
import { GitlabInstance } from "./gitlab";

let settings: GitlabIssueImportSettings | null = null;

class SettingsLoader {
	invalid: boolean;
	#plugin: GitlabIssueImportPlugin;

	async load(
		plugin: GitlabIssueImportPlugin
	): Promise<GitlabIssueImportSettings> {
		this.#plugin = plugin;
		let loadedSettings = (await plugin.loadData()) ?? {
			host: null,
			key: null,
		};
		settings = loadedSettings;

		return loadedSettings;
	}

	plugin(): GitlabIssueImportPlugin {
		if (!this.#plugin) throw new Error("Plugin is not initialized!");

		return this.#plugin;
	}

	settings(): GitlabIssueImportSettings {
		if (!settings) throw new Error("Settings are not initialized!");

		return settings;
	}

	async save() {
		await this.plugin().saveData(settings);
		GitlabInstance.unsetInstance();
	}

	async update(
		value: GitlabIssueImportSettings | GitlabIssueImportSetting,
		key: GitlabIssueImportSettingKey | null
	) {
		if (isGitlabIssueImportSetting(value) && key !== null) {
			this.settings()[key] = value;
		} else {
			settings = value as GitlabIssueImportSettings;
		}
		await this.save();
	}

	get(key: keyof GitlabIssueImportSettings) {
		if (settings === null) {
			throw new Error("Cannot retrieve from null settings instance");
		}

		return settings[key];
	}

	validate(): true {
		if (!settings?.host) {
			throw new Error("Host is not set or is invalid");
		} else if (!settings?.key) {
			throw new Error("API Key is not set or is invalid");
		}

		return true;
	}
}

export const InitializedSettingsLoader = new SettingsLoader();
