# Changelog


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