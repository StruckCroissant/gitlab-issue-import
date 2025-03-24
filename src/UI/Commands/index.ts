import { Plugin } from "obsidian";
import { GitlabIssueImportModal } from "@UI/Modals";
import type { GitlabIssueImportPlugin } from "@Types";

function addImportIssueCommand(instance: GitlabIssueImportPlugin) {
	instance.addCommand({
		id: "import-gitlab-issue",
		name: "Import Gitlab Issue",
		callback: () => {
			const modal = new GitlabIssueImportModal(this.app);
			modal.open();
		},
	});
}

export function loadCommands(instance: GitlabIssueImportPlugin) {
	addImportIssueCommand(instance);
}
