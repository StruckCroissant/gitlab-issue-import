import type { GitlabIssueImportPlugin } from "@Types";
import {
	App,
	ButtonComponent,
	Notice,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { InitializedSettingsLoader as SettingsLoader } from "@Services/settings";
import { GitlabInstance } from "@Services/gitlab";
import {
	GitlabIssueImportErrorNotice,
	GitlabIssueImportNotice,
} from "@UI/Notices";

class GitlabConnectionSettingTab extends PluginSettingTab {
	plugin: GitlabIssueImportPlugin;
	initialized: boolean;

	constructor(app: App, plugin: GitlabIssueImportPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	/**
	 * TODO try to decouple this from the display logic - maybe can implicitly initialize once?
	 */
	initialize(): void {
		if (this.initialized) return;
		this.initialized = true;

		new Setting(this.containerEl)
			.setName("Gitlab Host")
			.setDesc("The URL for the targeted Gitlab instance")
			.addText((text) => {
				text.setValue(SettingsLoader.get("host")).onChange(
					async (value) => {
						await SettingsLoader.update(value, "host");
					}
				);
			});

		new Setting(this.containerEl)
			.setName("Gitlab API Key")
			.setDesc("The API key for the Gitlab instance")
			.addText((text) => {
				text.setValue(SettingsLoader.get("key")).onChange(
					async (value) => {
						await SettingsLoader.update(value, "key");
					}
				);
			});

		new ButtonComponent(this.containerEl)
			.setButtonText("test connection")
			.onClick(async () => {
				await GitlabInstance.initialize();
				new GitlabIssueImportNotice("Connected successfully!");
			});
	}

	display(): void {
		this.initialize();
	}
}

export function addSettings(instance: GitlabIssueImportPlugin, app: App) {
	instance.addSettingTab(new GitlabConnectionSettingTab(app, instance));
}
