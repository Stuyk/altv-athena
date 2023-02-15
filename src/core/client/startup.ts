// Client Plugins
import '../plugins/athena/client/imports';

// Commands
import './commands/rmlui';

// Events
import './events/connectionComplete';
import './events/disconnect';
import './events/onInventoryUpdate';
import './events/onTicksStart';

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

// Systems Default
import './systems/default/ammo';
import './systems/default/toolbar';

// Systems
import './systems/acceptDeclineEvent';
import './systems/animations';
import './systems/arrest';
import './systems/attachable';
import './systems/athenaEvents';
import './systems/blip';
import './systems/character';
import './systems/debug';
import './systems/disable';
import './systems/entitySelector';
import './systems/hotkeyRegistry';
import './systems/interaction';
import './systems/interiors';
import './systems/job';
import './systems/jwt';
import './systems/messenger';
import './systems/meta';
import './systems/noclip';
import './systems/particle';
import './systems/playerConfig';
import './systems/progressBar';
import './systems/scenarios';
import './systems/sound';
import './systems/syncedMeta';
import './systems/tasks';
import './systems/tick';
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
import './utility/sandbox';
import './utility/screenshot';
import './utility/shard';
import './utility/spinner';
import './utility/missionText';

// Views
import './views/actions';
import './views/audio';
import './views/job';
import './views/wheelMenu';
