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
import { SettingsLoader } from "@Services/settings";
import { Templating } from "@Services/templating";
import { initializeGlobalRequestInstance } from "@Services/request";

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
		this.settings = await SettingsLoader.load(this);
		Templating.load(
			(this.app as any).plugins.plugins["templater-obsidian"].templater,
			this.app
		);
		addSettings(this, this.app);
		initializeGlobalRequestInstance();
	}
}
