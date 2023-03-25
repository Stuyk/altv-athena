import path from 'path';
import fs from 'fs';
import glob from 'glob';

const docsPath = join(process.cwd(), './docs');
const filesToRemove = ['.nojekyll', 'modules.md', 'README.md'];
const files = glob.sync(join(docsPath, '/**/*.md'));

/**
 *
 *
 * @param {string} somePath
 * @param {Array<string>} args
 * @return {*}
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

    return apiPath;
}

for (let file of files) {
    if (filesToRemove.findIndex((x) => file.includes(x)) >= 0) {
        continue;
    }

    if (file.includes('internal')) {
        continue;
    }

    const apiPath = getApiPath(file);
    const rows = fs.readFileSync(file).toString().split('\n');

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

    fs.writeFileSync(file, rows.join('\n'));
}
