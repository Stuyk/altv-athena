import './example/index';
import './example-agenda/index';
import './core-atm/index';
import './core-clothing/index';
import './core-cuffs/index';
import './core-factions/index';
import './core-fuel/index';
import './core-fuel-stations/index';
import './core-garage/index';
import './core-interior/index';
import './core-items/index';
import './core-nametags/index';
import './core-vitals/index';
import './core-voice/index';
import './job-mule-delivery/index';
import './job-pizza-delivery/index';
import './commands-roleplay/index';
import './commands-moderator/index';
// Example: import './hotels/index'
// Make sure example import is calling the PluginSystem
// for a callback registration.
// Make sure you are importing only the main file for your plugin.
// You should not be importing multiple...
// ie: ./hotels/index1, ./hotels/index2, ./hotels/index3, etc.
// Your import should be the way to import other imports.
// ---------------------------------
// ---------------------------------
// ---------------------------------
// Place Imports Above
// Always Load this Last
import { PluginSystem } from '../server/systems/plugins';

PluginSystem.init();
