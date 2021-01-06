---
description: General file structure information and layout.
---

# File Structure

This is going to give you a very brief overview of everything inside of each alt:V Athena folder. It will not teach you to code but it will definitely teach you where to find things and tweak files.

## File Structure \(January 6, 2021\)

```text
└───core
    ├───altv-ares
    │ # Used as a low cost Discord Authentication Service.
    │
    │ # This contains three main folders.
    │ # Server - Contains code relating to the database, player spawning, etc.
    │ # Client - Contains code to display things to the user and do things to them.
    │ # Shared - Contains event names and locale helpers. Shared between folders.
    ├───client
    │   # Defines logic that the player runs on their computer.
    │   ├───events
    │   │   # Used for handling different alt:V Events
    │   ├───extensions
    │   │       │    # Used to add additional functionality to client-side classes.
    │   │       └───view.ts
    │   │       # Used to extend the WebView functionality.
    │   │       # Automatically handles cursor state and makes WebView a singleton.
    │   │       # Use this if you're displaying one view at a time.
    │   │
    │   ├───interfaces
    │   │   # Used to define data models or interfaces for client-side usage.
    │   ├───systems
    │   │   # Used to define complicated systems such as vehicle controls.
    │   ├───utility
    │   │   # Used as a place to add mixed functionality.
    │   └───views
    │       │   # This folder is all about handling client-side logic for WebViews.
    │       │   # Includes character selection, character editor, login, etc.
    │       │   # The folder also has all server-side logic for the view under...
    │       │   #   the same name in the server folder.
    │       ├───characters
    │       │   └───html
    │       ├───creator # The Character Creator View and Logic
    │       │   └───html
    │       ├───css
    │       ├───empty # used to webview extension. DO NOT DELETE.
    │       ├───fontawesome # used for vuetify.js
    │       ├───img
    │       ├───js # vue.js, vuetify.js, etc.
    │       ├───less
    │       ├───login # The Login Page View and Logic
    │       │   └───html
    │       ├───sound
    │       └───svg
    ├───server
    │   # Defines logic that you run as a server owner.
    │   ├───athena
    │   │   # Where all of your configuration dreams come true.
    |   |   # Also import any additional files here.
    │   ├───enums
    │   │   # Helps define lists for different functionality.
    │   ├───events
    │   │   # Used for handling server-side alt:V Events.
    │   │───extensions
    │   │   # Used to extend alt:V Server Classes.
    │   │   # These must always be loaded first.
    │   ├───interface
    │   │   # Interfaces that are server-side specific.
    │   │   # Account Interfaces, Config Interfaces, etc.
    │   ├───systems
    │   │   # Defines complicated logic such as vehicle controls.
    │   ├───utility
    │   │   # Defines shared logic between server-side code.
    │   └───views
    │       # Defines logic to control views on client-side from server-side.
    │       # All view events from client-side get pushed up into these files.
    └───shared
        ├───enums
        ├───interfaces
        └───utility
```
