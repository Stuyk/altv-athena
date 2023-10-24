import * as path from 'path';
import fs from 'fs';

import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import { sanitizePath } from '../shared/path.js';

const exec = promisify(execCallback);

export async function doesSettingJsonExist() {
    const pluginConfigs = JSON.parse(
        fs.readFileSync(sanitizePath(path.join(process.cwd(), 'plugin-settings.json'), 'utf8')),
    );

    for (const [pluginName, config] of Object.entries(pluginConfigs)) {
        if (config.disabled) {
            continue;
        }

        const pluginPath = sanitizePath(path.join(process.cwd(), 'src/core/plugins', pluginName));

        if (fs.existsSync(pluginPath) && fs.statSync(pluginPath)) {
            await updatePlugins(config.url, config.branch, pluginPath);
        } else {
            console.log(`>>> Plugin-Settings.json: ${pluginPath} is invalid.`);
        }
    }
}

async function updatePlugins(url, branch, targetDirectory) {
    try {
        const isValidUrl = isValidGitHubRepoURL(url);
        if (isValidUrl) {
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
        }
    } catch (e) {
        console.error(`Error executing Git command: ${e}`);
    }
}

function isValidGitHubRepoURL(url) {
    if (url !== '') {
        const githubRepoURLPattern = /^https:\/\/github\.com\/([A-Za-z0-9-_.]+)\/([A-Za-z0-9-_.]+)\/?$/;
        const isValid = githubRepoURLPattern.test(url);

        if (!isValid) {
            console.log(`${url} is not an valid GitHub url!`);
        }

        return isValid;
    }
}

doesSettingJsonExist();
