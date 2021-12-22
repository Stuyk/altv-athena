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

async function findMissingFiles() {
    const files = await getFiles();
    const jsonData = fs.readFileSync(path.join(process.cwd(), './scripts/fileassurance/filelist.json')).toString();
    const fullList = JSON.parse(jsonData);
    const absent = files.filter((e) => !fullList.includes(e));

    console.log(`MISSING ${absent.length} FILES`);
    console.log(JSON.stringify(absent, null, '\t'));
}

findMissingFiles();
