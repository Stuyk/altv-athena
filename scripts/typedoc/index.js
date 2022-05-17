import glob from 'glob';
import path from 'path';
import fs from 'fs';

async function constructFilePaths() {
    const serverFiles = await new Promise((resolve) => {
        glob(path.join(process.cwd(), 'src/core/server/api/**/*.ts'), (_err, _files) => {
            resolve(_files);
        });
    });

    const clientFiles = await new Promise((resolve) => {
        glob(path.join(process.cwd(), 'src/core/client/**/*.ts'), (_err, _files) => {
            resolve(_files);
        });
    });

    const files = serverFiles.concat(clientFiles);
    const newData = {
        entryPoints: files,
        out: 'doc',
    };

    fs.writeFileSync('typedoc.json', JSON.stringify(newData, null, '\t'));
}

constructFilePaths();
