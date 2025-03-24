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
			.onClick(() => {
				console.log(issueId);
			});
	}
}

export default { GitlabIssueImportModal };
