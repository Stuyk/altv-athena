export enum SYSTEM_EVENTS {
    APPEND_BLIP = 'append:Blip',
    APPEND_MARKER = 'append:Marker',
    APPEND_TEXTLABELS = 'append:TextLabel',
    APPEND_OBJECT = 'append:Object',
    APPEND_PED = 'append:Ped',
    APPEND_WORLD_NOTIFICATION = 'append:WorldNotification',
    //
    BOOTUP_ENABLE_ENTRY = 'enable:Entry',
    // Check
    CHECK_CONNECTION = 'check:Connection',
    // Commands
    COMMANDS_LOADED = 'commands:Loaded',
    // Holograms
    HOLOGRAM_APPEND = 'hologram:Append',
    // Interior
    INTERIOR_SWITCH = 'interior:Switch',
    INTERIOR_SHOW_MENU = 'interior:Open:Menu',
    INTERIOR_TOGGLE_LOCK = 'interior:Toggle:Lock',
    INTERIOR_PURCHASE = 'interior:Purchase',
    INTERIOR_ENTER = 'interior:Enter',
    INTERIOR_EXIT = 'interior:Exit',
    INTERIOR_SET_NAME = 'interior:SetName',
    INTERIOR_SET_PRICE = 'interior:SetPrice',
    INTERIOR_STORAGE = 'interior:Storage',
    //
    INTERACTION = 'player:Interact',
    INTERACTION_ATM = 'atm:Open',
    INTERACTION_ATM_ACTION = 'atm:Action',
    INTERACTION_FUEL = 'fuel:Action',
    INTERACTION_JOB = 'job:Interaction',
    INTERACTION_JOB_ACTION = 'job:Action',
    // IPL
    IPL_LOAD = 'ipl:Load',
    IPL_UNLOAD = 'ipl:Unload',
    //
    META_SET = 'meta:Set',
    META_CHANGED = 'meta:Changed',
    //
    NOCLIP_UPDATE = 'noclip:Update',
    NOCLIP_RESET = 'noclip:Reset',
    //
    PLAYER_CUFF = 'player:Cuff',
    PLAYER_UNCUFF = 'player:Uncuff',
    //
    PLAYER_EMIT_ANIMATION = 'animation:Play',
    PLAYER_EMIT_SCENARIO = 'scenario:Play',
    PLAYER_EMIT_AUDIO_STREAM = 'audio:Stream',
    PLAYER_EMIT_CREDITS = 'credits:Create',
    PLAYER_EMIT_CREDITS_CLEAR = 'credits:Clear',
    PLAYER_EMIT_ERROR_SCREEN = 'errorScreen:Create',
    PLAYER_EMIT_ERROR_SCREEN_CLEAR = 'errorScreen:Clear',
    PLAYER_EMIT_SOUND_2D = 'sound:2D',
    PLAYER_EMIT_SOUND_3D = 'sound:3D',
    PLAYER_EMIT_FRONTEND_SOUND = 'sound:Frontend',
    PLAYER_EMIT_NOTIFICATION = 'notification:Show',
    PLAYER_EMIT_SPINNER = 'spinner:Show',
    PLAYER_EMIT_SPINNER_CLEAR = 'spinner:Clear',
    PLAYER_EMIT_SHARD = 'shard:Create',
    PLAYER_EMIT_SHARD_CLEAR = 'shard:Clear',
    PLAYER_EMIT_TASK_MOVE = 'task:Move',
    PLAYER_EMIT_TASK_TIMELINE = 'task:Timeline',
    PLAYER_EMIT_INVENTORY_NOTIFICATION = 'inventory:Notification',
    //
    PLAYER_RELOAD = 'player:ForceReload',
    //
    PLAYER_SET_FREEZE = 'freeze:Set',
    PLAYER_SET_DEATH = 'death:Toggle',
    PLAYER_SET_INTERACTION = 'interaction:Set',
    //
    PLAYER_TICK = 'player:Tick',
    //
    PLAYER_TOOLBAR_SET = 'player:Toolbar',
    PLAYER_ITEM_CHANGE = 'player:ItemChange',
    //
    PLAY_PARTICLE_EFFECT = 'ptfx:Play',
    PLAY_ANIMATION_FOR_PED = 'animation:PlayForPed',
    // Progress Bar
    PROGRESSBAR_CREATE = 'progressbar:Create',
    PROGRESSBAR_REMOVE = 'progressbar:Remove',
    //
    POPULATE_BLIPS = 'blips:Populate',
    POPULATE_MARKERS = 'markers:Populate',
    POPULATE_COMMANDS = 'commands:Populate',
    POPULATE_ITEMS = 'items:Populate',
    POPULATE_INTERACTIONS = 'interactions:Populate',
    POPULATE_TEXTLABELS = 'labels:Populate',
    POPULATE_OBJECTS = 'objects:Populate',
    POPULATE_PEDS = 'peds:Populate',
    POPULATE_WORLD_NOTIFICATIONS = 'worldNotifications:Populate',
    //
    QUICK_TOKEN_EMIT = 'quicktoken:Emit',
    QUICK_TOKEN_FETCH = 'quicktoken:Fetch',
    QUICK_TOKEN_NONE = 'quicktoken:None',
    QUICK_TOKEN_UPDATE = 'quicktoken:Update',
    //
    REMOVE_GLOBAL_OBJECT = 'remove:Global:Object',
    REMOVE_OBJECT = 'remove:Object',
    REMOVE_GLOBAL_PED = 'remove:Global:Object',
    REMOVE_PED = 'remove:Object',
    REMOVE_MARKER = 'remove:Marker',
    REMOVE_BLIP = 'remove:Blip',
    REMOVE_TEXTLABEL = 'remove:Textlabel',
    REMOVE_WORLD_NOTIFICATION = 'remove:WorldNotification',
    //
    SET_ACTION_MENU = 'actions:Set',
    SET_VIEW_URL = 'actions:SetViewURL',
    //
    SYNC_APPEARANCE = 'character:Appearance',
    SYNC_EQUIPMENT = 'character:Equipment',
    //
    TICKS_START = 'ticks:Start',
    //
    VEHICLES_VIEW_SPAWN = 'vehicles:Spawn',
    VEHICLES_VIEW_DESPAWN = 'vehicles:Despawn',
    //
    WORLD_UPDATE_TIME = 'time:Update',
    WORLD_UPDATE_WEATHER = 'weather:Update',
    //
    VOICE_ADD = 'voice:Add',
    VOICE_JOINED = 'voice:Joined',
    //
    WEBVIEW_INFO = 'webview:Info',
}
