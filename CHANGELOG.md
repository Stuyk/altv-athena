# Changelog

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