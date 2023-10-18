import { exec, execSync } from 'child_process';
import fs from 'fs';
import * as path from 'path';
import { sanitizePath } from '../shared/path.js';
import { globSync } from '../shared/fileHelpers.js';

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

function updatePluginDependencies() {
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
            exec(`npm install ${missingRegularDeps.join(' ')}`, (error, _stdout, stderr) => {
                if (error) {
                    console.error(`>>> Failed to install regular dependencies: ${error}`);
                    console.error(stderr);
                } else {
                    installDevDependencies(installedDevDeps, sanitizedMissingDevDeps, missingDevDeps);
                }
            });
        } else {
            console.log(
                `>>> All regular dependencies are already included, and their folders exist. Skipping regular dependencies update...`,
            );
            installDevDependencies(installedDevDeps, sanitizedMissingDevDeps, missingDevDeps);
        }
    } else {
        console.log(
            `>>> All regular dependencies are already included, and their folders exist. Skipping regular dependencies update...`,
        );
        installDevDependencies(installedDevDeps, sanitizedMissingDevDeps, missingDevDeps);
    }
}

function installDevDependencies(installedDevDeps, sanitizedMissingDevDeps, missingDevDeps) {
    if (sanitizedMissingDevDeps.some((dep) => !installedDevDeps.includes(dep) || !existsInModules(dep))) {
        const missingDevDepsToAdd = missingDevDeps.filter((dep) => !installedDevDeps.includes(dep));
        if (missingDevDepsToAdd.length > 0) {
            console.log(`>>> Installing dev dependencies...`);
            missingDevDepsToAdd.forEach((dep) => {
                console.log(`- ${dep}`);
            });
            exec(`npm install -D ${missingDevDepsToAdd.join(' ')}`, (error, _stdout, stderr) => {
                if (error) {
                    console.error(`Failed to install dev dependencies: ${error}`);
                    console.error(stderr);
                }
            });
        } else {
            console.log(
                `>>> All dev dependencies are already included, and their folders exist. Skipping dev dependencies update...`,
            );
        }
    } else {
        console.log(
            `>>> All dev dependencies are already included, and their folders exist. Skipping dev dependencies update...`,
        );
    }
}

function installGithubDependencies() {
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

        githubDependencies.forEach((githubDependency) => {
            const dependencyName = githubDependency.split('/').pop();
            const targetPath = sanitizePath(path.join(process.cwd(), 'src/core/plugins/', dependencyName));

            if (fs.existsSync(targetPath)) {
                console.log(`>>> Dependency folder "${dependencyName}" already exists. Skipping.`);
            } else {
                const cloneCommand = `git clone ${githubDependency}.git ${targetPath}`;

                try {
                    execSync(cloneCommand, { stdio: 'inherit' });
                    console.log(`>>> Cloned "${dependencyName}" from GitHub.`);
                } catch (error) {
                    console.error(`>>> Failed to clone "${dependencyName}" from GitHub: ${error.message}`);
                }
            }
        });
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

updatePluginDependencies();
installGithubDependencies();
