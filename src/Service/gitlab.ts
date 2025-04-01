import { Gitlab, type IssueSchemaWithBasicLabels } from "@gitbeaker/rest";
import { SettingsLoader } from "./settings";

type GitlabInstanceType = InstanceType<typeof Gitlab>;

let instance: GitlabInstanceType | null = null;

export const GitlabInstance = {
	async issue(id: number): Promise<IssueSchemaWithBasicLabels> {
		const instance = await GitlabInstance.initialize();

		const result = await instance.Issues.all({ iids: [id] });
		if (result.length === 0) {
			throw new Error(`Could not find issue (${id})`);
		}
		let issue = null;
		if (!(issue = result.pop())) {
			throw new Error(`Could not find issue (${id})`);
		}

		return issue as IssueSchemaWithBasicLabels;
	},

	async initialize() {
		if (instance !== null) return instance;

		const { host, key } = SettingsLoader.settings();
		if (host === null || key === null)
			throw new Error("Please provide either a host or key");
		const tempInstance = new Gitlab({ host, token: key });

		try {
			// Simple call to ensure that a connection was established
			await tempInstance.Issues.all({ iids: [] });
		} catch (e) {
			throw new Error("Failed to connect to instance");
		}

		instance = tempInstance;
		return tempInstance;
	},

	/**
	 * Used by the settings loader to reset creds once they're updated
	 * @see SettingsLoader
	 */
	unsetInstance() {
		instance = null;
	},
};
