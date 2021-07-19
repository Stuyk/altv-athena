---
description: List of all the changes and current versions.
---

# Changelog

## 2.0.1
```diff
+ Add Client Console Command for 'timerinfo'
+ Prints the total amount of Timers and their Millisecond Interval
+ Bound all Intervals to Timer.createTimer to track Timers
+ Fixed falling through map with tpwp with native.clearFocus
+ Fixed small progress bar bug
+ Added Average Time for Interval Completion(s)
+ Added Ability to Exit Locked Motorcycles
+ Added Temporary Vehicle Flag for Vehicles
+ Temporary Vehicles Deleted after first driver exit
+ Added Death Logs to Console
+ Ensure Player Respawn for Death Logs
+ Update Discord.js Version
+ Fix Discord Whitelisting
+ Create Reliable Discord Whitelisting by User Comparison
+ Moved Attaching Server Side for Pushing
+ Detach Player when Entering Vehicle
+ Pushing Vehicle Moved to Own System
+ Pushing Vehicle Server-Side State
+ Entering Vehicle After Pushing Fixed
+ No More Pushing Inside Vehicle
```

## 2.0.0
```diff
+ New Keybind Interface for Custom Keybinds
+ Added Register Keybind
+ Applied Existing Keybinds to Register Keybind
+ Added ScreenText Class
+ Added New Help Text Interface
+ Fix Slide Up Animation for ATM
+ Hide Help Text in Menus
+ Fixed Outline Color for Buttons
+ Added 'Escape' to leave ATM menu.
+ Built New Interaction Interface
+ Made Interactions Much Simpler
+ Increased Build Times
+ Using SWC to transpile Typescript Faster
+ Replaced SimplyMongo with EzMongoDB
+ Rebuilt Vehicle Handler
+ Simplify Interaction(s) through Server-Side Routing Only
+ Interactions now use Callback Functions
+ Changed Entering Vehicle to 'F' Only
+ Entering Vehicle Always Finds First Seat
+ Removed Bad Phone
+ Removed All Phone Integrations
+ Removed Broken Interior System
+ Added Character Permission System
+ Character Permissions are Linked to Individual Characters
+ Character Permissions work with Commands
+ New Command Type: CharacterCommand
+ Removed Broken YouTube Audio Stream(s)
+ Prune Decimals for Character Selection
+ Added Server Time for World Time
+ Added WebServer for Faster Development Times
+ Removed Interfaces from Core Resource
+ Interfaces Moved to WebView Resource
+ Images Removed from Core
+ Moved All Images, SVGs, and Audio to utility/webserver
+ Moving Images Resulted in Faster Boot Times
+ Require Port 9111 for WebServer
+ Added Missing Locales for Chat Responses
+ Added Initial Garage Implementation
+ Added Garage Interface
+ Added Garage Vehicle Type Filtering
+ Added Garage Parking Spot Shuffler
+ Added Markers to Garage Positions
+ Added Separate Files for Garage Parking Spots
+ Increased Max Spawned Vehicles to 3 by Default
+ Added Configuration for Max Spawned Vehicles
+ Removed WebView HUD
+ Added Dynamic HUD for Natives
+ Fixed Fuel Synced Meta
+ Added Position for Synced Meta for Vehicles
+ Fixed Entering / Exiting Vehicle while Typing
+ Added Lock State for HUD
+ Added Time to HUD
+ Added Wanted Level(s)
+ Update Interface Names
+ Repair Broken Clothing Stores
+ Repair Broken Fuel Pumps
+ Remove Vending Machine Blips
+ Move Blip Lists Server Side
+ Added /tpwp - Teleport to a Waypoint
+ Better Handling
+ Added Dynamic Wheel Menu
+ Added Animation through Wheel Menu
+ Added New Keybind for Animations 'J'
+ Added New Keybind for Vehicle Options 'U'
+ Added Ability to Push Vehicle Synchronized
+ Fix Broken Natives
+ Fix Chat Escape Bug
+ Fix Chat Focus Problems
+ Fix Chat Delay Issues
+ Add Physical Dealership Location
+ Add Holograms System
+ Add Dealership Interface
+ Added Purchasing Vehicles from Dynamic Dealerships
```

## 1.8.2 - April 19 - May 14, 2021

```diff
+ Added Interior Architecture
+ Added Basic Interior Commands for Admins
+ Added /coords command for Admins
+ Increased Build Times
+ Added Refresh / Auto Join for Scripting
+ Added Blip Route for Vehicles in Job Framework
+ Added Stack Inventory Function
+ Updated ATM Interface
+ Added Locale Support for ATM WebView
+ Added Hours Play Statistic
+ Added Hours to Character Selection Screen
+ Updated Characters Interface
+ Added Locale Support for Characters WebView
+ Updated Character Creator Interface (Big Change)
+ Added Locale Support for Creator Interface (Big Change)
+ Removed LESS library from some Interfaces
+ Added Frontend Sounds to Various Interfaces
+ Added Locales for Job Panel
+ Updated Job Panel Design Slightly
+ Updated Inventory Design
+ Added Locales for Inventory
+ Added Right-Click Pickup for Ground Items
+ Added Fancy Animations for Inventory
+ Updated Clothing Design
+ Added Locales for Clothing Interface
+ Improved Clothing Interface Responsiveness
+ Hide HUD when in Clothing Menu
+ Added Partial French Translation
+ Removed need for altv-ares submodule
+ Added New Login Screen
+ Added Locales to Login Screen
+ Added Sounds to Login Screen
+ Removed Help Menu in Top Left
+ Removed Interaction Toggle
+ Interactions Always On
+ Moved Help Text to be Object Orientated
+ Added other help text options.
+ Added Locales for Interactions.
```

## 1.8.1 - April 8-18, 2021

```diff
+ Scaled Down Phone Slightly
+ Fixed Bad Alignment on Phone Icons
+ Added Timeout to Finish Authorization Button (3 Seconds)
+ Fixed Fuel Cash Decimal Overflow
+ Disable Attacks while Phone is in Use
+ Disable Toolbar while Phone is in Use
+ Added Item Stacking
+ Added Item Swapping
+ Fixed Toolbar Error (Leonard Report)
+ Optimized Inventory to try not create too much new code for stacking / swapping.
+ Added New Inventory Rules System (Custom Plugin Rules)
+ Added Function to Get All Items in as Single Array
+ Added Function getAllWeapons
+ Added Function removeAllWeapons
+ Added Function getAllItems (Returns a special list of all items a player has)
+ Added /removeallweapons for testing above functions
+ Added Ability to Equip / Unequip Items with Right-Click
+ Added Ability to Use Items with Right-Click
+ Added Ability to Split Stacks with Shift + Right-Click
+ Fixed Chat Opening while Phone in Use
+ Fixed Vehicle Controls Being used while Phone in Use
+ Fixed Leaderboard Bugging Out when Accessed From Phone
+ Fixed Weapons Not Being Removed on Death
+ Fixed Vehicle Bonnet (Hood) stuck open after Repair
+ Fixed Vehicle Search Bug for Dealership App
+ Weapons only removed when a player is sent to the Hospital
+ Added New Locale System
+ New Locale System Supports Multiple Languages (Only English thus far)
+ Added Locale for All Commands
+ Errors Now Print to Console while Building Typescript
+ Pinned Versions for Types for alt:V
+ Fixed Food Items to Refill Food
+ Added Food Effect
+ Added Water Effect
+ Added Item Effects Enum
+ Added Load Effects File
+ Locale now returns the key if missing instead of nothing
+ Fixed Decimal Placement for Characters Screen
+ Fixed Decimal Placement for Vehicle Screen
+ Removed Blip Streamer
+ Moved Relevant Blips to Minimap
+ Added Hospitals to Minimap
+ Added Static Background to Phone
+ Fix Fuel Consumption Timeout
+ Fix Fuel Not Being Consumed While Driving
+ Fixed Unable to Fuel at 95% Fuel. Can Fuel at 99 or Lower.
+ Fixed Setting Fuel if just Left Vehicle
+ Added Locales for Fuel
+ Fixed Vehicle Fuel Not Saving after Pump
+ Added Progress Bar Handler
+ Added Progress Bar for Fuel Pumps
+ Increased Radius for Fuel Pumps
+ Added Locales for Vehicle Status Server Side
+ Added Locales for Clothing Server Side
+ Added Locales for ATM Server Side
+ Added Named Interactions for Client Side
+ Added Lock / Unlock Icons to Vehicles
```

## 1.8.0 - February 28-x, 2021

```diff
+ Increase Compilation Times
+ Rewrote Build Pipeline Into File
+ Added Separate Folder for 'addon-resources' for adding mods, etc.
+ Updated Installing Mods Page
+ Removed Unnecessary Dependencies
+ Added 'Y' to toggle Engine
+ Added 'X' to toggle Lock
+ Vehicle Controls Feel More Responsive
+ Added Various WASM Functions to Server
+ Made General Improvements to App Functionality
+ Began Work for Hooking In Phone Applications
+ Added Descriptors to Inventory
+ Added Hookin for Vehicle Spawner
- Removed old Personal Vehicle Spawner
+ Add Subtract from all currencies function
+ Vehicles now added to player from dealership
+ Added spawn points for vehicle dealerships after buying
+ Added New Inventory Interface with Player Preview
+ Added Vehicle Colours to Dealership App
+ Rescaled Entire Phone Interface
+ Changed Phone Interface Colors
+ Scaled All Phone Apps
```

## 1.7.1 - February 27, 2021

```diff
+ Fix Chat / Action Menu Bugs
+ Prevent Toolbar Actions while using Action Menu
```

## 1.7.0 - February 18-26, 2021

```diff
+ Added Fuel Pumps
+ Added Vehicle Fuel System
+ Added Vehicle Ownership Adding to Players
+ Added Vehicle Ownership Removal from Players
+ Added Owned Vehicle Spawning
+ Added Vehicle Behavior Helpers
+ Added Vehicle Saving / Synchronization
+ Limited Spawned Vehicles at Once to 1
+ Fixed Vehicle Fuel Calculations
+ Fixed Vehicle Consuming Fuel without Engine On
+ Fixed Duplicate Ground Code for Items
+ Added Global Text Label Controller
+ Added Global Marker Controller
+ Added Client Plugins Folder with Basic Example
+ Added Documentation for Client Plugins
+ Added Custom Job Preview Panel
+ Added /quitjob
+ Added PgUp & PgDn for Chat
+ Fixed Clothing Menu Drawables / Textures Overflow
+ Fixed Design Choices for Clothing Menu
+ Fixed Command Helper Issues
+ Small HUD Tweaks
+ Vehicle Spawn Interface
+ Vehicles Meta for Vehicle Spawn Interface
+ Vehicle Ownership for Spawned Vehicles
+ Vehicles Now Save Positions
+ Fixed Headlights Status for HUD
+ Prevent Opening Vehicle Menu while Chat is Open
+ Prevent Opening Inventory while Dead
+ Added Unique Athena Events for Vehicles, Players
+ Fixed Global Text Labels
+ Added Append & Remove to Textlabels
+ Added Append & Remove to Markers
+ Added Append & Remove to Blips
+ Patch Chat Bug for Overflow
+ Patch Chat Scroll Bug
+ Added Action Menu
+ Added Action Menu Handler Server-side
+ Added Example of using Action Menu
+ Rewrote Vehicle Usage to use Action Menu
+ Rewrote Vehicle Client-Side Events
+ Fixed Lock Status Bug for Vehicle
+ Added 'F' & 'G' keys to Enter / Exit Vehicles
+ Removed Old Vehicle Code
```

## 1.6.0 - February 1-10, 2021

```diff
+ Initial Job Framework
+ Food System
+ Water System
+ Vehicle Engine Status Indicator
+ Vehicle Lock Status Indidcator
+ Seatbelt Placeholder
+ Fuel Placeholder
+ Cancel Vehicle Enter Controls
+ Add Additional Interaction Key Press Cancels
+ Fix Vehicle Door Synchronization
+ Added /seatbelt, /sb
+ Added Seatbelt Functionality
+ Removed Automatic Respawn
+ Added /acceptdeath
+ Improve Key Press Animation
+ Added Textlabel to Job Framework
+ Added Description to Job Framework
+ Added Objective Text to HUD
+ VehicleFuncs now available on server-side
+ Renamed 'extras' to 'plugins'
+ Fixed animations not being played because the file was not loaded
+ Added Animations to Jobs
+ Added Event Calls to Jobs
+ Added Capture Point Objective Type
+ Fix a bug where items were not consumed from toolbar on relog (saving issue)
+ Added Synced Particle Effects
+ Added Particle to Job Framework
+ Added Custom Interaction Text
+ Added Custom Interaction Blips
+ Added Custom Interaction Functionality
+ Added Blip Controller
+ Added Global Blip Propagation
+ Added Toggle for Job Animations at Beginning or End
+ Added Rotation to Animations for Jobs
+ Added Demo Heist
+ Fixed Marker Type Bug for Jobs
+ Added YouTube Audio Streaming Service with Distance
+ Added Burgular Alarm to Heist Job
+ Repair Kit Basic for Vehicle
+ Added Task Timelines to Server Side
+ Timelines allow you to call a set of native player tasks to perform actions in order.
+ Upgrade Vehicle Repair
+ If water drops below shared config setting players no longer can run
+ If food drops below shared config setting players no longer can run
+ Add Seatbelt Sound
+ Fix Command Suggestions
```

## 1.5.0 - January 28-31, 2021

```diff
+ Fix Bug with Inventory Equipment Restrictions
+ Added Whitelist
+ Added Whitelist for Discord Bot
+ Added Bot Instructions to Documentation
+ Added Whitelist Commands for Console and In-Game
+ Revamped Character Select
+ Added Clothing Sync to Character Select
+ Fix Rotation Bug for Characeter Creator
+ Better Page Scaling for Smaller Screens
+ Updated Interface for Character Select
+ Changed Character Select Location
+ Updated Interface for Character Creator
+ Updated Interface for Clothing
+ Removed Unncessary CSS Duplicate Code
+ Fix Bug with Interaction Mode Always On
+ Adjust ATM View Position
+ Fix Bug with Help Text Progress for Long Press
+ Fix CSS Bug for Inventory
```

## 1.4.0 - January 27, 2021

```diff
+ Upgraded to simplymongo 2.1.1 (Fixes Error in Console)
+ Added 'extra' folder for extending core without bugging out.
+ The 'extra' folder will allow you to import additional files that utilize core exports.
+ Fixed small bug with startup logging.
+ Add Basic Unit Tests
+ Add Effect Based Items
+ Fixed bug when pressing 1-4 on keyboard while typing it would pull items.
+ Added /getitem Command
+ Force Reload on Weapon Switch
+ Added Forced Camera Shake on Aim
+ Added Shared Config for Camera Shake on Aim
+ Added Support for Consumables on the Toolbar
+ Added Watches & Bracelets to Inventory
+ Added Clothing Shop Interface
+ Added Clothing Synchronization
+ Added Clothing Item Generator
+ Added Item Name Field
+ Added Item Description Field
+ Added Clothing Shop Blips
+ Added Clothing Shop Noises
```

## 1.3.0 - January 23-26, 2021

```diff
+ Toolbar Support for Weapons
+ Keybinds 1-4 Now Support Weapon Swapping
+ Weapon Swap Sounds
+ Weapon List Creation
+ Weapon List Creation Descriptions, Info, Generic Stats (Incorrect Probably)
+ Weapon Command
+ Introduce Deep Copy for Objects
+ Fix Item Shallow Copy (Why does shallow copy even exist? Dumb af.)
+ Fix small bug with item props in toolbar
+ Avoid shallow with spread operators.
+ Add some new documentation
```

## 1.2.0 - January 16-22, 2021

```diff
+ Inventory Design
+ Inventory Item Movement Architecture
+ Inventory Events
+ Changed Command Handler and Command Propogation
+ Changed Chat to a ChatController Class
+ ChatController now used by all commands for description population
+ ChatController now supports command aliases
+ Added vehicle.setLock to Vehicle Prototypes
+ Added INTERACTION_ALWAYS_ON which keeps interaction mode running 24/7 for SHARED_CONFIG
+ Reverted All Player Prototypes (Events not always working)
+ Decoupled Prototype Logic (Prototypes were overwhelmed and too much data).
+ Created playerFuncs export in place of Prototypes
+ Finished Inventory Controller Core Functionality
+ Added 2D Sound to Emit
+ Changed Item Swap Rule to Null Slots Only
+ Fixed First Spawn Bug
+ Fixed Login Details for Quick Token
+ Items Droppable on Ground
+ Items Pickupable from Ground
+ Item Drop Markers
+ Added Item Drop Animation
+ Added Item Pickup Animation
+ Improved Vehicle Control Information
+ Close Doors Automatically When Entering Vehicle
+ Help Message when Exiting Vehicle is Possible
+ Blips are Correct Color / Sprite for Rendering
+ Blips are now pre-processed based on .isBlip
+ Removed showing blips that are too close to each other
+ Interactions are now ColShapes
+ Interactions only toggled when entering ColShapes
+ Interactions now have a large green cylinder to help notify you it's interactable.
+ Added Inventory Tab Item Movement
+ Fixed Regex for Inventory Info
```

## 1.1.0 - January 12-15, 2021

```diff
+ Added Base Vehicle System / Controls
+ Fixed QT Bug when No User Local Storage for QT
+ Updated Ares for Portless Discord Authentication
+ Add Long Press for Keybinds
+ Add Toggle Door with Long Press 'F'
+ Add Toggle Engine with Long Press 'F' in Vehicle
+ Add Cycle Lock 'X' in Vehicle
+ Delayed QT by 250ms to Fix Non-Sending Bug
+ Made Hood and Bonnet Hold to Open Keys
+ Made Single 'F' Press when exiting vehicle not turn off the car.
+ Add Basic GTA:V Notification Support
+ Added Keyfob Animation Outside Vehicle
+ Close all doors on 'locked' state.
+ Add Custom 3D Sound Support
+ Add Lock / Unlock Sounds for Vehicle
+ KeyFob Animation Only Plays for Locked / Unlock State
+ Added Stream In Support for Custom Vehicle Handler
+ Moved Vehicle Interaction to Interaction System
+ Added Long Press 'alt' to hide Interaction Text
+ Added isChatOpen
+ Added isInteractionTextOff
+ Refactored Keyup on Client Side
+ Refactored Vehicle System
+ Refactored Interaction System
+ Split HUD into Individual Control Systems
+ Interaction Controller much easier to understand now.
- Removed ImDrawText
- Removed Toggling Interaction Text
+ Replaced Interaction Text with Help Text
+ Added Long Press Animation to Help Text
+ Refactored Player Prototypes (This one was rough)
+ Refactored World Time / Weather
+ Refactored Event Organization
+ Add Gas Station Blips
+ Fix Set Into Vehicle
+ Fix QT Bugs
```

## 1.0.9 - January 10, 2021

```diff
+ Potentially fixed buggy auth startup. No more under map bug.
+ Delayed quick token fetch for more consistent reconnect behavior.
+ Added Blip Interaction Handler
+ Added Closest Object for Grid System
+ Added Text to Interaction Handler
+ Play Sound Frontend for Player
+ Freeze Player from Server Side
+ Added Screen Blur to Re-Usable View Instances
+ Added ATM Interface
+ Added ATM Functionality
```

## 1.0.8 - January 6-8, 2021

```diff
+ Fixed Revive Command for Respawning
+ Fixed Health not being set on login
+ Fixed Armour not being set on login
+ Fixed Death not being casted on login when dead
+ Added Fast Login
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

## 1.0.5 - January 2 - 3, 2021

```diff
+ Add Respawn Handler
+ Fix Respawn Command
+ Add Basic Voice
+ Fixed Linux Deployment for CopyFiles
+ Added Try/Catch to Disconnect Events
```

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

## 0.0.0 - December 30, 2020

```diff
~ Moved Prototypes to Seperate Files
~ Restructured Some Files / Folders
+ Fixed Permission Flag Checks
+ Added Permission Flags to Commands
+ Added Chat Colors
- Removed Unncessary Variables on Player
```

## 0.0.0 - December 29, 2020

```diff
- Removed Gulp Dependency
- Removed Yargs Dependency
+ Added Command Handler for Chat
+ Added Some Example Commands
+ Added Input Sanitization for HTML
+ Added `player.id` to Nearby Player Names
```

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

## 0.0.0 - December 26, 2020

```diff
~ Fixed Rotation for New Character and Character Select
+ Finished Character Editor Design Updates
+ Character Creator now TPosing
+ Added Ares Service Support
+ Released License Keys for Athena
+ Launched Gumroad Product
```

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

## 0.0.0 - October - December, 2020

```diff
- Realized I was burnt out.
```

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
