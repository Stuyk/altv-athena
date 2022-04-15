import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { handleApmCmd } from './commands/apm';
import { handleBanCmd } from './commands/ban';
import { handleFreezeCmd } from './commands/freeze';
import { handleGethereCmd } from './commands/gethere';
import { handleGotoCmd } from './commands/goto';
import { handleInfoCmd } from './commands/info';
import { handleKickCmd } from './commands/kick';
import { handleRefillCmd } from './commands/refillVehicle';
import { handleRepairVehicleCmd } from './commands/repairVehicle';
import { handleDimensionCmd } from './commands/setdimension';
import { handleInteriorCmd } from './commands/setinterior';
import { handleUnbanCmd } from './commands/unban';
import { handleUnfreezeCmd } from './commands/unfreeze';
import { makeAdminCmd } from './commands/makeadmin';
import { Athena } from '../../../../server/api/athena';
import { handleAdminChat } from './commands/ac';
import { handleBroadcast } from './commands/broadcast';
import { handleModeratorChat } from './commands/mc';
import { addVehicleToPlayer, createTemporaryVehicle } from './commands/vehicle';
import { handleAddBank, handleAddCash, handleSetBank, handleSetCash } from './commands/currency';
import { cmdSetHealth } from './commands/health';

export class ModeratorCommands {
    static init() {
        Athena.controllers.chat.addCommand(
            'setinterior',
            '/setinterior <ID> <INTERIOR>',
            PERMISSIONS.ADMIN,
            handleInteriorCmd,
        );

        Athena.controllers.chat.addCommand(
            'setdimension',
            '/setdimension <ID> <DIMENSION>',
            PERMISSIONS.ADMIN,
            handleDimensionCmd,
        );

        Athena.controllers.chat.addCommand('kick', '/kick <ID> <REASON>', PERMISSIONS.ADMIN, handleKickCmd);

        Athena.controllers.chat.addCommand(
            'ban',
            '/ban <ID> <REASON> - Bans a player.',
            PERMISSIONS.ADMIN,
            handleBanCmd,
        );

        Athena.controllers.chat.addCommand(
            'unban',
            '/unban <DISCORDIDENTIFIER> - Unbans a player by discord ID',
            PERMISSIONS.ADMIN,
            handleUnbanCmd,
        );

        Athena.controllers.chat.addCommand(
            'gethere',
            '/gethere <ID> - Teleports a player to your position.',
            PERMISSIONS.ADMIN,
            handleGethereCmd,
        );

        Athena.controllers.chat.addCommand(
            'goto',
            '/goto <ID> - Teleports you to the specified player.',
            PERMISSIONS.ADMIN,
            handleGotoCmd,
        );

        Athena.controllers.chat.addCommand(
            'info',
            '/info <ID> - Get account info for the specified id.',
            PERMISSIONS.ADMIN,
            handleInfoCmd,
        );

        Athena.controllers.chat.addCommand(
            'refillVehicle',
            '/refillVehicle - Refills fuel of an vehicle by administrative power.',
            PERMISSIONS.ADMIN,
            handleRefillCmd,
        );

        Athena.controllers.chat.addCommand(
            'repairVehicle',
            '/repairVehicle - Repairs an vehicle by administrative power.',
            PERMISSIONS.ADMIN,
            handleRepairVehicleCmd,
        );

        Athena.controllers.chat.addCommand(
            'freeze',
            '/freeze <ID> - Freeze the specified player by ID',
            PERMISSIONS.ADMIN,
            handleFreezeCmd,
        );

        Athena.controllers.chat.addCommand('unfreeze', '/unfreeze <ID>', PERMISSIONS.ADMIN, handleUnfreezeCmd);

        Athena.controllers.chat.addCommand(
            'apm',
            '/apm <ID> - Sends an administrative private message to the specified player.',
            PERMISSIONS.ADMIN,
            handleApmCmd,
        );

        Athena.controllers.chat.addCommand(
            'makeAdmin',
            '/makeAdmin <ID> - Add permission specified player.',
            PERMISSIONS.ADMIN,
            makeAdminCmd,
        );

        Athena.controllers.chat.addCommand(
            'ac',
            '/ac <very_long_message> - Chat with other admins',
            PERMISSIONS.ADMIN,
            handleAdminChat,
        );

        Athena.controllers.chat.addCommand(
            'broadcast',
            '/broadcast <very_long_message> - Broadcast to the whole server',
            PERMISSIONS.ADMIN,
            handleBroadcast,
        );

        Athena.controllers.chat.addCommand('mc', '/mc', PERMISSIONS.MODERATOR | PERMISSIONS.ADMIN, handleModeratorChat);

        Athena.controllers.chat.addCommand('vehicle', '/tempvehicle', PERMISSIONS.ADMIN, createTemporaryVehicle);

        Athena.controllers.chat.addCommand('addvehicle', '/addvehicle', PERMISSIONS.ADMIN, addVehicleToPlayer);

        Athena.controllers.chat.addCommand('setcash', '/setcash [amount] [id]', PERMISSIONS.ADMIN, handleSetCash);

        Athena.controllers.chat.addCommand('addcash', '/addcash [amount] [id]', PERMISSIONS.ADMIN, handleAddCash);

        Athena.controllers.chat.addCommand('addbank', '/addbank [amount] [id]', PERMISSIONS.ADMIN, handleAddBank);

        Athena.controllers.chat.addCommand('setbank', '/setbank [amount] [id]', PERMISSIONS.ADMIN, handleSetBank);

        Athena.controllers.chat.addCommand('sethealth', '/sethealth [value] [id]', PERMISSIONS.ADMIN, cmdSetHealth);

        Athena.controllers.chat.addCommand('setarmour', '/setarmour [value] [id]', PERMISSIONS.ADMIN, cmdSetHealth);
    }
}
