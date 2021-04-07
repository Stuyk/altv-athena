import rimraf from 'rimraf';
import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import ora from 'ora';
import { exec } from 'promisify-child-process';

// Path is where package.json is.
const ProcessArguments = process.argv.slice(2);
const StartTime = Date.now();
const MainPath = process.cwd();
const ResourcesPath = path.join(MainPath, 'resources');
const SourceFiles = new glob.GlobSync('./src/**/*.!(ts)').found;
let copiedFiles = 0;

async function buildPipeline() {
    console.log(`[Athena] Starting Compilation`);
    const spinner = ora(`Starting Compilation...`).start();

    if (!process.argv.includes('WATCHING')) {
        // Remove old resource files.
        if (fs.existsSync(ResourcesPath)) {
            spinner.text = `Removing Resources Folder`;
            await new Promise((resolve) => {
                rimraf(ResourcesPath, (err) => {
                    if (err) {
                        spinner.fail();
                        spinner.stop();
                        console.log(err);
                        return;
                    }

                    resolve();
                });
            });

            spinner.text = `Removed Resources Folder`;
        }

        // Handle Typescript Compilation
        spinner.text = `Building Files...`;
        const { stdout, stderr } = await exec('tsc', { cwd: MainPath });
        if (stderr) {
            spinner.fail();
            spinner.stop();
            console.warn(`[Athena] Did Not Compile Correctly`);
            throw stderr;
        }
    }

    // Handle Source Copy
    spinner.text = `Copying Non-Addon Resources`;
    for (let i = 0; i < SourceFiles.length; i++) {
        const oldPath = SourceFiles[i];
        const newPath = SourceFiles[i].replace('src', 'resources');
        const dirName = path.dirname(newPath).normalize();

        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }

        fs.copyFileSync(oldPath, newPath);
        copiedFiles += 1;
    }

    // Copy Addon-Resources
    spinner.text = `Copying Addon-Resources`;
    fs.copySync(path.join(MainPath, 'addon-resources'), path.join(MainPath, 'resources'), { recursive: true });
    spinner.clear();
    spinner.stop();

    console.log(`[Athena] Copied ${copiedFiles} Extra Files for Athena`);
    console.log(`[Athena] Build Time: ${Date.now() - StartTime}ms`);
}

buildPipeline();
