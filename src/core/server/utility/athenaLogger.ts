import * as alt from 'alt-server';
import chalk from 'chalk';

export default class Logger {
    static log(message: string): void {
        alt.log(`${chalk.blueBright('[Athena]')} ${chalk.whiteBright(message)}`);
    }

    static warning(message: string): void {
        alt.log(`${chalk.blueBright('[Athena]')} ${chalk.yellowBright(message)}`);
    }

    static error(message: string): void {
        alt.log(`${chalk.blueBright('[Athena]')} ${chalk.redBright(message)}`);
    }

    static info(message: string): void {
        alt.log(`${chalk.blueBright('[Athena]')} ${chalk.blueBright(message)}`);
    }
}
