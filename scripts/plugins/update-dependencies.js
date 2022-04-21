import { exec } from 'child_process';
import fs from "fs";
import glob from 'glob';
import * as path from 'path';
import yarn from 'yarn-or-npm';

const viablePluginDisablers = [
    'disable.plugin',
    'disabled.plugin',
    'disable',
]

function sanitizePath(p) {
    return p.replace(/\\/g, path.sep);
}

function getInstalledDependencies() {
    const packageJsonPath = sanitizePath(path.join(process.cwd(), 'package.json'));

    let contents;
    try {
        contents = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (error) {
        console.error(`Failed to read package.json: ${error}`);
        process.exit(1);
    }

    const dependencies = [];
    for (const dependency in contents.dependencies) {
        dependencies.push(dependency);
    }

    const devDependencies = [];
    for (const dependency in contents.devDependencies) {
        devDependencies.push(dependency);
    }

    return { dependencies, devDependencies };
}

function getPluginDependencies(pluginName) {
    const pluginPath = sanitizePath(path.join(process.cwd(), 'src/core/plugins', pluginName));

    const dependencies = {
        dependencies: [],
        devDependencies: []
    }

    for (let i = 0; i < viablePluginDisablers.length; i++) {
        const disabledPath = sanitizePath(path.join(pluginPath, viablePluginDisablers[i]));
        if (fs.existsSync(disabledPath)) {
            return dependencies;
        }
    }

    const dependencyPath = sanitizePath(path.join(pluginPath, 'dependencies.json'));

    if (!fs.existsSync(dependencyPath)) {
        return dependencies;
    }

    let contents = null;
    try {
        contents = JSON.parse(fs.readFileSync(dependencyPath, 'utf8'));
    } catch (error) {
        console.error(`Failed to read dependencies.json for plugin ${pluginName}: ${error}`);
    }

    if (!contents) {
        return dependencies;
    }

    for (const name of (contents.dependencies ?? [])) {
        dependencies.dependencies.push(name);
    }

    for (const name of (contents.devDependencies ?? [])) {
        dependencies.devDependencies.push(name);
    }

    return dependencies;
}

function updatePluginDependencies() {
    const installedDependencies = getInstalledDependencies();
    const plugins = glob.sync(sanitizePath(path.join(process.cwd(), 'src/core/plugins/*')));

    const missingDepdendencies = [];
    const missingDevDependencies = [];

    for (const plugin of plugins) {
        const pluginName = path.basename(plugin);

        const pluginDependencies = getPluginDependencies(pluginName);

        if (pluginDependencies.dependencies.length === 0 && pluginDependencies.devDependencies.length === 0)
            continue;

        console.log(`Checking dependencies for plugin '${pluginName}': ${pluginDependencies.dependencies.length} dependencies, ${pluginDependencies.devDependencies.length} dev dependencies`);

        if (pluginDependencies.dependencies.length > 0) {
            for (const dependency of pluginDependencies.dependencies) {
                if (!installedDependencies.dependencies.includes(dependency)) {
                    missingDepdendencies.push(dependency);
                }
            }
        }

        if (pluginDependencies.devDependencies.length > 0) {
            for (const dependency of pluginDependencies.devDependencies) {
                if (!installedDependencies.devDependencies.includes(dependency)) {
                    missingDevDependencies.push(dependency);
                }
            }
        }
    }

    const executable = yarn.hasYarn() ? 'yarn add' : 'npm install';

    if (missingDepdendencies.length > 0) {
        exec(`${executable} ${missingDepdendencies.join(' ')}`, (error, _stdout, stderr) => {
            if (error) {
                console.error(`Failed to install dependencies: ${error}`);
                console.error(stderr);
            }
        });
    }

    if (missingDevDependencies.length > 0) {
        exec(`${executable} -D ${missingDevDependencies.join(' ')}`, (error, _stdout, stderr) => {
            if (error) {
                console.error(`Failed to install dev dependencies: ${error}`);
                console.error(stderr);
            }
        });
    }
}

updatePluginDependencies();
