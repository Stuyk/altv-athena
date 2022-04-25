import path from 'path';
import fs from 'fs-extra';

const viablePluginDisablers = [
    'disable.plugin',
    'disabled.plugin',
    'disable',
]

export function sanitizePath(p) {
    return p.replace(/\\/g, path.sep);
}

export function getEnabledPlugins() {
    const pluginsFolder = sanitizePath(path.join(process.cwd(), 'src/core/plugins'));
    const plugins = fs.readdirSync(pluginsFolder);

    return plugins.filter((plugin) => {
        for (let i = 0; i < viablePluginDisablers.length; i++) {
            const filePath = sanitizePath(path.join(pluginsFolder, plugin, viablePluginDisablers[i]));
            if (fs.existsSync(filePath)) {
                return false;
            }
        }

        return true;
    });
}