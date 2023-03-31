// Client Plugins
import '../plugins/athena/client/imports';

// Camera
import './camera/cinematic';
import './camera/gameplay';
import './camera/pedEdit';
import './camera/switch';

// Commands
import './commands/rmlui';

// Events
import './events/connectionComplete';
import './events/disconnect';
import './events/meta';
import './events/onInventoryUpdate';
import './events/onTicksStart';

// Interfaces - Always Load First
import './extensions/meta';
import './extensions/player';

// Menus
import './menus/animation';
import './menus/player';
import './menus/object';
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

import './screen/credits';
import './screen/errorScreen';
import './screen/missionText';
import './screen/marker';
import './screen/minimap';
import './screen/missionText';
import './screen/mouse';
import './screen/notification';
import './screen/particle';
import './screen/progressBar';
import './screen/scaleform';
import './screen/screenEffect';
import './screen/screenFade';
import './screen/shard';
import './screen/spinner';
import './screen/text';
import './screen/texture';
import './screen/timecycle';

// Streamers
import './streamers/attachable';
import './streamers/blip';
import './streamers/doors';
import './streamers/item';
import './streamers/marker';
import './streamers/object';
import './streamers/ped';
import './streamers/textlabel';
import './streamers/worldNotifications';

// Systems Default
import './systems/defaults/ammo';
import './systems/defaults/displayId';
import './systems/defaults/time';
import './systems/defaults/toolbar';

// Systems
import './systems/acceptDeclineEvent';
import './systems/adminControl';
import './systems/animations';
import './systems/arrest';
import './systems/athenaEvents';
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
import './systems/noclip';
import './systems/notification';
import './systems/playerConfig';
import './systems/sound';
import './systems/tasks';
import './systems/tick';
import './systems/vehicle';

// Utility
import './utility/entitySets';
import './utility/ipl';
import './utility/lerp';
import './utility/polygonShape';
import './utility/screenshot';
import './utility/scenarios';

// Webview
import './webview/index';
import './webview/page';

// Views
import './views/actions';
import './views/audio';
import './views/job';
import './views/wheelMenu';

// World
import './world/weather';
