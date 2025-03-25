import type { GitlabIssueImportPlugin } from "@Types";
import {
	App,
	ButtonComponent,
	Notice,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { SettingsLoader } from "@Services/settings";
import { GitlabInstance } from "@Services/gitlab";
import {
	GitlabIssueImportErrorNotice,
	GitlabIssueImportNotice,
} from "@UI/Notices";

const initializeGitlabInstance = async () => {
	try {
		await GitlabInstance.initialize();
	} catch (e) {
		new GitlabIssueImportErrorNotice(e.message);
		return;
	}
	new GitlabIssueImportNotice("Connected successfully!");
};

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

		this.containerEl.createEl("h2", { text: "Connection" }, (el) => {
			el.classList.add("d-flex", "align-items-end");

			new ButtonComponent(el)
				.setClass("float-right")
				.setButtonText("test")
				.onClick(async (event) => {
					const tempNode = event.targetNode?.firstChild as Node;
					event.targetNode?.removeChild(tempNode);
					const spinner = document.createElement("div");
					spinner.addClass("lds-dual-ring");
					event.targetNode?.appendChild(spinner);

					await initializeGitlabInstance();

					event.targetNode?.removeChild(spinner);
					event.targetNode?.appendChild(tempNode);
				});
		});

		new Setting(this.containerEl)
			.setName("Gitlab Host")
			.setDesc("The URL for the targeted Gitlab instance")
			.addText((text) => {
				text.setValue(SettingsLoader.get("host")).onChange(
					SettingsLoader.updateHandlerFor("host")
				);
			});

		new Setting(this.containerEl)
			.setName("Gitlab API Key")
			.setDesc("The API key for the Gitlab instance")
			.addText((text) => {
				text.setValue(SettingsLoader.get("key")).onChange(
					SettingsLoader.updateHandlerFor("key")
				);
			});

		this.containerEl.createEl("h2", { text: "Templating" });

		new Setting(this.containerEl)
			.setName("Target Folder")
			.setDesc("Where new Gitlab Issues should be placed")
			.addText((text) => {
				text.setValue(SettingsLoader.get("folder")).onChange(
					SettingsLoader.updateHandlerFor("folder")
				);
			});

		new Setting(this.containerEl)
			.setName("Template File")
			.setDesc("The file to use when templating out new issues")
			.addText((text) => {
				text.setValue(SettingsLoader.get("templateFile")).onChange(
					SettingsLoader.updateHandlerFor("templateFile")
				);
			});
	}

	display(): void {
		this.initialize();
	}
}

export function addSettings(instance: GitlabIssueImportPlugin, app: App) {
	instance.addSettingTab(new GitlabConnectionSettingTab(app, instance));
}
