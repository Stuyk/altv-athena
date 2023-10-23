import * as path from 'path';
import fs from 'fs';

import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import { sanitizePath } from '../shared/path.js';
import { globSync } from '../shared/fileHelpers.js';

const exec = promisify(execCallback);

export async function doesSettingJsonExist() {
    let contents = [];
    const plugins = globSync(sanitizePath(path.join(process.cwd(), 'src/core/plugins/*')));
    for (const plugin of plugins) {
        const pluginPath = sanitizePath(path.join(plugin));
        const settingPath = sanitizePath(path.join(plugin, 'plugin-settings.json'));

        if (!fs.existsSync(settingPath)) continue;

        contents = JSON.parse(fs.readFileSync(settingPath, 'utf8'));
        await updatePlugins(contents.url, contents.branch, pluginPath);
    }
}

async function updatePlugins(url, branch, targetDirectory) {
    try {
        const { stdout: currentBranch } = await exec(`git -C ${targetDirectory} rev-parse --abbrev-ref HEAD`);

        if (currentBranch.trim() === branch) {
            console.log(
                `>>> Git Pull is valid! [Current Plugin Branch]: ${currentBranch.trim()} | [Update-Branch]: ${branch}`,
            );

            const gitPullCommand = `git -C ${targetDirectory} pull --allow-unrelated-histories ${url} ${branch}`;

            try {
                const { stdout } = await exec(gitPullCommand);
                console.log(`>>> Pulled "${url}" from GitHub\n${stdout}`);
            } catch (e) {
                console.error(`Error pulling from GitHub: ${e}`);
            }
        } else {
            console.log(`Branches are not similar. Skipping the update.`);
        }
    } catch (e) {
        console.error(`Error executing Git command: ${e}`);
    }
}

doesSettingJsonExist();
