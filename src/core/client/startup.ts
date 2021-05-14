import * as alt from 'alt-client';

// Interfaces - Always Load First
import './extensions/Meta';
import './extensions/Player';
import './extensions/Vehicle';

// Events
import './events/connectionComplete';
import './events/disconnect';
import './events/keyup';

// Systems
import './systems/animations';
import './systems/blip';
import './systems/death';
import './systems/disable';
import './systems/interiors';
import './systems/job';
import './systems/meta';
import './systems/nametag';
import './systems/marker';
import './systems/noclip';
import './systems/particle';
import './systems/progressBar';
import './systems/quickToken';
import './systems/sound';
import './systems/tasks';
import './systems/tick';
import './systems/textlabel';
import './systems/toolbar';
import './systems/vehicle';
import './systems/world';
import './systems/torso';

// Utility
import './utility/notification';
import './utility/reload';
import './utility/screenshot';

// Views
import './views/atm/atm';
import './views/creator/creator';
import './views/characters/characters';
import './views/clothing/clothing';
import './views/inventory/inventory';
import './views/job/job';
import './views/login/login';

// Client Plugins
import '../client-plugins/imports';
