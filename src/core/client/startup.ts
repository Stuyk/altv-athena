// Client Plugins
import '../plugins/athena/client/imports';

// Commands
import './commands/rmlui';

// Events
import './events/connectionComplete';
import './events/disconnect';
import './events/keyup';
import './events/keyHeld';

// Interfaces - Always Load First
import './extensions/meta';
import './extensions/player';
import './extensions/vehicle';
// Menus
import './menus/animation';
import './menus/player';
import './menus/vehicle';

// rmlui
import './rmlui/fonts/index'; // Always load first...
import './rmlui/input/index';
import './rmlui/menu/index';
import './rmlui/menu3d/index';
import './rmlui/progressbar/index';
import './rmlui/question/index';
import './rmlui/sprites/index';
import './rmlui/staticText/index';

// Streamers
import './streamers/doors';
import './streamers/item';
import './streamers/marker';
import './streamers/object';
import './streamers/ped';
import './streamers/textlabel';
import './streamers/worldNotifications';

// Systems
import './systems/animations';
import './systems/arrest';
import './systems/attachable';
import './systems/athenaEvents';
import './systems/blip';
import './systems/cameraTarget';
import './systems/character';
import './systems/debug';
import './systems/disable';
import './systems/hologram';
import './systems/hud';
import './systems/interaction';
import './systems/interiors';
import './systems/job';
import './systems/jwt';
import './systems/meta';
import './systems/noclip';
import './systems/particle';
import './systems/progressBar';
import './systems/scenarios';
import './systems/sound';
import './systems/syncedMeta';
import './systems/tasks';
import './systems/tick';
import './systems/toolbar';
import './systems/vehicle';

// Utility
import './utility/cinematic';
import './utility/credits';
import './utility/entitySets';
import './utility/errorScreen';
import './utility/ipl';
import './utility/lerp';
import './utility/notification';
import './utility/polygonShape';
import './utility/reload';
import './utility/sandbox';
import './utility/screenshot';
import './utility/shard';
import './utility/spinner';
import './utility/missionText';

// Views
import './views/actions';
import './views/audio';
import './views/chat';
import './views/inventory';
import './views/job';
import './views/storage';
import './views/wheelMenu';
