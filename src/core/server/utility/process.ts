import { ConsoleCommander } from '../../shared/utility/consoleCommander';

process.stdin.resume();
process.stdin.setEncoding('utf8');

if (process.stdin.isTTY) {
    process.stdin.on('data', (text: string) => {
        const data = text.split(' ');
        const cmdName = data.shift();
        ConsoleCommander.invokeCommand(cmdName, ...data);
    });
}
