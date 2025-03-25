import type {
	GitlabIssueImportPlugin,
	GitlabIssueImportSettings,
	GitlabIssueImportSetting,
	GitlabIssueImportSettingKey,
} from "@Types";
import { isGitlabIssueImportSetting } from "src/Types";
import { GitlabInstance } from "./gitlab";

const defaultSettings: GitlabIssueImportSettings = {
	host: null,
	key: null,
	folder: null,
	templateFile: null,
};

let settings: GitlabIssueImportSettings | null = null;
let plugin: GitlabIssueImportPlugin | null = null;

export const SettingsLoader = {
	async load(
		inputPlugin: GitlabIssueImportPlugin
	): Promise<GitlabIssueImportSettings> {
		plugin = inputPlugin;
		let loadedSettings: GitlabIssueImportSettings =
			(await inputPlugin.loadData()) ?? defaultSettings;
		settings = loadedSettings;

		return loadedSettings;
	},

	plugin(): GitlabIssueImportPlugin {
		if (!plugin) throw new Error("Plugin is not initialized!");

		return plugin;
	},

	settings(): GitlabIssueImportSettings {
		if (!settings) throw new Error("Settings are not initialized!");

		return settings;
	},

	async save() {
		await this.plugin().saveData(settings);
		GitlabInstance.unsetInstance();
	},

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
	},

	updateHandlerFor(
		key: GitlabIssueImportSettingKey
	): (value: Parameters<typeof this.update>[0]) => void {
		return (value) => this.update(value, key);
	},

	get(key: keyof GitlabIssueImportSettings) {
		return this.settings()[key];
	},
};
