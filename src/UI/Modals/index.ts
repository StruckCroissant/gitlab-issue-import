import { GitlabInstance } from "@Services/gitlab";
import { SettingsLoader } from "@Services/settings";
import { Templating } from "@Services/templating";
import {
	GitlabIssueImportErrorNotice,
	GitlabIssueImportNotice,
} from "@UI/Notices";
import { App, ButtonComponent, Modal, Setting } from "obsidian";

export class GitlabIssueImportModal extends Modal {
	constructor(app: App) {
		super(app);

		this.setTitle("Import Gitlab Issue");

		let issueId: number | null = null;

		const issueIdButton = new Setting(this.contentEl)
			.setClass("invalid-feedback")
			.setName("Issue ID")
			.addText((text) => {
				text.onChange((value) => {
					issueId = Number.parseInt(value);
					createButton.setDisabled(Number.isNaN(issueId));
				});
			});

		const createButton = new ButtonComponent(this.contentEl)
			.setButtonText("Create")
			.onClick(async () => {
				try {
					const issue = await GitlabInstance.issue(issueId as number);
					const template = Templating.findTemplate(
						SettingsLoader.get("templateFile")
					);
					const folder = app.vault.getFolderByPath(
						SettingsLoader.get("folder")
					);
					if (folder === null)
						throw new Error(
							"Folder is invalid! Please check your settings"
						);
					await Templating.createNote(
						folder,
						template,
						issue.title,
						issue
					);
				} catch (e) {
					new GitlabIssueImportErrorNotice(e.message);
				}
			});
	}
}

export default { GitlabIssueImportModal };
