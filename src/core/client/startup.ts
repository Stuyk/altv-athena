import * as alt from 'alt-client';

// Interfaces - Always Load First
import './extensions/Meta';
import './extensions/Player';
import './extensions/Vehicle';

// Events
import './events/connectionComplete';
import './events/disconnect';
import './events/keyup';

// Streamers
import './streamers/blip';

// Systems
import './systems/death';
import './systems/disable';
import './systems/interiors';
import './systems/meta';
import './systems/nametag';
import './systems/noclip';
import './systems/quickToken';
import './systems/sound';
import './systems/tick';
import './systems/toolbar';
import './systems/vehicle';
import './systems/world';
import './systems/torso';

// Utility
import './utility/notification';
import './utility/screenshot';

// Views
import './views/atm/atm';
import './views/creator/creator';
import './views/characters/characters';
import './views/inventory/inventory';
