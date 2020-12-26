<p align="center">
    <img src="./assets/athena_lrg.png" width="125" />
</p>
<sup>An Paid alt:V Roleplay Framework</sup>

# Project Athena

This project solely exists as a new standard for GTA:V roleplay servers on the [alt:V](https://altv.mp/) client.

This features type safety through TypeScript and a solid foundation for what I consider the core of roleplay.

Athena is at the forefront of the alt:V Ares Service and the alt:V Athena Product.

alt:V Athena's source code will always be open but the ability to use it will depend on you.

Configuration files may be purchased at [https://gumroad.com/products/SKpPN/](https://gumroad.com/products/SKpPN/)

# Project Features

-   Fully Open Source
-   Typescript
-   Scaleable Folder Structure
-   Character Editor
-   Character Selection
-   Character Info Support
-   Character Appearance Synchronization
-   Easy Discord Login / Authentication (alt:V Ares)

# Project Plans

-   Respawn System
-   Chat Box \*Optional
-   alt:V Voice \*Optional
-   Inventory \*Optional
-   Economy System \*Optional
-   Job System \*Optional

# Support

[❤️ Become a Sponsor of my Open Source Work](https://github.com/sponsors/Stuyk/)

[⌨️ Learn how to script for alt:V](https://stuyk.github.io/altv-javascript-guide/)

[Join Athena Discord](https://discord.gg/pZvbJmKN8Y)

⭐ This repository if you found it useful!

# Configuration and Bootup

-   Install NodeJS 13+
-   Install GIT

```bash
$ git clone https://github.com/Stuyk/altv-athena.git
```

```bash
$ cd altv-athena
```

```bash
$ npm install && npm run update
```

Create a file called `.env` and edit it.

Add the following lines to your `.env` file.

```
GUMROAD=XXXXXXXX-YYYYYYYY-...
EMAIL=xyz@emai...
MONGO_URL=
MONGO_USERNAME=
MONGO_PASSWORD=
```

Fill in GUMROAD with your alt:V Athena License Key from [https://gumroad.com/products/SKpPN/](https://gumroad.com/products/SKpPN/).

Fill in EMAIL with your Gumroad.com email.

The Mongo Parameters are optional. Leave blank if working locally.

# Running the Project

Running on Windows

```sh
$ npm install && npm run update
$ npm run windows
```

```sh
$ npm install && npm run update
$ npm run linux
```

# Folder Structure Explained

This is the folder structure that comes with Athena.

I have left some comments in the code block below to help you find where things are. There's a method to the madness you see below.

```sh
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
    │   ├───database
    │   │   # Handles load order and database initialization with simplymongo.
    │   │   # SPECIFY ADDITIONAL FILES TO LOAD HERE IF NECESSARY.
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

# Hotkeys

```
F1 - Print Position, Rotation, and Heading in Console
```

# Screenshots

![](https://i.imgur.com/eJnAHWm.png)

![](https://i.imgur.com/4JZhbsW.jpg)
