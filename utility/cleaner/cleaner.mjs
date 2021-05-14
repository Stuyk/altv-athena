import rimraf from 'rimraf';
import path from 'path';
import fs from 'fs-extra';

const MainPath = process.cwd();

const paths = [
    path.join(MainPath, 'resources'),
    path.join(MainPath, 'athena-cache'),
    path.join(MainPath, 'cache'),
    path.join(MainPath, 'crashdumps'),
    path.join(MainPath, 'cache'),
    path.join(MainPath, 'tsconfig.tsbuildinfo'),
    path.join(MainPath, 'server.log')
];

async function cleanup() {
    for(let i = 0; i < paths.length; i++) {
        const currentPath = paths[i];

        if (fs.existsSync(currentPath)) {
            await new Promise((resolve) => {
                rimraf(currentPath, (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
        
                    resolve();
                });
            });
        }
    }
}

cleanup();