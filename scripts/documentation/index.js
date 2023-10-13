import path from 'path';
import fs from 'fs';
import { globSync, writeFile } from '../shared/fileHelpers.js';

const docsPath = join(process.cwd(), './docs');
const filesToRemove = ['.nojekyll', 'modules.md', 'README.md'];
const files = globSync(join(docsPath, '/**/*.md'));

/**
 *
 *
 * @param {string} somePath
 * @param {Array<string>} args
 * @return {void}
 */
function join(somePath, ...args) {
    return path.join(somePath, ...args).replace(/\\/gm, '/');
}

/**
 * Returns the API pathway for this file.
 *
 * @param {string} somePath
 * @returns {string}
 */
function getApiPath(somePath) {
    const origPath = somePath.replace(/\\/gm, '/');
    somePath = origPath.replace(process.cwd().replace(/\\/gm, '/'), '');
    const splitFilePath = somePath.split('/');
    const actualFileName = splitFilePath[splitFilePath.length - 1];
    const fullPath = actualFileName.replace(/\_/gm, '/');

    let apiPath = fullPath.replace('.md', '');
    if (apiPath.includes('server')) {
        apiPath = apiPath.replace(/\//gm, '.').replace('server.', 'Athena.');
    }

    if (apiPath.includes('client')) {
        apiPath = apiPath.replace(/\//gm, '.').replace('client.', 'AthenaClient.');
    }

    if (apiPath.includes('shared')) {
        apiPath = apiPath.replace(/\//gm, '.').replace('shared.', 'AthenaShared.');
    }

    if (apiPath.includes('..')) {
        apiPath = apiPath.replace(/\.\./gm, '.');
    }

    return apiPath;
}

for (let file of files) {
    if (filesToRemove.findIndex((x) => file.includes(x)) >= 0) {
        continue;
    }

    const apiPath = getApiPath(file);
    const rows = fs.readFileSync(file).toString().split('\n');
    if (rows.length <= 3) {
        console.log(`Deleting Dead File: ${file}`);
        fs.rmSync(file);
        continue;
    }

    // Remove first row, since the title sucks
    rows.shift();

    // Append header information...
    rows.unshift('');
    rows.unshift('# {{ $frontmatter.title }}');
    rows.unshift('');
    rows.unshift('---');
    rows.unshift('order: 0');
    rows.unshift('outline: [1,3]');
    rows.unshift(`title: ${apiPath}`);
    rows.unshift('---');

    for (let i = 0; i < rows.length; i++) {
        if (!rows[i].includes('▸')) {
            continue;
        }

        const rowWithPathway = rows[i].replace('▸ ', apiPath + '.');
        rows[i] = rowWithPathway;
        rows.splice(i, 0, '::: tip Usage');
        rows.splice(i + 2, 0, ':::');
        i += 1; // Increment by 1 to prevent endless loop
    }

    writeFile(file, rows.join('\n'));
}
