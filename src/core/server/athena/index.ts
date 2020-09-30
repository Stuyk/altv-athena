const mainPath = '../database/index';

const lines: Array<string> = [
    `\n`,
    `Welcome to project Athena by Stuyk`,
    `Project Athena was written as a reference point for new servers.`,
    `Using findings from the old open roleplay gamemode to build a better foundation.`,
    `I won't tell you how to load this project. You can purchase the right to learn how to load it.`,
    `Thanks for trying my project with no strings attached.`,
    `\n`
];

for (let i = 0; i < lines.length; i++) {
    console.log(lines[i]);
}

// Load Database and Everything Else
if (process.platform.includes('win')) {
    import(mainPath.replace(/\\/g, '/'));
} else {
    import(mainPath);
}
