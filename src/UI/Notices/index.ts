import { Notice } from "obsidian";

export class GitlabIssueImportErrorNotice extends Notice {
	constructor(message: string) {
		super(`Gitlab error: ${message}`);
	}
}

export class GitlabIssueImportNotice extends Notice {}
