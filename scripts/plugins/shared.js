import path from 'path';
import fs from 'fs-extra';

const viablePluginDisablers = ['disable.plugin', 'disabled.plugin', 'disable', 'disabled'];

export function sanitizePath(p) {
    return p.replace(/\\/g, '/');
}

export function getEnabledPlugins() {
    const pluginsFolder = sanitizePath(path.join(process.cwd(), 'src/core/plugins'));
    const plugins = fs.readdirSync(pluginsFolder);

    return plugins.filter((plugin) => {
        for (const disabler of viablePluginDisablers) {
            const filePath = sanitizePath(path.join(pluginsFolder, plugin, disabler));
            if (fs.existsSync(filePath)) {
                return false;
            }
        }

        return true;
    });
}
