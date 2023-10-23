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
        console.log(`>>> Valid Configuration (plugin-settings.json) found!`);
        console.log(`>>> Plugin-Url: ${contents.url} | Plugin-Branch: ${contents.branch}`);
        await updatePlugins(contents.url, contents.branch, pluginPath);
    }
}

async function updatePlugins(url, branch, targetDirectory) {
    const gitPullCommand = `git -C ${targetDirectory} pull --allow-unrelated-histories ${url} ${branch}`;

    try {
        const { stdout } = await exec(gitPullCommand);
        console.log(`>>> Pulled "${url}" from GitHub into ${targetDirectory}:\n${stdout}`);
    } catch (e) {
        console.log(e);
    }
}
