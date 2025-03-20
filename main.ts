import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import "bootstrap/dist/css/bootstrap.min.css";

export class GitlabIssueImportModal extends Modal {
	constructor(app: App) {
		super(app);

		this.setTitle("Import Gitlab Issue");

		let issueId: number | null = null;

		new Setting(this.contentEl)
			.setClass("invalid-feedback")
			.setName("Issue ID")
			.addText((text) => {
				text.onChange((value) => {
					issueId = Number.parseInt(value);
				});
			});
	}
}

export default class GitlabIssueImportPlugin extends Plugin {
	statusBarTextElement: HTMLSpanElement;

	async onload() {
		this.addCommand({
			id: "import-gitlab-issue",
			name: "Import Gitlab Issue",
			callback: () => {
				const modal = new GitlabIssueImportModal(this.app);
				modal.open();
			},
		});
	}
}
