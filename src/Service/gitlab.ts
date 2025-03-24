import { Gitlab } from "@gitbeaker/rest";
import type { GitlabIssueImportSettings } from "@Types";

let gitlabInstance = null;

export function buildGitlabInstance(host: string, token: string) {
	gitlabInstance = new Gitlab({
		host,
		token,
	});
}

export function loadIssue() {}

export class GitlabInstance {
	instance;

	constructor(host: string, token: string) {
		this.instance = new Gitlab({
			host,
			token,
		});
	}

	static fromSettings({ host, key }: GitlabIssueImportSettings) {
		return new GitlabInstance(host, key);
	}

	async testConnection() {
		const result = await this.instance.Issues.all();
		console.log(result);
	}
}
