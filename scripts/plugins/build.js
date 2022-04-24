import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';

const viablePluginDisablers = [
    'disable.plugin',
    'disabled.plugin',
    'disable',
]

function sanitizePath(p) {
    return p.replace(/\\/g, path.sep);
}

function getEnabledPlugins() {
    const pluginsFolder = sanitizePath(path.join(process.cwd(), 'src/core/plugins'));
    const plugins = fs.readdirSync(pluginsFolder);

    return plugins.filter((plugin) => {
        for (let i = 0; i < viablePluginDisablers.length; i++) {
            const filePath = sanitizePath(path.join(pluginsFolder, plugin, viablePluginDisablers[i]));
            if (fs.existsSync(filePath)) {
                return false;
            }
        }

        return true;
    });
}

function copyPluginFiles(pluginName) {
    const pluginsFolder = sanitizePath(path.join(process.cwd(), 'src/core/plugins', pluginName));

    const files = glob.sync(sanitizePath(path.join(pluginsFolder, '@(client|server)/index.ts')));

    const hasClientFiles = !!files.find(file => file.includes('client/index.ts'));
    const hasServerFiles = !!files.find(file => file.includes('server/index.ts'));
    const hasSharedFiles = fs.existsSync(sanitizePath(path.join(pluginsFolder, 'shared')));
    const hasWebviewFiles = fs.existsSync(sanitizePath(path.join(pluginsFolder, 'webview')));

    const destPath = sanitizePath(path.join(process.cwd(), 'resources/core/plugins', pluginName));

    if (hasWebviewFiles) {
        fs.copySync(sanitizePath(path.join(pluginsFolder, 'webview')), sanitizePath(path.join(destPath, 'webview')));
    }

    return {
        client: hasClientFiles,
        server: hasServerFiles,
        shared: hasSharedFiles,
        webview: hasWebviewFiles
    }
}

function writeServerImports(plugins) {
    if (!plugins.length) return;

    const importsHeader = `// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY CONTENTS\n\n`;

    let content = importsHeader + "import { PluginSystem } from '../../../server/systems/plugins';\n\n";

    content = content + plugins.map(pluginName => {
        return `import '../../${pluginName}/server';`;
    }).join('\n');

    content = content + `\n\nPluginSystem.init();\n`

    const importPath = sanitizePath(path.join(process.cwd(), 'resources/core/plugins/athena/server/imports.js'));
    fs.outputFileSync(importPath, content);
}

function writeClientImports(plugins) {
    if (!plugins.length) return;

    const importsHeader = `// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY CONTENTS\n\n`;

    const content = importsHeader + plugins.map(pluginName => {
        return `import '../../${pluginName}/client';`;
    }).join('\n');

    const importPath = sanitizePath(path.join(process.cwd(), 'resources/core/plugins/athena/client/imports.js'));
    fs.outputFileSync(importPath, content + '\n');
}

function writeWebviewPlugins(plugins) {
    const vueFiles = {};

    for (const pluginName of plugins) {
        const pluginPath = sanitizePath(path.join(process.cwd(), 'src/core/plugins', pluginName));

        const files = glob.sync(sanitizePath(path.join(pluginPath, 'webview/*.vue')));

        for (const file of files) {
            const componentName = path.basename(file, '.vue');
            vueFiles[componentName] = `../../${pluginName}/webview/${componentName}.vue`;
        }
    }

    const importsHeader = `// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY CONTENTS\n\n`;
    let content = '//@ts-nocheck\n'
        + importsHeader
        + "import { shallowRef } from 'vue'\n\n";

    content = content + Object.keys(vueFiles).map(componentName => {
        return `import ${componentName} from '${vueFiles[componentName]}';`;
    }).join('\n');

    content = content
        + '\n\nexport const PLUGIN_IMPORTS = {\n'
        + Object.keys(vueFiles).map(componentName => {
            return `    ${componentName}: shallowRef(${componentName}),`;
        }).join('\n')
        + '\n};\n';


    const importPath = sanitizePath(path.join(process.cwd(), 'resources/core/plugins/athena/webview/imports.js'));
    fs.outputFileSync(importPath, content);

    fs.rm(sanitizePath(path.join(process.cwd(), 'resources/core/plugins/athena/webview/imports.ts')), { force: true });

    return Object.keys(vueFiles).length;
}

function run() {
    const enabledPlugins = getEnabledPlugins();

    const clientImports = [];
    const serverImports = [];
    const webviewPlugins = [];

    for (const pluginName of enabledPlugins) {
        const result = copyPluginFiles(pluginName);

        if (result.client) clientImports.push(pluginName);
        if (result.server) serverImports.push(pluginName);
        if (result.webview) webviewPlugins.push(pluginName);
    }

    writeServerImports(serverImports);
    writeClientImports(clientImports);
    const vueFiles = writeWebviewPlugins(webviewPlugins);

    console.log(`Enabled plugins: ${enabledPlugins.length} (${clientImports.length} client, ${serverImports.length} server, ${vueFiles} webview)`);
}

run();
