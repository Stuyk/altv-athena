// Client Plugins
import '../plugins/athena/client/imports.js';

// Camera
import './camera/cinematic.js';
import './camera/gameplay.js';
import './camera/pedEdit.js';
import './camera/switch.js';

// Commands
import './commands/rmlui.js';

// Controllers
import './controllers/dynamicDoor.js';

// Events
import './events/connectionComplete.js';
import './events/disconnect.js';
import './events/meta.js';
import './events/onInventoryUpdate.js';
import './events/onTicksStart.js';

// Interfaces - Always Load First
import './extensions/meta.js';
import './extensions/player.js';

// Menus
import './menus/animation.js';
import './menus/player.js';
import './menus/object.js';
import './menus/vehicle.js';

// rmlui
import './rmlui/fonts/index.js'; // Always load first...
import './rmlui/input/index.js';
import './rmlui/menu/index.js';
import './rmlui/menu3d/index.js';
import './rmlui/progressbar/index.js';
import './rmlui/question/index.js';
import './rmlui/sprites/index.js';
import './rmlui/staticText/index.js';

import './screen/credits.js';
import './screen/errorScreen.js';
import './screen/missionText.js';
import './screen/marker.js';
import './screen/minimap.js';
import './screen/missionText.js';
import './screen/mouse.js';
import './screen/notification.js';
import './screen/particle.js';
import './screen/progressBar.js';
import './screen/scaleform.js';
import './screen/screenEffect.js';
import './screen/screenFade.js';
import './screen/shard.js';
import './screen/spinner.js';
import './screen/text.js';
import './screen/texture.js';
import './screen/timecycle.js';

// Streamers
import './streamers/attachable.js';
import './streamers/blip.js';
import './streamers/doors.js';
import './streamers/item.js';
import './streamers/marker.js';
import './streamers/markerVirtual.js';
import './streamers/object.js';
import './streamers/ped.js';
import './streamers/pedVirtual.js';
import './streamers/textlabel.js';
import './streamers/textLabelVirtual.js';
import './streamers/worldNotifications.js';
import './streamers/worldNotificationsVirtual.js';

// Systems Default
import './systems/defaults/displayId.js';
import './systems/defaults/time.js';
import './systems/defaults/toolbar.js';

// Systems
import './systems/acceptDeclineEvent.js';
import './systems/adminControl.js';
import './systems/animations.js';
import './systems/arrest.js';
import './systems/athenaEvents.js';
import './systems/character.js';
import './systems/debug.js';
import './systems/disable.js';
import './systems/entitySelector.js';
import './systems/hotkeyRegistry.js';
import './systems/interaction.js';
import './systems/interiors.js';
import './systems/job.js';
import './systems/jwt.js';
import './systems/messenger.js';
import './systems/noclip.js';
import './systems/notification.js';
import './systems/playerConfig.js';
import './systems/sound.js';
import './systems/tasks.js';
import './systems/tick.js';
import './systems/vehicle.js';

// Utility
import './utility/entitySets.js';
import './utility/ipl.js';
import './utility/lerp.js';
import './utility/polygonShape.js';
import './utility/screenshot.js';
import './utility/scenarios.js';

// Webview
import './webview/index.js';
import './webview/page.js';

// Views
import './views/actions.js';
import './views/audio.js';
import './views/job.js';
import './views/wheelMenu.js';

// World
import './world/weather.js';
