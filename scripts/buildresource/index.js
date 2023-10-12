import path from 'path';
import { sanitizePath } from '../shared/path.js';
import { globSync, writeFile } from '../shared/fileHelpers.js';

const scriptPath = sanitizePath(path.join(process.cwd(), '/scripts/buildresource/resource.json'));
const defaults = {
    type: 'js',
    main: 'server/startup.js',
    'client-main': 'client/startup.js',
    'client-files': ['client/*', 'shared/*'],
    deps: [],
    'required-permissions': ['Screen Capture'],
};

async function getClientPluginFolders() {
    const removalPath = sanitizePath(path.join(process.cwd(), 'src/core/'));
    const results = globSync(sanitizePath(path.join(process.cwd(), `src/core/plugins/**/@(client|shared)`))).map(
        (fileName) => {
            return fileName.replace(removalPath, '') + `/*`;
        },
    );

    return results;
}

async function start() {
    const folders = await getClientPluginFolders();
    defaults['client-files'] = [...defaults['client-files'], ...folders];
    writeFile(scriptPath, JSON.stringify(defaults, null, '\t'));
}

start();
