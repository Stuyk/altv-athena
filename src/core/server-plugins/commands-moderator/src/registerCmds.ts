import ChatController from '../../../server/systems/chat';
import { PERMISSIONS } from '../../../shared/flags/permissionFlags';
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

ChatController.addCommand('setinterior', '/setinterior <ID> <INTERIOR>', PERMISSIONS.ADMIN, handleInteriorCmd);

ChatController.addCommand('setdimension', '/setdimension <ID> <DIMENSION>', PERMISSIONS.ADMIN, handleDimensionCmd);

ChatController.addCommand('kick', '/kick <ID> <REASON>', PERMISSIONS.ADMIN, handleKickCmd);

ChatController.addCommand('ban', '/ban <ID> <REASON> - Bans a player.', PERMISSIONS.ADMIN, handleBanCmd);

ChatController.addCommand('unban', '/unban <DISCORDIDENTIFIER> - Unbans a player by discord ID', PERMISSIONS.ADMIN,
    handleUnbanCmd,
);

ChatController.addCommand(
    'gethere',
    '/gethere <ID> - Teleports a player to your position.',
    PERMISSIONS.ADMIN,
    handleGethereCmd,
);

ChatController.addCommand(
    'goto',
    '/goto <ID> - Teleports you to the specified player.',
    PERMISSIONS.ADMIN,
    handleGotoCmd,
);

ChatController.addCommand(
    'info',
    '/info <ID> - Get account info for the specified id.',
    PERMISSIONS.ADMIN,
    handleInfoCmd,
);

ChatController.addCommand(
    'refillVehicle',
    '/refillVehicle - Refills fuel of an vehicle by administrative power.',
    PERMISSIONS.ADMIN,
    handleRefillCmd,
);

ChatController.addCommand(
    'repairVehicle',
    '/repairVehicle - Repairs an vehicle by administrative power.',
    PERMISSIONS.ADMIN,
    handleRepairVehicleCmd,
);

ChatController.addCommand(
    'freeze',
    '/freeze <ID> - Freeze the specified player by ID',
    PERMISSIONS.ADMIN,
    handleFreezeCmd,
);

ChatController.addCommand('unfreeze', '/unfreeze <ID>', PERMISSIONS.ADMIN, handleUnfreezeCmd);

ChatController.addCommand('apm', '/apm <ID> - Sends an administrative private message to the specified player.', PERMISSIONS.ADMIN, handleApmCmd);

ChatController.addCommand(
    'makeAdmin',
    '/makeAdmin <ID> - Add permission specified player.',
    PERMISSIONS.ADMIN,
     makeAdminCmd,
);
