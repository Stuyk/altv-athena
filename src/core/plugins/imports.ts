import './example/index';
import './example-agenda/index';
import './core-atm/index';
import './core-clothing/index';
import './core-garage/index';
import './core-interior/index';

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
