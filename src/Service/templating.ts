import type { IssueSchema } from "@gitbeaker/rest";
import type { App, TFile, TFolder } from "obsidian";

interface Templater {
	create_new_note_from_template: (
		template: string,
		folder: TFolder,
		filename: string,
		open_new_note?: boolean
	) => unknown;

	find_tfile: (template: string) => unknown;
}

function isTemplater(value: unknown): value is Templater {
	const isObject = typeof value === "object" && value !== null;
	return isObject && "create_new_note_from_template" in value;
}

/**
 * @throws {Error}
 */
function assertAppIsInitialized(value: App | null): asserts value is App {
	if (!value) throw new Error("App is not initialized!");
}

let tp: Templater | null = null;
let concreteApp: App | null = null;

function getStaticFunction(
	module: "file",
	func: "find_tfile" | "create_new"
): (...args: any[]) => any {
	const concreteModule: any = (
		tp as any
	).functions_generator.internal_functions.modules_array.find(
		(tempModule: any) => tempModule.name === module
	).static_functions;
	return concreteModule.get(func);
}

function getFrontmatterFor(issue: IssueSchema): string {
	const issueEncoded = JSON.stringify(issue);
	let text = "---\n";
	text += issueEncoded + "\n";
	text += "---\n";

	return text;
}

async function buildTemplateForIssueAndTemplateFile(
	issue: IssueSchema,
	templateFile: TFile
): Promise<string> {
	assertAppIsInitialized(concreteApp);
	const templateFileContent = await concreteApp.vault.cachedRead(
		templateFile
	);

	return getFrontmatterFor(issue) + templateFileContent;
}

export const Templating = {
	async load(plugin: unknown, app: App) {
		if (!isTemplater(plugin))
			throw new Error("Provided plugin is not templater!");
		tp = plugin;
		concreteApp = app;
	},

	async createNote(
		targetFolder: TFolder,
		templateFile: TFile,
		filename: string,
		issue: IssueSchema
	) {
		const create_new = getStaticFunction("file", "create_new");

		const templateContent = await buildTemplateForIssueAndTemplateFile(
			issue,
			templateFile
		);

		const text = await create_new(
			templateContent,
			filename,
			true,
			targetFolder
		);
	},

	findTemplate(templateName: string): any {
		const find_tfile = getStaticFunction("file", "find_tfile");
		return find_tfile(templateName);
	},
};
