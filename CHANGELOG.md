# Changelog

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