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
-   Name Tags
    -   Display after 7.5s (Used for Hiding Names Partially)
    -   Names Hidden in Vehicles
-   Easy Discord Login / Authentication (alt:V Ares)
-   Admin System
    -   Utilizes the Permission System
    -   Various Admin Commands
    -   NoClip Command
-   Chat System
    -   Send Messages to Closest Players
    -   Create Custom Commands
    -   Assign Permission Values to Commands
-   Voice System
    -   Uses Built in alt:V Voice
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

```
View a full list of planned features in the Discord link below.
```

# Support

[❤️ Become a Sponsor of my Open Source Work](https://github.com/sponsors/Stuyk/)

[⌨️ Learn how to script for alt:V](https://stuyk.github.io/altv-javascript-guide/)

[Join Athena Discord](https://discord.gg/pZvbJmKN8Y)

⭐ This repository if you found it useful!

# Configuration and Bootup

-   [alt:V Athena Subscription License](https://gumroad.com/products/SKpPN/)
-   [Install NodeJS 13+](https://nodejs.org/en/download/)
-   [Install GIT](https://git-scm.com/downloads)
-   [Install MongoDB Community Server](https://www.mongodb.com/try/download/community)
-   [Install MongoDB on Linux](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

## External MongoDB Server

If you are unable to setup a MongoDB server with your host.

You can use an external database service such as [DigitalOcean](https://m.do.co/c/0a2a8f925176).

```
Create an Account -> Create (Top) -> Droplet

Marketplace -> Type MongoDB -> Select MongoDB on Ubuntu

Select Basic

Configure the Rest

Follow Steps Below for the Rest
```

## Installing Dependencies for this Framework

Open a Terminal, Command Prompt, or Powershell Instance

```bash
git clone https://github.com/Stuyk/altv-athena.git
```

```bash
cd altv-athena
```

```bash
git submodule update --init --recursive --force --remote
```

```bash
npm install && npm run update
```

## Creating the .env File

This is known as your environment file. It has a list of arugments you need to feed to your server on bootup.

Create a file called `.env` and edit it.

Add the following lines to your `.env` file depending on what you need.

### GUMROAD

This argument is for your [alt:V Athena Subscription License](https://gumroad.com/products/SKpPN/). It lets you boot the script.

```
GUMROAD=XXXXXXXX-YYYYYYYY-...
```

### EMAIL

This argument is for your Gumroad Email. The Email you used when you bought a license.

```
EMAIL=xyz@email.com
```

### MONGO_URL\*

This argument is if you went with a remote MongoDB Server.

```
MONGO_URL=mongodb://localhost:27017
```

### MONGO_USERNAME\*

This argument is if your database has a username anbd password. Highly recommended if you have remote access.

```
MONGO_USERNAME=myUsername
```

### MONGO_PASSWORD\*

This argument is if your databae has a username and password. Highly recommended if you have remote access.

```
MONGO_PASSWORD=coolPassword
```

### DEV_ID

This argument is for using a single Discord ID for all connections. This is for development mode by yourself.

It generally bypasses the Discord Authorization and makes logins quicker.

```
DEV_ID=111222MyDiscordID3452
```

### Your .env File Should Look Like

```
GUMROAD=XXXXXXXX-YYYYYYYY-...
EMAIL=xyz@emai...
MONGO_URL=
MONGO_USERNAME=
MONGO_PASSWORD=
DEV_ID=
```

# Port Forwarding

You should port forward 7788 and 7790.

This needs to be done in your router and your local installation.

Here's a script for port forwarding on windows. It's a `.bat` script.

```bat
ECHO OFF

echo Opening 7788 for TCP
netsh advfirewall firewall add rule name="alt:V-7788-IN-TCP" dir=in action=allow protocol=TCP localport=7788
netsh advfirewall firewall add rule name="alt:V-7788-OUT-TCP" dir=out action=allow protocol=TCP localport=7788

echo Opening 7788 for UDP
netsh advfirewall firewall add rule name="alt:V-7788-IN-UDP" dir=in action=allow protocol=UDP localport=7788
netsh advfirewall firewall add rule name="alt:V-7788-OUT-UDP" dir=out action=allow protocol=UDP localport=7788

echo Opening 7790 for TCP
netsh advfirewall firewall add rule name="alt:V-7790-IN-TCP" dir=in action=allow protocol=TCP localport=7790
netsh advfirewall firewall add rule name="alt:V-7790-OUT-TCP" dir=out action=allow protocol=TCP localport=7790

echo Opening 7790 for UDP
netsh advfirewall firewall add rule name="alt:V-7790-IN-UDP" dir=in action=allow protocol=UDP localport=7790
netsh advfirewall firewall add rule name="alt:V-7790-OUT-UDP" dir=out action=allow protocol=UDP localport=7790

pause
```

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
F2 - Player List / Leaderboard

> Chat View
-   Up - Last Message
-   Down - Next Message
-   Right - Autocomplete Command
-   Escape - Exit Chat
-   Enter - Send Chat Message
-   T - Toggle Chat Box

> No Clip
-   Scroll Up - Slow Down
-   Scroll Down - Speed Up
-   WASD - Move Camera
```

# Core Commands

```
/timestamp - Will toggle chat timestamps on and off.
/help - List commands available to your permission level.
/me [message] - Describe an action you are performing.
/do [message] - Describe an object or item around you.
/low [message] - Say something in a low voice.
/w [player_id] [message] - Whisper something to a player near you.
```

# Admin Commands

```
/noclip - Sets self in no collision mode.
/revive [id]* - Revive another player or self.
/sethealth [amount] [id]* - Set health for another player or self.
/setarmour [amount] [id]* - Set armour for another player or self.
/updateweather - Updates your weather sync in the region immediately.
```

# Screenshots

![](https://i.imgur.com/eJnAHWm.png)

![](https://i.imgur.com/v07Er4s.jpg)

![](https://i.imgur.com/4JZhbsW.jpg)
