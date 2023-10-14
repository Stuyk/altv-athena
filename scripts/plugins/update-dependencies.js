import { exec, execSync } from 'child_process';
import fs from 'fs';
import * as path from 'path';
import { sanitizePath } from '../shared/path.js';
import { globSync } from '../shared/fileHelpers.js';

const viablePluginDisablers = ['disable.plugin', 'disabled.plugin', 'disable'];

let dependencies = [];
let devDependencies = [];
let githubDependencies = [];

function getInstalledDependencies() {
    const packageJsonPath = sanitizePath(path.join(process.cwd(), 'package.json'));

    let contents;
    try {
        contents = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (error) {
        console.error(`Failed to read package.json: ${error}`);
        process.exit(1);
    }

    for (const dependency in contents.dependencies) {
        dependencies.push(dependency);
    }

    for (const dependency in contents.devDependencies) {
        devDependencies.push(dependency);
    }

    return dependencies;
}

function getPluginDependencies(pluginName) {
    const pluginPath = sanitizePath(path.join(process.cwd(), 'src/core/plugins', pluginName));

    const pluginDependencies = {
        dependencies: [],
        devDependencies: [],
        githubDependencies: [],
    };

    for (const disabler of viablePluginDisablers) {
        const disabledPath = sanitizePath(path.join(pluginPath, disabler));
        if (fs.existsSync(disabledPath)) {
            return pluginDependencies;
        }
    }

    const dependencyPath = sanitizePath(path.join(pluginPath, 'dependencies.json'));

    if (!fs.existsSync(dependencyPath)) {
        return pluginDependencies;
    }

    let contents;

    try {
        contents = JSON.parse(fs.readFileSync(dependencyPath, 'utf8'));
    } catch (error) {
        console.error(`Failed to read dependencies.json for plugin ${pluginName}: ${error}`);
    }

    if (!contents) {
        return pluginDependencies;
    }

    for (const name of contents.dependencies ?? []) {
        pluginDependencies.dependencies.push(name);
    }

    for (const name of contents.devDependencies ?? []) {
        pluginDependencies.devDependencies.push(name);
    }

    for (const name of contents.githubDependencies ?? []) {
        pluginDependencies.githubDependencies.push(name);
    }

    return pluginDependencies;
}

function getGithubDependencies() {
    const plugins = globSync(sanitizePath(path.join(process.cwd(), 'src/core/plugins/*')));

    for (const plugin of plugins) {
        const pluginName = path.basename(plugin);
        const pluginDependencies = getPluginDependencies(pluginName);

        if (pluginDependencies.githubDependencies.length === 0) continue;

        console.log(`Github Dependencies => ${pluginDependencies.githubDependencies}`);

        for (const githubDependency of pluginDependencies.githubDependencies) {
            const dependencyName = githubDependency.split('/').pop();

            const targetPath = sanitizePath(path.join(process.cwd(), 'src/core/plugins/', dependencyName));

            if (fs.existsSync(targetPath)) {
                console.log(`Dependency folder "${dependencyName}" already exists. Skipping.`);
            } else {
                const cloneCommand = `git clone ${githubDependency}.git ${targetPath}`;

                try {
                    execSync(cloneCommand, { stdio: 'inherit' });
                    console.log(`Cloned "${dependencyName}" from GitHub.`);
                } catch (error) {
                    console.error(`Failed to clone "${dependencyName}" from GitHub: ${error.message}`);
                }
            }
        }
    }
}

function checkPluginDependencies() {
    const plugins = globSync(sanitizePath(path.join(process.cwd(), 'src/core/plugins/*')));

    const missingDepdendencies = [];

    for (const plugin of plugins) {
        const pluginName = path.basename(plugin);

        const pluginDependencies = getPluginDependencies(pluginName);

        if (pluginDependencies.dependencies.length === 0) continue;

        console.log(
            `Checking dependencies for plugin '${pluginName}': ${pluginDependencies.dependencies.length} dependencies`,
        );

        if (pluginDependencies.dependencies.length > 0) {
            for (const dependency of pluginDependencies.dependencies) {
                if (!dependencies.includes(dependency)) {
                    missingDepdendencies.push(dependency);
                }
            }
        }
    }

    return missingDepdendencies;
}

function checkPluginDevDependencies() {
    const plugins = globSync(sanitizePath(path.join(process.cwd(), 'src/core/plugins/*')));

    const missingDevDepdendencies = [];

    for (const plugin of plugins) {
        const pluginName = path.basename(plugin);

        const pluginDependencies = getPluginDependencies(pluginName);

        if (pluginDependencies.devDependencies.length === 0) continue;

        console.log(
            `Checking development dependencies for plugin '${pluginName}': ${pluginDependencies.devDependencies.length} dependencies`,
        );

        if (pluginDependencies.devDependencies.length > 0) {
            for (const dependency of pluginDependencies.devDependencies) {
                if (!devDependencies.includes(dependency)) {
                    missingDevDepdendencies.push(dependency);
                }
            }
        }
    }

    return missingDevDepdendencies;
}

function checkIfDependencyFolderExists(dependencyName) {
    const nodeModulesPath = path.join(process.cwd(), 'node_modules', dependencyName);
    return fs.existsSync(nodeModulesPath);
}

function updatePluginDependencies() {
    const installedDependencies = getInstalledDependencies();
    const missingDepdendencies = checkPluginDependencies();
    const missingDevDependencies = checkPluginDevDependencies();

    const sanitizedMissingDependencies = missingDepdendencies.map((dependency) => dependency.replace(/@latest$/, ''));

    if (
        sanitizedMissingDependencies.some(
            (dep) => installedDependencies.includes(dep) && checkIfDependencyFolderExists(dep),
        )
    ) {
        console.log(`All dependencies are already included and their folders exist. Skipping update...`);
        return;
    }

    if (missingDepdendencies.length > 0) {
        exec(`npm install ${missingDepdendencies.join(' ')}`, (error, _stdout, stderr) => {
            if (error) {
                console.error(`Failed to install dependencies: ${error}`);
                console.error(stderr);
            }
        });
        console.log(`Dependencie installing... ${missingDepdendencies}`);
    } else console.log(`Dependencies already installed. Skipping...`);

    if (missingDevDependencies.length > 0) {
        exec(`npm install -D ${missingDevDependencies.join(' ')}`, (error, _stdout, stderr) => {
            if (error) {
                console.error(`Failed to install dev dependencies: ${error}`);
                console.error(stderr);
            }
        });
    }
}

updatePluginDependencies();
getGithubDependencies();
