import { Gitlab, type IssueSchemaWithBasicLabels } from "@gitbeaker/rest";
import { SettingsLoader } from "./settings";

type GitlabInstanceType = InstanceType<typeof Gitlab>;

let instance: GitlabInstanceType | null = null;

export const GitlabInstance = {
	async issue(id: number): Promise<IssueSchemaWithBasicLabels | null> {
		const instance = await GitlabInstance.initialize();
		if (instance === null) return null;

		const result = await instance.Issues.all({ iids: [id] });
		if (result.length === 0) {
			throw new Error(`Could not find issue (${id})`);
		}

		return result.pop() as IssueSchemaWithBasicLabels;
	},

	async initialize() {
		if (instance !== null) return instance;

		const { host, key } = SettingsLoader.settings();
		const tempInstance = new Gitlab({ host, token: key });

		try {
			// Simple call to ensure that a connection was established
			await tempInstance.Issues.all({
				perPage: 1,
				page: 1,
			});
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
