import glob from 'glob';
import fs from 'fs-extra';
import path from 'path';

const FILES_TO_FIND = [
    //
    'src/**/*.ts',
    'scripts/streamer/src/**/*.ts',
];

async function getFiles() {
    return new Promise(async (resolve) => {
        let files = [];

        for (let i = 0; i < FILES_TO_FIND.length; i++) {
            const somePath = path.join(process.cwd(), FILES_TO_FIND[i]);
            const filesFound = await new Promise((resolve) => {
                glob(somePath, (err, _files) => {
                    resolve(_files);
                });
            });

            files = files.concat(filesFound);
        }

        resolve(files);
    });
}

async function constructFileList() {
    const files = await getFiles();

    for (let i = 0; i < files.length; i++) {
        files[i] = path.normalize(files[i]);
    }

    fs.writeFileSync(
        path.join(process.cwd(), 'scripts/fileassurance/filelist.json'),
        JSON.stringify(files, null, '\t'),
    );
}

constructFileList();
