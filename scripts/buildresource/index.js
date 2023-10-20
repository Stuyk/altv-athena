import path from 'path';
import { sanitizePath } from '../shared/path.js';
import { globSync, writeFile } from '../shared/fileHelpers.js';

const scriptPath = sanitizePath(path.join(process.cwd(), './resources/core/resource.toml'));

function getClientPluginFolders() {
    const removalPath = sanitizePath(path.join(process.cwd(), 'src/core/'));
    const results = globSync(sanitizePath(path.join(process.cwd(), `src/core/plugins/**/@(client|shared)`))).map(
        (fileName) => {
            return fileName.replace(removalPath, '') + `/*`;
        },
    );

    return results;
}

export function buildResources() {
    let defaultToml =
        "type = 'js' \r\n" +
        "main = 'server/startup.js' \r\n" +
        "client-main = 'client/startup.js' \r\n" +
        "required-permissions = ['Screen Capture'] \r\n" +
        "client-files = ['client/*', 'shared/*', \r\n";

    const folders = getClientPluginFolders();

    for (let folder of folders) {
        defaultToml += `"${folder}", \r\n`;
    }

    defaultToml += ']';

    writeFile(scriptPath, defaultToml);
}
