import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';

import '../commands/adminChat';
import '../commands/currency';
import '../commands/death';
import '../commands/debugVehicle';
import '../commands/factions';
import '../commands/garage';
import '../commands/inventory';
import '../commands/item';
import '../commands/job';
import '../commands/noclip';
import '../commands/position';
import '../commands/revive';
import '../commands/seatbelt';
import '../commands/setArmour';
import '../commands/setHealth';
import '../commands/test';
import '../commands/time';
import '../commands/vehicle';
import '../commands/waypointTeleport';
import '../commands/wanted';
import '../commands/weapon';
import '../commands/weather';
import '../commands/whitelist';

alt.emit(SYSTEM_EVENTS.COMMANDS_LOADED);
