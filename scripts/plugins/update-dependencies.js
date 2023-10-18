import * as path from 'path';
import fs from 'fs';

import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import { sanitizePath } from '../shared/path.js';
import { globSync } from '../shared/fileHelpers.js';

const exec = promisify(execCallback);
const viablePluginDisablers = ['disable.plugin', 'disabled.plugin', 'disable'];

const dependencies = [];
const devDependencies = [];
const githubDependencies = [];

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

    for (const dependency in contents.githubDependencies) {
        githubDependencies.push(dependency);
    }

    return { dependencies, devDependencies, githubDependencies };
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

function checkPluginDependencies() {
    const plugins = globSync(sanitizePath(path.join(process.cwd(), 'src/core/plugins/*')));

    const missingDepdendencies = [];

    for (const plugin of plugins) {
        const pluginName = path.basename(plugin);

        const pluginDependencies = getPluginDependencies(pluginName);

        if (pluginDependencies.dependencies.length === 0) continue;

        console.log(
            `>>> Checking dependencies for plugin '${pluginName}': ${pluginDependencies.dependencies.length} dependencies`,
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
            `>>> Checking development dependencies for plugin '${pluginName}': ${pluginDependencies.devDependencies.length} dependencies`,
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

export async function updatePluginDependencies() {
    const installedDepsObj = getInstalledDependencies();
    const installedDeps = installedDepsObj.dependencies;
    const installedDevDeps = installedDepsObj.devDependencies;

    const missingDeps = checkPluginDependencies();
    const missingDevDeps = checkPluginDevDependencies();

    const sanitizeDependencies = (dependencies) => dependencies.map((dep) => dep.replace(/@.*$/, ''));

    const sanitizedMissingDeps = sanitizeDependencies(missingDeps);
    const sanitizedMissingDevDeps = sanitizeDependencies(missingDevDeps);

    if (sanitizedMissingDeps.some((dep) => !installedDeps.includes(dep) || !existsInModules(dep))) {
        const missingRegularDeps = missingDeps.filter((dep) => !installedDeps.includes(dep));
        if (missingRegularDeps.length > 0) {
            console.log(`>>> Installing regular dependencies...`);
            missingRegularDeps.forEach((dep) => {
                console.log(`- ${dep}`);
            });

            try {
                const { stdout } = await exec(`npm install ${missingRegularDeps.join(' ')}`);
                console.log(stdout);

                await installDevDependencies(installedDevDeps, sanitizedMissingDevDeps, missingDevDeps);
            } catch (error) {
                console.error(`>>> Failed to install regular dependencies: ${error}`);
                console.error(error.stderr);
            }
        } else {
            await installDevDependencies(installedDevDeps, sanitizedMissingDevDeps, missingDevDeps);
        }
    } else {
        await installDevDependencies(installedDevDeps, sanitizedMissingDevDeps, missingDevDeps);
    }
}

async function installDevDependencies(installedDevDeps, sanitizedMissingDevDeps, missingDevDeps) {
    if (sanitizedMissingDevDeps.some((dep) => !installedDevDeps.includes(dep) || !existsInModules(dep))) {
        const missingDevDepsToAdd = missingDevDeps.filter((dep) => !installedDevDeps.includes(dep));
        if (missingDevDepsToAdd.length > 0) {
            console.log(`>>> Installing dev dependencies...`);
            missingDevDepsToAdd.forEach((dep) => {
                console.log(`- ${dep}`);
            });

            try {
                const { stdout } = await exec(`npm install -D ${missingDevDepsToAdd.join(' ')}`);
                console.log(stdout);

                await installGithubDependencies();
            } catch (error) {
                console.error(`Failed to install dev dependencies: ${error}`);
                console.error(error.stderr);
            }
        } else {
            await installGithubDependencies();
        }
    } else {
        await installGithubDependencies();
    }
}

async function installGithubDependencies() {
    const plugins = globSync(sanitizePath(path.join(process.cwd(), 'src/core/plugins/*')));

    for (const plugin of plugins) {
        const pluginName = path.basename(plugin);
        const pluginDependencies = getPluginDependencies(pluginName);

        const githubDependencies = pluginDependencies.githubDependencies.filter(isValidGitHubRepoURL);

        if (githubDependencies.length === 0) continue;

        console.log(`>>> GitHub Dependencies for plugin "${pluginName}":`);
        githubDependencies.forEach((githubDependency) => {
            console.log(`- ${githubDependency}`);
        });

        for (const githubDependency of githubDependencies) {
            const dependencyName = githubDependency.split('/').pop();
            const targetPath = sanitizePath(path.join(process.cwd(), 'src/core/plugins/', dependencyName));

            if (fs.existsSync(targetPath)) {
                console.log(`>>> Dependency folder "${dependencyName}" already exists. Skipping.`);
            } else {
                const cloneCommand = `git clone ${githubDependency}.git ${targetPath}`;

                try {
                    const { stdout } = await exec(cloneCommand);
                    console.log(`>>> Cloned "${dependencyName}" from GitHub:\n${stdout}`);
                } catch (error) {
                    console.error(`>>> Failed to clone "${dependencyName}" from GitHub: ${error.message}`);
                }
            }
        }
    }
}

function existsInModules(dependencyName) {
    const nodeModulesPath = path.join(process.cwd(), 'node_modules', dependencyName);
    return fs.existsSync(nodeModulesPath);
}

function isValidGitHubRepoURL(url) {
    const githubRepoURLPattern = /^https:\/\/github\.com\/([A-Za-z0-9-_.]+)\/([A-Za-z0-9-_.]+)\/?$/;
    const isValid = githubRepoURLPattern.test(url);

    if (!isValid) {
        console.log(`${url} is not an valid GitHub URL!`);
    }

    return isValid;
}
