import * as alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';
import { command } from '@AthenaServer/decorators/commands';
import { World } from '@AthenaServer/systems/world';
import { WORLD_WEATHER } from '@AthenaShared/enums/weather';
import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';

class WeatherCommands {
    /**
     * Set the weather to a specific weather type.
     * @param {alt.Player} player - alt.Player - The player who is using the command.
     * @param {string} weatherName - The name of the weather to override the entire weather system with.
     * @returns The weather type.
     */
    @command('setweather', LocaleController.get(LOCALE_KEYS.COMMAND_SET_WEATHER, '/setweather'), PERMISSIONS.ADMIN)
    private static setWeather(player: alt.Player, weatherName: string): void {
        if (!player || !player.valid) {
            return;
        }

        if (!weatherName) {
            Athena.player.emit.message(player, `Must specify a weather name.`);
            return;
        }

        const weatherEntries = Object.values(WORLD_WEATHER);
        const index = weatherEntries.findIndex((x) => x.toLowerCase() === weatherName.toLowerCase());
        if (index <= -1) {
            Athena.player.emit.message(player, `${weatherName} is not a valid weather type.`);
            return;
        }

        Athena.player.emit.message(player, `${weatherName} is now overriding the entire weather system.`);
        Athena.player.emit.message(player, `Use /clearweather to stop overriding the weather.`);
        World.setOverrideWeather(true, weatherEntries[index]);
    }
    /**
     * Clear the weather override
     * The `playerFuncs` module is a collection of functions that
     * @param {alt.Player} player - alt.Player - The player who called the command.
     * @returns The weather override is now disabled.
     */
    @command(
        'clearweather',
        LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_WEATHER, '/clearweather'),
        PERMISSIONS.ADMIN,
    )
    private static clearWeather(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        World.setOverrideWeather(false, null);
        Athena.player.emit.message(player, `Weather override is now disabled.`);
    }
}
