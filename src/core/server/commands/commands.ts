import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';

import './adminChat';
import './currency';
import './death';
import './debugVehicle';
import './factions';
import './garage';
import './interiors';
import './inventory';
import './item';
import './job';
import './noclip';
import './position';
import './revive';
import './roleplay';
import './seatbelt';
import './setArmour';
import './setFood';
import './setHealth';
import './setWater';
import './test';
import './time';
import './vehicle';
import './waypointTeleport';
import './wanted';
import './weapon';
import './weather';
import './whitelist';

alt.emit(SYSTEM_EVENTS.COMMANDS_LOADED);
