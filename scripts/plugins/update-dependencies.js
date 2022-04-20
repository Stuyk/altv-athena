import { exec } from 'child_process';
import fs from "fs";
import glob from 'glob';
import * as path from 'path';

function getInstalledDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

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
    const pluginPath = path.join(process.cwd(), 'src/core/plugins', pluginName);
    const dependencyPath = path.join(pluginPath, 'dependencies.json');

    const dependencies = {
        dependencies: [],
        devDependencies: []
    }
    
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
    const plugins = glob.sync(path.join(process.cwd(), 'src/core/plugins/*'));

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

    if (missingDepdendencies.length > 0) {
        exec(`npm install ${missingDepdendencies.join(' ')}`, (error, _stdout, stderr) => {
            if (error) {
                console.error(`Failed to install dependencies: ${error}`);
                console.error(stderr);
            }
        });
    }

    if (missingDevDependencies.length > 0) {
        exec(`npm install --save-dev ${missingDevDependencies.join(' ')}`, (error, _stdout, stderr) => {
            if (error) {
                console.error(`Failed to install dev dependencies: ${error}`);
                console.error(stderr);
            }
        });
    }

    // console.log(plugins);
}

updatePluginDependencies();
