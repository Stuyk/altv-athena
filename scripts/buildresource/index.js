import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';

const scriptPath = path.join(process.cwd(), '/scripts/buildresource/resource.json');
const defaults = {
    type: 'js',
    main: 'server/startup.js',
    'client-main': 'client/startup.js',
    'client-files': [
        'client/*',
        'shared/*',
    ],
    deps: [],
    "required-permissions": [
        "Screen Capture"
    ]
}

async function getClientPluginFolders() {
    let folders = [];

    const removalPath = path.join(process.cwd(), 'src/core/').replace(/\\/gm, '/')
    const results = await new Promise((resolve) => {
        glob(path.join(process.cwd(), `src/core/plugins/**/@(client|shared)`), (err, files) => {
            if (err) {
                resolve([])
                return;
            }

            files = files.map((fileName) => {
                return fileName.replace(removalPath, '') + `/*`
            });

            resolve(files);
        });
    });

    folders = folders.concat(results);
    return folders;
}

async function start() {
    const folders = await getClientPluginFolders();
    defaults['client-files'] = [...defaults['client-files'], ...folders];

    fs.outputFileSync(scriptPath, JSON.stringify(defaults, null, '\t'));
}

start();

