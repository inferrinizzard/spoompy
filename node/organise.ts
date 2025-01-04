import { existsSync, mkdirSync, readdirSync, renameSync } from "fs";
import { lstat, readdir } from "fs/promises";

export const getDirs = async (path: string) =>
	readdir(`${path}`).then(async (files) => {
		const dirs: string[] = [];

		await Promise.all(
			files.map(async (name) => {
				if ((await lstat(`${path}/${name}`)).isDirectory()) {
					dirs.push(name);
				}
			}),
		);

		return dirs;
	});

export const organise = async () => {
	const [latest, prev, ...dates] = readdirSync("archive").sort().reverse();

	const existingDirs = await getDirs(`archive/${prev}`);

	const files = readdirSync(`archive/${latest}`);
	const fileMap = files.reduce((acc, file) => ({ ...acc, [file]: 1 }), {});

	existingDirs.forEach((dir) => {
		if (!existsSync(`archive/${latest}/${dir}`)) {
			mkdirSync(`archive/${latest}/${dir}`);
		}
	});

	const dirPaths = [...existingDirs];

	while (dirPaths.length) {
		const currPath = dirPaths.pop()!;

		if (!existsSync(`archive/${latest}/${currPath}`)) {
			mkdirSync(`archive/${latest}/${currPath}`);
		}
		const subDirs = await getDirs(`archive/${prev}/${currPath}`);
		dirPaths.push(...subDirs.map((sub) => `${currPath}/${sub}`));

		const files = readdirSync(`archive/${prev}/${currPath}`);
		files.forEach((file) => {
			if (fileMap[file]) {
				try {
					renameSync(
						`archive/${latest}/${file}`,
						`archive/${latest}/${currPath}/${file}`,
					);
				} catch (e) {
					console.error("MISSING", file);
				}
			}
		});
	}

	const prevTopLevel = readdirSync(`archive/${prev}`);
	const remaining = readdirSync(`archive/${latest}`).filter(
		(name) => !prevTopLevel.includes(name),
	);

	console.log("REMAINING", remaining);
};
