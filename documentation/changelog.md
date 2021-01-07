---
description: List of all the changes and current versions.
---

# Changelog

## 1.0.8 - January 6, 2021

```diff
+ Added new development scripts for quick-reboot
+ Added new ares backend service support
+ Added simplified database loader
+ Other backend changes and configurations
+ Smooth Login Transitions
+ Smoother Leaderboards
+ Hide Scrollbar on View Instance Creation
+ Hide Screen Until Spawn
+ Fix Discard Character in Creation Screen
+ New Utility Functions
+ Filter Players by Permission
+ Filter Players by GridSpace
+ Move Weather and Time to Tick Event for Players
+ Change Roleplay Commands Filter Function
+ Add Get Position In Front for Player
```

## 1.0.6 - January 4-5, 2021

```diff
+ Added Missing Interiors
+ Leader Board / Player List
+ Created Player Specific Functions for Respawn Handling
+ Added Tick Event for Saving Often
+ Added Roleplay Command Configurations
+ Added Respawn Time Configuration (Under Shared Folder)
+ Added Respawn Health Config
+ Added Respawn Armour Config
+ Added Lose Weapons on Respawn Config
```

---

## 1.0.5 - January 2 - 3, 2021

```diff
+ Add Respawn Handler
+ Fix Respawn Command
+ Add Basic Voice
+ Fixed Linux Deployment for CopyFiles
+ Added Try/Catch to Disconnect Events
```

---

## 1.0.1-4 - Janauary 1, 2021

```diff
+ Fix Nametag Distance
+ Fix Nametag bug for replacing undefined variable.
+ Fix Character and Account Linking
+ Fix Dimension never set to 0 after login
+ Fix Character Rotation & Control During Input
+ Partially Fix Character Creator / Selection (Still a few bugs left)
+ NoClip (Early Implementation)
+ Started thinking about tracking versions.
+ Fix Black Screen on Early Connections
+ Prevent Early Connections
+ Added Warmup Event to Unlock Connecting
+ Added Time Synchronization
+ Switched Vue to Production
+ Adjust Load Order on Ares
+ Add Configurable Time to Configuration
+ Fixed Teleporting in Character Editor
+ Fixed Whisper Command not showing what you typed
+ Weather Patterns
+ Version Comparison for Athena and Ares
```

---

## 0.0.0 - December 30, 2020

```diff
~ Moved Prototypes to Seperate Files
~ Restructured Some Files / Folders
+ Fixed Permission Flag Checks
+ Added Permission Flags to Commands
+ Added Chat Colors
- Removed Unncessary Variables on Player
```

---

## 0.0.0 - December 29, 2020

```diff
- Removed Gulp Dependency
- Removed Yargs Dependency
+ Added Command Handler for Chat
+ Added Some Example Commands
+ Added Input Sanitization for HTML
+ Added `player.id` to Nearby Player Names
```

---

## 0.0.0 - December 28, 2020

```diff
+ Added Chat
+ Chat View
+ Configuration for Distance for Chat
+ Handful of Utility Functions
+ Preperations for Permissions
+ Preperations for Chat Commands
+ Ares Webhook for Boot Status
+ Ares Endpoints
```

## 0.0.0 - December 27, 2020

```diff
~ Expanded Ares Service
~ Fixed Bad Reconnect Issues
+ Introduced DEV_ID to '.env'. Put your Discord ID for quick local development / logins.
+ Fixed small error for alt:V Ares Reconnecting
+ Added Submodule Update to 'npm run update'
+ Added Authorization Log on Login
+ Added Duplicate Name Check for Characters
+ Added Nametags
```

---

## 0.0.0 - December 26, 2020

```diff
~ Fixed Rotation for New Character and Character Select
+ Finished Character Editor Design Updates
+ Character Creator now TPosing
+ Added Ares Service Support
+ Released License Keys for Athena
+ Launched Gumroad Product
```

---

## 0.0.0 - December 24, 2020

```diff
- Removed Login View
- Removed Express Server
- Removed Discord Developer App Need
- Removed Default Login
+ Added alt:V Ares Submodule
+ Login Dependent on Ares Discord Submodule
+ Partial Changes to Character Edit Screen
```

---

## 0.0.0 - December 21, 2020

```diff
~ Fixed by replacing alt.loadModel
~ Fixed by replacing native.setPlayerModel
+ Refactored Characters Interface
+ Refactored Creator Interface
+ Added Gender to Creator Interface
+ Added Age to Creator Interface
+ Moved /interfaces/Player to /extensions/Player
+ Moved /interfaces/Vehicle to /extension/Vehicle
+ Updated README.md with Folder Information
```

---

## 0.0.0 - October - December, 2020

```diff
- Realized I was burnt out.
```

---

## 0.0.0 - August - October 2020

```diff
+ oAuth2 Service
+ View Extensions
+ Player Extensions
+ Vehicle Extensions
+ Creator View
+ Characters View
+ Login View
+ Initial Vehicle System
+ Defined Interfaces for Future Usage
```
