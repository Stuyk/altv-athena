# Athena Framework for alt:V

## Summary

[Athena Framework](https://athenaframework.com) is Roleplay framework for GTA:V that is utilized by not FiveM or ragemp but the [alt:V platform](https://altv.mp). This is a full fledged framework similar to ESX that allows you to build a more robust game mode out without having to think about core scripts. This framework is built with TypeScript and tries to keep developers in mind for major implementations and extendability.

## Documentation

https://docs.athenaframework.com/

## Development Stack

* [MongoDB](https://www.mongodb.com/) (Database)
* [TypeScript](https://www.typescriptlang.org/) / [JavaScript](https://www.javascript.com/) (Programming Language)
* [Vue 3](https://v3.vuejs.org/) (Frontend)
* [Vite](https://vitejs.dev/) (Vue 3 Tooling for Instant Server Start)

## Where to Purchase?

License keys may be purchased from [Athena Framework](https://athenaframework.com).

_No there is not a lifetime package for Athena._

## Why is it Open Source?

Unlike other servers and frameworks I believe in helping everyone as much as possible. Leaving Athena open source allows developers to learn a few things about the way the author of this repository thinks. Sharing is caring unless you don't support your care giver.

## Demo

Small demo server available for you to test the framework with Administrative capabilities. 

You can check that out using the alt:V client at [https://altstats.net/server/504](https://altstats.net/server/504)

## Feature List

-   Fully Open Source
-   Typescript
-   Scalable Folder Structure
-   Basic Unit Test Support
-   Character Editor
-   Character Selection
-   Character Info Support
-   Character Appearance Synchronization
-   Whitelist
    -   Discord Role / Bot Integration
    -   Console Commands
-   Console Commands
    -   Ban
    -   Unban
    -   Kick
    -   KickAll
    -   SetAdmin
    -   Dox
    -   Screenshot
    -   Add to Whitelist
    -   Remove from Whitelist
-   Player
    -   Health Synchronization
    -   Armour Synchronization
    -   Play 3D Custom Sounds (Short)
    -   Play 2D Custom Sounds (Short)
    -   Food Stat
    -   Water Stat
-   Name Tags
    -   Display after 7.5s \(Used for Hiding Names Partially\)
    -   Names Hidden in Vehicles
-   Discord Based Authentication / Login
-   Admin System
    -   Utilizes the Permission System
    -   Various Admin Commands
    -   NoClip Command
-   Chat System
    -   Send Messages to Closest Players
    -   Create Custom Commands
    -   Assign Permission Values to Commands
-   Voice System
    -   Uses built-in Voice by alt:V
    -   Spatial, and Distance Built-in
    -   Can be toggled off for the classic SAMP experience
-   Permission System
    -   A basic permission system for running commands.
    -   Allows commands to be restricted to specific groups.
-   World
    -   Synchronized World Time
    -   Synchronized Weather Patterns
    -   Different Weather Based on Region
    -   Adjustable Configuration
    -   Performance Grid for Object Interactions / Finding
-   Interaction System
    -   Parse Objects by Section
    -   Add Custom Interactions Easily
    -   Colshape System to Represent Interaction Points
    -   ATM Object Interaction
-   Blip System
    -   Global Blip Controller
    -   Repeat Blips are Streamed
    -   Automatically Generate Blips for Useable Objects (Atms, Fuel, etc.)
-   Marker System
    -   Global Marker Controller
    -   Easily add and remove global markers
-   Text Label System
    -   Global Text Label Controller
    -   Easily add and remove text labels
-   Currency System
    -   Deposit Currency
    -   Withdraw Currency
    -   Transfer Bank Currency
-   Vehicle System
    -   Control Vehicle Door Locks
    -   Handle Vehicle Ownership
    -   Handle Vehicle Synchronization Pop-in
    -   Seatbelt / Handle Window Fly-through
    -   Control Vehicle Door States
    -   Fuel
    -   Persistent Vehicle Spawning
-   Inventory System
    -   Drop Items
    -   Pickup Items
    -   Move Items
    -   Multiple Slots for Items
    -   Inventory Item Restriction Flags
    -   Animations for Picking Up / Dropping
    -   All Weapon Icons
    -   Equipment Slots
    -   Toolbar Slots
    -   Custom Item Effects
    -   CONSUMABLE Items
    -   Custom Item Rules for Swapping, Equipping, Dropping, etc.
    -   Item Swap
    -   Item Stack
    -   Item Equip / Unequip
    -   Item Splitting
-   Clothing System
    -   Clothing Selection
    -   Tops
    -   Hats
    -   Bags
    -   Bottoms
    -   Shoes
    -   Accessories
    -   Bracelets
    -   Watches
    -   Masks
    -   Name Individual Items
    -   Describe Individual Items
    -   Separate Item Equips
- Garage System
    - 17 Garages Across the Map
    - Store Vehicles
    - Spawn Vehicles
- Expandable HUD System
    - Easily create a dynamic HUD
    - Add New HUD Elements
    - Remove HUD Elements
-   Toolbar System
    -   Equip an item in a Toolbar Equippable Item
    -   Press 1-4 to swap items in toolbar
-   Custom Job Framework
    -   Easy to Use Job Language / Creation
    -   Play Animations
    -   Play Particles
    -   Play Sounds
    -   Add Blips
    -   Add Markers
    -   Custom Waypoint Types... Go To, Capture, etc.
    -   Custom Criteria: No Vehicle, No Weapon, etc.
    -   Call Events on Objective Completions
    -   Job Menu
-   Action Menus
    -   Infinitely scaling menus
    -   A menu system that calls other events easily.
    -   Easily construct custom menus in minutes to define functionality.
-   Wheel Menu
    -   Dynamic Wheel Menus
-   Dealership
    -   Basic Dealership with Customizable Locations
    -   Purchase Vehicles
    -   Spawn Vehicles from Garage After Purchase
-   Extendable Core Resource
    -   Extend the core resource by writing your own code in the 'plugins' folder.
-   Streamer Service
    -   Static Global Streaming Service
    -   Marker Streaming
    -   Object Streaming
    -   Text Label Streaming
-   Interior System
    -   Create Interiors Easily
    -   Specify Different Interior Types (House, Faction, System)
    -   Object Streaming for Interiors
-   Faction System
    -   Create Factions
    -   Create Custom Ranks for Factions
    -   Add Members to Factions
    -   Remove Members from Factions
    -   Manage Permissions Per Rank for Factions
    -   Faction Weapon Storage
    -   Faction Bank
    -   Faction Item Storage
    -   Faction Name Changing / Updating
