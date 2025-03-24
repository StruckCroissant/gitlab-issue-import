import { Plugin } from "obsidian";

export interface GitlabIssueImportSettings {
	host: string;
	key: string;
}

export type GitlabIssueImportSetting =
	GitlabIssueImportSettings[keyof GitlabIssueImportSettings];

export type GitlabIssueImportSettingKey = keyof GitlabIssueImportSettings;

export interface GitlabIssueImportPlugin extends Plugin {
	settings: GitlabIssueImportSettings;
	onload: () => Promise<void>;
}
