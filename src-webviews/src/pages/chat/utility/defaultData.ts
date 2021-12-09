import ICommand from '../interfaces/ICommand';
import IMessage from '../interfaces/IMessage';

export function defaultMessages(): Array<IMessage> {
    const messages = [];
    for (let i = 0; i < 100; i++) {
        if (i < 25) {
            const context = `${i} says: {FFF}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis justo nulla. Vestibulum accumsan mi in orci tincidunt bibendum. Phasellus fringilla magna erat, ac molestie eros posuere vel.`;
            let messageLength = context.slice(0, Math.floor(Math.random() * 156) + 100);

            // Color Tests
            messages.push({
                message: `${messageLength}`,
                timestamp: '[00:00:00]',
            });
            continue;
        }

        // Normal Tests
        messages.push({
            message: `${i} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
            timestamp: '[00:00:00]',
        });
    }

    return messages;
}

export function defaultCommands(): Array<ICommand> {
    return [
        { name: 'timestamp', description: '/timestamp - Toggles Timestamps' },
        {
            name: 'help',
            description: '/help - List Available Commands in the Athena Framework for your Permission Level',
        },
    ];
}

export function localCommands(): Array<ICommand> {
    return [
        { name: 'chattimestamp', description: '/chattimestamp - Toggle Timestamps' },
        { name: 'chatfade', description: '/chatfade - Toggle Chat Fade' },
        { name: 'chatclear', description: '/chatclear - Clear Chat' },
        { name: 'chatprint', description: '/chatprint - Print Chat to F8 Console' },
    ];
}
