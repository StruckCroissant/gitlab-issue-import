import { Plugin } from "obsidian";

export interface GitlabIssueImportSettings {
	host: string | null;
	key: string | null;
	folder: string | null;
	templateFile: string | null;
}

export type GitlabIssueImportSetting =
	GitlabIssueImportSettings[keyof GitlabIssueImportSettings];

export type GitlabIssueImportSettingKey = keyof GitlabIssueImportSettings;

export interface GitlabIssueImportPlugin extends Plugin {
	settings: GitlabIssueImportSettings;
	onload: () => Promise<void>;
}
