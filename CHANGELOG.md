# Changelog

## 5.0.0

```
- Fixed Character Select Event Bug
- Added in-game editor for debug mode / admins
--- Command is /editor
- Fixed restrict function
- Athena.player.teleport
- Athena.player.appearance.setHeadBlendData
- Athena.player.appearance.setSkin
- Athena.player.appearance.clearSkin
- Added automatic character document synchronization to WebViews
--- Available as a prop, or from the "import * as state from '@utility/state';" export
- Athena.player.inventory.getAt - Fixed Type Definition
- Athena.player.toolbar.getAt - Fixed Type Definition
- AthenaClient.systems.inventory.get
- AthenaClient.systems.inventory.get.toolbar
- AthenaClient.systems.inventory.get.inventory
- AthenaClient.systems.inventory.get.totalWeight
- AthenaClient.systems.inventory.get.onInventoryChange
- AthenaClient.systems.inventory.get.onToolbarChange
- AthenaClient.systems.inventory.get.onWeightChange

- import * as state from '@ViewUtility/state'
- This allows you to get character, or account info in the view easily.
- Alternatively use a Vue Prop with 'state' or 'accountData'.
- state.get
- state.set
- state.getAccountData
- state.getAccountPermissions
- state.getCharacterData
- state.getCharacterPermissions

- Athena.vehicle.tuning.getMods
- Athena.vehicle.tuning.applyMods

Overrides -> src/core/client/cameras/cinematic
Overrides -> src/core/client/cameras/gameplay
Overrides -> src/core/client/cameras/pedEdit
Overrides -> src/core/client/cameras/switch
Overrides -> src/core/client/rmlui/commands/index
Overrides -> src/core/client/menus/npc
Overrides -> src/core/client/menus/object
Overrides -> src/core/client/menus/player
Overrides -> src/core/client/menus/vehicle

Athena.systems.inventory.convert.toBaseItem
Athena.systems.inventory.convert.toItem
Athena.systems.inventory.convert.toStoredItem

Fix Various Weight Related Bugs
Fix commands using non-string types

Fix Escape on Menu Close for RMLUI Menu

Athena.systems.inventory.factory.getBaseItemsAsync
Athena.systems.inventory.factory.getBaseItems

AthenaClient.systems.playerConfig.get('account-data') : Returns Filtered Account Data
AthenaClient.systems.playerConfig.get('character-data') : Returns Character Data

Athena.systems.rpc.invoke
AthenaClient.systems.rpc.on

Fix Vehicle Checks for Jobs

Storage System Overrides

--------------------------------------
--- Everything Below is Before April 2
--------------------------------------

Major Breaking Changes
---> These changes reflect a larger set of changes that will be occuring to the framework during the 5.0.0 release window.
---> These changes are necessary to scale the framework more and lower the complexity of the framework further.
- Removed Inventory
- Removed Equipment
- Removed Toolbar
- Removed Storage System
- Removed Vehicle Keys
- Removed Holograms
- Removed CameraTarget
- Updated Object Wheel Menu

Death
- Added default death system to help decouple framework from opinionated systems.
- Removed default death plugin and moved to the Athena Framework Plugin organization.
- Athena.systems.default.death.disable() -> Used to disable default Death System.
- Default death automatically respawns a player at the closest hospital after 5 seconds.

Time
- Removed world time system.
- Added default world time system based on server time.
- Athena.systems.default.time.disable() -> Used to disable default Time System.
- Athena.systems.default.time.getHour()
- Athena.systems.default.time.getMinute()

Weather
- Removed weather plugin commands. Removed weather system.
- Added default weather system.
- Athena.systems.default.weather.disable() -> Disabled all weather & weather sync.
- Added getWeatherFromString() function to get a numbered value from a weather string.
- Athena.systems.default.weather.getCurrentWeather() -> Can return number, or string value

Attachables
- Fixed alt.Object.getByID bug; replaced with proper find.

StateManager (Removed)
- Completely removed and replaced with Document Based State Management
- Why? The limitations of complexity of this system were overdone.
- The following changes below are more responsive and much easier to understand.

Athena.document.character
- A 'character' specific document with individual state updates for all interface values.
- Includes better extendability for core interfaces through generic types.
- Adds functions: get, getField, set, setBulk, onChange
- Fixed small issue with references

Athena.document.vehicle
- A 'vehicle' specific document with individual state updates for all interface values.
- Includes better extendability for core interfaces through generic types.
- Adds functions: get, getField, set, setBulk, onChange

Athena.player.save (Removed)
- Removed this in favor of the above changes (Athena.document.character)
- Moved the onTick function to the onTick file, and exposed with export.

Currency
- Updated currency logic to allow old / new value watching.
- Uses new document system to log new / old data changes.
- Removes direct modifiction of player.data.x
- Added Custom Currency Type Support

Chat
- Began moving chat into its own self-contained plugin.
- Removed decorator system.
- Chat Vue interface reworked with lots of individual configurations.
- Added pgup/pgdn controls for pagination
- Began work on input rmlui for commands / text inputs
- Finished command suggestions above input box
- Created new command input rmlui option
- Created message history in command input
- TAB -> AutoFills with bottom command.
- UP -> Goes to previously sent message or command
- Down -> Navigates to previously sent messages, or fills with empty message
- Known Issue: Input Caret does not go to the end of the input box. There is nothing that can be done to fix this currently.

Permission System
- Began refactor on permission system to use array of 'strings' to assign permissions.
- Allows a player to have multiple permissions such as: ['admin', 'moderator']
- No hierarchy will be created, and simply appending / removing these strings will enable / disable commands.
- Character Permissions
-- addPerm - Adds a permission to a player's account.
-- removePerm - Removes a permission from a player's account.
-- has - Check if a player has a permission given a string.
-- hasOne - Check if a player has at least one permission given an array of strings.
-- hasAll - Check if a player has all permissions given an array of strings.
-- clear - Clears all permissions associated with a player.
- Account Permissions
-- addPerm - Adds a permission to a player's account.
-- removePerm - Removes a permission from a player's account.
-- has - Check if a player has a permission given a string.
-- hasOne - Check if a player has at least one permission given an array of strings.
-- hasAll - Check if a player has all permissions given an array of strings.
-- clear - Clears all permissions associated with a player.

Messenger System
- Handles messages to be sent to some form of chat system.
- Allows for client-side, and server-side callbacks to handle messages sent between players and server and client.
- By default the messenger system will simply log to console if no chat systems are registered with Athena.
-- This also applies to client-side.
- Command logic being reworked to get more in-depth responses about what may be missing from a command based on args passed.
- Command logic works with new permission system stated above.
- Old permissions system is being deprecated.
- Added timestamps to client-side message history.
- Added a client history callback listener.
- Added way to differentiate between a character permission command, and an account permission command
- By default all commands use account permissions

Getters
- Added Athena.get.players.inRangeWithDistance - Returns players and their distance from a position.

Refactors
- Update existing code base to use new Athena.document APIs

Vue Dev Menu
- Added 'Hide' Button
- Added 'Hide on Refresh' Button

Item Interface
- Initial Type Definitions & Design

Item Factory
- Created Initial Item Factory Functions
- Created way to upsert new items into Item Factory
- Created way to obtain a 'base item' from the Item Factory
- Created a way to convert a 'stored item' from the Item Factory into a 'full item'
- Created a way to convert a 'full item' from the Item Factory into a 'stored item'
- Created weight calculations when using these functions

Item Manager
- Created Item Manager Functions
-- quantity
--- add - Adds a quantity to an item. If it exceeds max stack size; it returns remaining amount.
--- sub - Removes quantity from an item. If the amount exceeds available. It returns remaining not removed.
-- data
--- upsert - appends data to the existing item.data field
--- set - completely overwrites the item.data field
--- clear - completely clears the item.data field and sets it to an empty object
-- inventory
--- add - Adds an item amount to an inventory given an array size, creates new items automatically.  Returns undefined if invalid.
--- sub - Subs an item amount from an inventory. Returns undefined if invalid.
--- getFreeSlot - Determines a free slot given an array size
- Weight Configurations
- Inventory Size Configurations
- Weight Calculation / Auto-restrictions

Item Effects
- Reworked to support new API

Plugin System
- Added ability to append a callback to initialize a function after all plugins have loaded.
- This resolves an issue with top-level 'Athena' API usage.
- Used like: Athena.systems.plugins.addCallback(() => {})

Inventory - Default System
- Adds synchronization for inventory and toolbar data.
- This can be disabled through the system defaults API if necessary.
- Fixed small bug with synchronization that would only sync one data value instead of both.

Inventory Plugin
- Hooked up a majority of the functionality.
- Made some general design changes such as quantity displayed.
- Added context menu option for give.
- Added some better handling for some events on client-side.
- Hooked up main swapping / stacking logic when dragging.
- Added sounds for opening / closing inventory
- Added sound for moving an item
- Added item combining for crafting
- Enable movement while inventory is open

Event for SYSTEM_EVENTS.TICKS_START
- Removed all default usages.
- Introduced an API that can be called on client-side to auto-append callbacks.
- onTicksStart.add(() => {});
- Makes it much easier to understand what is happening.

WebView Related
- Added WebViewEvents.playSound - Play custom sounds from any page.
- Added Generic Type Support for Event Names
- Added method to register a page that disables the default 'escape to close' behavior.
- Added WebViewEvents.playSoundFrontend - Play native sounds from WebView call.
- Added Athena.webview.closePages - Allows closing all pages, if non are specified, or closing specific pages if pages are specified.

Weapon Items List
- Added a default plugin that auto-appends a weapon item list to the database.

Player Config
- Player config uses the player.setLocalMeta internally.
- However, this wraps around the event to provide type safety and Athena specific events easily.
- On client-side values can be listened to for changes; which you can do whatever you need with it.

Item Crafting
- Introduced an item crafting recipe handler.
- Combine any two items to return a new item.
- Data can be appended to the new item from the old items if necessary.
- Custom sound returned after crafting an item successfully.

Item Weapons
- Weapons can be handed to a player through their dbnames.
- Component hashes can be appended to `item.data.components`
- Components are automatically equipped when the weapon is equipped.

Item Clothing
- The old clothing system was thrown out.
- New clothing system uses the alt:V dlc info entirely for the outfits.
- New clothing items allow for an unlimited amount of components to be combined into a single item.
- New clothing items allow for priority in inventory. The last item in the inventory overwrites any items before it.

Item Drops
- Added item drop streamer
- Added alt.Object support
- Added item models for all weapons

Uniforms
- Uniforms allow for existing clothing to be equipped, and then outfits are overwritten last.
- Athena.systems.itemClothing.uniform.set
- Athena.systems.itemClothing.uniform.clear

Skins
- Skins allow for the player model to be completely overwritten.
- All appearance, and clothing synchronization will be ignored while a skin is set.
- Athena.systems.itemClothing.skin.set
- Athena.systems.itemClothing.skin.clear

Ammunition
- Added a default ammunition system
- Can be disabled through Athena.systems.default.ammo
- Use the item 'ammo-box' and apply it to a weapon to give it ammo.
- Ammo is tracked per individual weapon.

Clothing Crafting
- Individual clothing items can be combined.
- This can be done by using two clothing items together.

Ares
- Deprecated

Discord Login
- Integrated auth.athenaframework.com
- Utilizes this repository: https://github.com/Stuyk/discord-oauth2-service
- Added configuration options to easily change the URL

Entity Selector (Formally cameraTarget)
- Removed old cameraTarget code
- Opted in for Tabbable Entity Selection
- Hold Tab to turn on Entity Selection
- Tab Tab to cycle through closest entities
- EntitySelector.isSelecting() - Checks if the local player has entity selection turned on
- EntitySelector.get.selection() - Returns current selection
- EntitySelector.get.selectables() - Returns the array of entities the player can select from currently
- EntitySelector.set.alwaysOn() - Forces the entity selector to only allow selecting closest to the player
- EntitySelector.set.markerOff() - Turns off the marker that shows above entities
- EntitySelector.set.markerColor() - Change the marker color
- EntitySelector.set.markerSize() - Change the marker size

Hotkey Registry
- Literally better hotkeys in every shape and form
- Key Up / Key Down
- Trigger an everyTick while key is held down
- Trigger a delayed function if key is held down for specified milliseconds
- Trigger only in a certain vehicle model
- Trigger only in the water
- Trigger only while aiming
- Trigger only while wielding a specific weapon
- Trigger only as the driver of a vehicle
- Trigger only as the passenger of a vehicle
- Trigger only when in a vehicle
- Trigger only when on foot
- Option to allow the keybind while in any page menu
- Ability to enable / disable a keybind through the API
- Key Modifiers - Shift, Alt, CTRL

Vehicle System
- Removed VehicleFuncs
- Removed Old Vehicle System
- Added New Pathway (Athena.vehicle.x)
- Vehicle ownership is character _id
- Added permissions to vehicle ownership
- Added ability to add characters to vehicle keys
- Added functions to add / remove characters to keys
- Differentiated ownership from keys
- Updated vehicle controller on client-side
- Updated vehicle controller on server-side
- Updated vehicle document

Spawn Vehicles on Join
- Added default system that spawns player owned vehicles on join
- Added way to disable this system

Spawn Vehicles on Leave
- Added defaulty system that despawns vehicles on leave
- Added way to disable this system

Began Deprecation of src/core/athena/main.ts File

Admin System
- First account created always gets 'admin' permission by default
- /addperm [account or character] [ingame-id] [permission] - Add permission to an account
- /removeperm [account or character] [ingame-id] [permission] - Remove permission from an account
- /getperms [account or character] [ingame-id] - Returns the current list of permissions for given type

Display ID
- Added default system to show ID in top-right of screen.
- Can be disabled through Athena.systems.defaults.displayId.disable()
- Can be customized to move position elsewhere through similar API as above

Athena.player.appearance
- These are all new utility functions to help with updating player appearance
- setHair
- setFacialHair
- setEyebrows
- setEyeColor
- setModel
- updateTattoos

Athena.utility.restrict
- Used to make ANY function permission restricted for a given player.
- Easily wrap a function, or a event and restrict it.
- Allows for notifying the user if the function is restricted.

Notification System
- Default uses GTA:V notification system.
- New overrides on client-side to turn off default behavior.
- Can add callbacks to intercept notification messages, and do something else with it

Added Admin Control System
- Allows an easy way to identify admin permissions on client-side
- Allows invoking admin functionality from client-side
- Invoked callbacks on server-side are automatically checked
- Athena.systems.adminControl.x

Group Permissions
- Group permissions let you add grouping structure to any document.
- Documents can then be compared to check for similarities.
- Group permissions allow for an easy way to gate access to specific objects based on permissions.
- This system is good for police, doors, vehicle access, etc.
- If a player and a vehicle have matching group permissions the player is given access.
- Athena.systems.permissionGroup.addGroupPerm
- Athena.systems.permissionGroup.hasAtLeastOneGroupPerm
- Athena.systems.permissionGroup.hasCommonPermission
- Athena.systems.permissionGroup.hasGroup
- Athena.systems.permissionGroup.hasGroupPerm
- Athena.systems.permissionGroup.removeGroup
- Athena.systems.permissionGroup.removeGroupPerm

Permission for Vehicle / Player
- Athena.player.permission.addGroupPerm
- Athena.player.permission.addPermission
- Athena.player.permission.hasAccountPermission
- Athena.player.permission.hasCommonGroupPermission
- Athena.player.permission.hasGroupPermission
- Athena.player.permission.hasPermission
- Athena.player.permission.removePermission
- Athena.vehicle.permissions.addGroupPerm
- Athena.vehicle.permissions.hasCommonGroupPermission
- Athena.vehicle.permissions.hasGroupPermission

Discord Login
- Deprecated Web Service Based Authentication
- Moved into alt:V Provided APIs
- Starting Sunset of V4/V5 Discord Authentication with External APIs
```


## 4.0.0

```
Stripped out almost all unnecessary plugins. This is a move to slim down the framework.
All original plugins can be found on Stuyk's GitHub.
Updated Text Labels to Include 'update' function. Works for player or global text labels.
Update Object Streamer to Include 'updatePosition' function. Works for player or global objects.
Fix passing _id as a partial object for vehicle saving.
Migrate playerFuncs.emit.meta to player.setLocalMeta #292
Fix bug where chat could potentially cause respawn by typing 'x' when respawn is ready.
streamers/object.ts -> Converted to const
streamers/ped.ts -> Converted to const
streamers/marker.ts -> Converted to const
streamers/item.ts -> Converted to const
streamers/textlabel.ts -> Converted to const
streamers/worldNotifications.ts -> Converted to const
Added Custom Path Resolver
@AthenaServer -> src/core/server
@AthenaClient -> src/core/client
@AthenaShared -> src/core/shared
@AthenaPlugins -> src/core/plugins
Refactored plugins to use path resolving
Removed all 'tsconfig.json' files from all plugins/*/webview -> No longer necessary
Added additional path aliases for WebView based components and shared files.
WebView path resolver additional alias. '@AthenaPlugins/images/my-plugin-name/some-image.png'
Added Toggleable Vue Dev Menu with State Restoring. Removed Default Pages for Vue Dev.
RMLUI based progress bar -> AthenaClient.rmlui.progressBar
RMLUI based input box -> AthenaClient.rmlui.inputBox
Added Athena.utility.isEntityBlockingPosition
Used isEntityBlockingPosition in Sprites, and Progress Bars. Lowers opacity when something is in the way.
Deprecate Shared Vector3 & Vector2 Interface for alt.IVector3
RMLUI based question box with accept/decline -> AthenaClient.rmlui.questionBox
Add bar color to RMLUI progress bar background
Add text percentage to RMLUI progress bar
Add sounds to Question Box
RMLUI based menu similar to NativeUI -> AthenaClient.rmlui.menu
Added console command in-client in debug mode: 'rmluicontrols'
Change sprite interface for RMLUI to be 3D only
Fix TextLabel update bug 
RMLUI based 3D in-world menu -> AthenaClient.rmlui.menu3D
AthenaClient.webview.page -> A page constructor made easy.
AthenaClient.spinner -> AthenaClient.screen.spinner
AthenaClient.shard -> AthenaClient.screen.shard
AthenaClient.minimap -> AthenaClient.screen.minimap
AthenaClient.notification -> AthenaClient.screen.notification
AthenaClient.menus -> AthenaClient.wheelMenus
/toggledoor -> Toggle closest door to the player
Added Door State Streaming Service
Added Door State Saving to Database -> Collection: 'doorstates'
```

## 3.9.0

```
Initialized 3.9.0
Fix Tab Defocus in Chat
Fix Athena.get.player.byName name issues
Add Athena.get.player.byPartialName
Add Athena.get.player.characters - Get all player account characters
Add Athena.get.player.closestToPlayer - Get closest player from player
Add Athena.get.player.closestToVehicle - Get closest player from vehicle
Add Athena.get.vehicle.closestToPlayer - Get closest vehicle from player
Add Athena.get.vehicle.closestToVehicle - Get closest vehicle from vehicle
Add AthenaClient.menus.vehicle.add - Add a modified option to the vehicle wheel menu.
Add AthenaClient.menus.player.add - Add a modified option to the player wheel menu.
Add AthenaClient.menus.object.add - Add a modified option to the object wheel menu.
Add AthenaClient.menus.ped.add - Add a modified option to the ped wheel menu.
Add Athena.systems.job.addJobCheck - Add custom criteria, or types to the global job options.
Add Athena.systems.job.getPlayerJob - Get a player's current job if they are doing a job.
Add Athena.systems.job.cloneObjective - Used to clone an objective cleanly.
Add Athena.systems.job.instance - Used to create a new job instance. ie. new Athena.systems.job.instance()
Add Athena.get.player.closestOwnedVehicle - Gets the closest owned vehicle for a player.
Add Athena.data.vehicles - This is the VehicleData from the shared folder. Instanced to the server-side.
Add AthenaClient.data.vehicles - This is the VehicleData from the shared folder. Instanced to the client-side.
Add Athena.data.vendingMachines - This is the vending machines from the shared folder. Instanced to the server-side.
Add AthenaClient.data.vendingMachines - This is the vending machines from the shared folder. Instanced to the client-side.
Add Athena.data.atms - This is the atms from the shared folder. Instanced to the server-side.
Add AthenaClient.data.atms - This is the atms from the shared folder. Instanced to the client-side.
Add undefined entity check for storage view system.
Add Athena.systems.world.setWeatherRotation - Overrides the current weather rotation entirely.
Fix streamer showing streamed items globablly if dimension set to zero. If set to undefined now, it shows globally.
Mark Objects in Streamer as Mission Entities when being deleted; then flag as no longer needed.
Add AthenaClient.events.keyHeld -> Add functionality to a key when it is held down.
Add AthenaClient.events.keyBinds -> Add KeyBinds to the main AthenaClient API.
Move z-index of chat-wrapper to 98; and move dev menu to 99 for localhost
Added AthenaClient.sprite -> Stream .png images in-world based on position with auto-scaling.
Created 'example-sprite' plugin for code references.
AthenaClient.camera.target -> Used for the [E] interactions you see in-world
AthenaClient.camera.target.addIgnoredEntity -> Lets you specify an entity handle to ignore interactions with
AthenaClient.camera.target.removeIgnoredEntity -> Lets you specify an entity handle to remove from ignored interactions
Updated Vehicle List -> Now Includes Fuel Types 
Updated Fuel Stations to Specify Fuel Amount
Interactions now display in-world descriptions
Character Select does switch-out-switch-in
Blip categories in Blip Interface
German Locale File
VEHICLE_ENGINE_OFF in JobCriteria -> Requires engine to be off at a job point
Fixed Fuel Station not recognizing a player when leaving a vehicle to fuel
Various Static Class to Const Conversions
Restrict Inventory Drops to Dimension
Object menu now passes item information, if it is an item
Fix strange compatability issue with esbuild
Athena.player.emit.createMissionText -> Draws a subtitle in the center bottom of the screen for a given time.
Ability to set database name through configuration
Job.addQuitCallback -> Adds a way to call a function when a job is quit.
Add Skycam
Add Option to Skycam to disable skycam when debug is on. Character select plugin.
Fix Skycam Option
Fix bug where when dead the client can still invoke key press to revive even though already revived.
Patch Garage Not Closing on Vehicle Spawn
```

## 3.8.0

```
Initialized 3.8.0
Changed Chat Input to not use `Input.vue` which causes issues with overlays
Fixed small bugs revolving around old imports for login views
```

## 3.7.0

```
Fix Barbershop Warnings
Add Catch for Camera Destroy Failure for Barbershop
Remove Barbershop Console Logs
Began Building New Inventory Functionality
Added Path Resolving for New Folders in Plugins (icons, sounds, webview/images, webview/videos)
Added New Functionality to Job Objectives
--> callbackOnCheck (function) - Calls on objective check
--> onlyCallbackCheck (true/fase) - Turn default checks on/off for this objective
--> job.addNextObjective - Inserts a new objective in front of all other objectives
Added Time Elapsed to Job
--> getElapsedMilliseconds
Added Interaction on Enter Boolean to Interactions
--> interaction.triggerCallbackOnEnter
--> Automatically triggers the callback when a player enters the interaction space
Added Interaction Leave Callback to Interactions
--> interaction.onLeaveCallback
--> Triggers when a player leaves a matching ColShape
Added Overrides to Athena.systems.identifier
Added Overrides to Athena.systems.storage
Added Overrides to systems/character.ts
Abstracted Account System
Added Overrides for systems/account.ts
Patch Legacy account_id issues
Getter Functions Added
Athena.get.player.byAccount
Athena.get.player.byName
Athena.get.player.byDatabaseID
Athena.get.player.byID
Athena.get.players.online
Athena.get.players.inRange
Athena.get.players.withName
Athena.get.players.driving
Athena.get.players.walking
Athena.get.players.drivingSpecificModel
Athena.get.vehicle.byID
Athena.get.vehicle.byDatabaseID
Athena.get.vehicle.isValidModel
Athena.get.vehicles.inRange
Athena.get.vehicle.inFrontOf - Return vehicle in front of an entity
Athena.get.player.inFrontOf - Return player in front of a player
Athena.get.world.positionIsClear - Return if a position in the world is free of vehicles or players
Athena.get.vehicle.inRange - Check if a vehicle is in range of a position
Athena.get.player.inRange - Check if a player is in range of a position
Athena.get.world.isInOceanWater - Check if a player or vehicle is in ocean water
Athena.get.player.waypoint - Get a player's current waypoint
Athena.get.players.inVehicle - Get all player's in a given vehicle
Athena.get.vehicle.passengers - Get passengers of a given vehicle
Athena.get.vehicle.driver - Simply returns the vehicle.driver
Changed ocean water level check to 0.5 to catch when a player is just dipping their toes into the water
Changed some console.logs to alt.logs
Turned Discord Login into a Plugin
Moved Quick Token to JWT Based
Made JWT Based Service in Core
Introduced Rotating JWT Secret Sign Service
Forced Login to Use 1 Agenda Slot
Replace alt.emitClient(null) with alt.emitAllClients
Added MailService Plugin
--> Uses NodeMailer
--> Provides Basic Configuration
--> Can Send Basic Email
--> Example Provided in Plugin Initializer
```

## 3.6.0

```
Refactoring for Strict Typing Support (WIP)
Changed Icon !important Strictness in src-webviews
Fix Female Barbershop Error
Redesigned Core HUD
+ Added Player ID
+ Added F2 to Cycle HUD Displays
+ Added Death State to Core HUD Updates
+ Added Player ID to Core HUD Updates
```

## 3.5.0

```
Introduced injection system
Moved character.ts system injections to injection system
Add a 'sound' api to Athena.systems
Moved final character create function to core, and added injection.
Character create injection document
Disallow special characters in folder path. Very specific error.
Fixed Voice Plugin
Added events for WebView to Server and Server to WebView communication
Moved pages management to client-side for views
Regular pages can have an auto-close feature with `escape` key press.
Updated pages to reflect changes above
Added Weapon Change Injections
Added Weapon Swap Player Event
Added Athena.events
Fix Weapon Switch Bug
Set All Weapon Ammo to 0 on Weapon Switch
Fix Faction Kick Member Kicking Random User
```