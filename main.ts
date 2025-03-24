import {
	App,
	ButtonComponent,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	type PluginManifest,
} from "obsidian";
import "bootstrap/dist/css/bootstrap.min.css";
export * from "@UI/Modals";
import { loadCommands } from "@UI/Commands";
import type {
	GitlabIssueImportPlugin,
	GitlabIssueImportSettings,
} from "@Types";
import { addSettings } from "@UI/Settings";
import { InitializedSettingsLoader } from "@Services/settings";

export default class PluginDefinition
	extends Plugin
	implements GitlabIssueImportPlugin
{
	statusBarTextElement: HTMLSpanElement;
	settings: GitlabIssueImportSettings;

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onload() {
		loadCommands(this);
		this.settings = await InitializedSettingsLoader.load(this);
		addSettings(this, this.app);
	}
}
