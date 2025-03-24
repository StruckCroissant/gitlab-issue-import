import type {
	GitlabIssueImportSetting,
	GitlabIssueImportSettings,
	GitlabIssueImportSettingKey,
} from "@Types";

export function isGitlabIssueImportSetting(
	value: GitlabIssueImportSetting | GitlabIssueImportSettings
): value is GitlabIssueImportSetting {
	if (typeof value === "string") {
		return true;
	}
	return false;
}
