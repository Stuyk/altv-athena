import * as alt from 'alt-client';

// Client Plugins
import '../client-plugins/imports';
// Events
import './events/connectionComplete';
import './events/disconnect';
import './events/keyup';
// Interfaces - Always Load First
import './extensions/Meta';
import './extensions/Player';
import './extensions/Vehicle';
// Menus
import './menus/animation';

// Systems
import './systems/animations';
import './systems/blip';
import './systems/dealership';
import './systems/death';
import './systems/debug';
import './systems/disable';
import './systems/help';
import './systems/hologram';
import './systems/interaction';
import './systems/interiors';
import './systems/job';
import './systems/marker';
import './systems/meta';
import './systems/nametag';
import './systems/hud';
import './systems/noclip';
import './systems/particle';
import './systems/progressBar';
import './systems/quickToken';
import './systems/sound';
import './systems/tasks';
import './systems/textlabel';
import './systems/tick';
import './systems/toolbar';
import './systems/vehicle';
import './systems/world';
// Utility
import './utility/getters';
import './utility/notification';
import './utility/reload';
import './utility/screenshot';
import './utility/wheelMenu';
// Views
import './views/atm';
import './views/characters';
import './views/clothing';
import './views/creator';

import './views/garage';
import './views/inventory';
import './views/job';
import './views/login';
import './views/hud/hud';
