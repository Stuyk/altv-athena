import { PluginSystem } from '../../../server/systems/plugins';
import '../../example-agenda/server/index';
import '../../core-atm/server/index';
import '../../core-clothing/server/index';
import '../../core-cuffs/server/index';
import '../../core-factions/server/index';
import '../../core-fuel/server/index';
import '../../core-fuel-stations/server/index';
import '../../core-garage/server/index';
import '../../core-interior/server/index';
import '../../core-items/server/index';
import '../../core-nametags/server/index';
import '../../core-paintshop/server/index';
import '../../core-vitals/server/index';
import '../../core-voice/server/index';
import '../../job-mule-delivery/server/index';
import '../../job-pizza-delivery/server/index';
import '../../commands-roleplay/server/index';
import '../../commands-moderator/server/index';
import '../../core-console-cmds/server/index';
import '../../core-dealership/server/index';
import '../../core-character-creator/server/index';
import '../../core-character-select/server/index';

// Example: import './hotels/server/index'
// Make sure example import is calling the PluginSystem
// for a callback registration.
// Make sure you are importing only the main file for your plugin.
// !- You should **NOT** be importing multiple...
// !- ie: ./hotels/server/index1, ./hotels/server/index2, ./hotels/server/index3, etc.
// Your import should be the way to import other imports.
// ---------------------------------
// ---------------------------------
// ---------------------------------
// Place Imports Above
// Always Load this Last

PluginSystem.init();
