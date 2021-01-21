---
description: >-
    This setup covers exactly how to run Athena after going through the Before
    Setup page.
---

# Installing Athena

Ensure that you have followed and completed the ['Before Setup'](https://github.com/Stuyk/altv-athena/tree/30bd7878ca990db194ff2779bd43eb597b3e006a/documentation/documentation-before-setup.md) instructions page. The prerequisites inside of that page are deeply important to making alt:V Athena function out of the box.

If you have **NOT DONE** this please select your operating system:

-   [Windows](https://github.com/Stuyk/altv-athena/tree/30bd7878ca990db194ff2779bd43eb597b3e006a/documentation/documentation-before-setup.md#windows-10-windows-server)
-   [Linux](https://github.com/Stuyk/altv-athena/tree/30bd7878ca990db194ff2779bd43eb597b3e006a/documentation/documentation-before-setup.md#linux-ubuntu-18-04)

### Beginning the alt:V Athena Installation

Thanks to the wonders of Node, and GIT. Installing Athena is incredibly easy and the instructions are mostly the same across all operating systems.

You are going to need to open a terminal, command line, or powershell. If you are on Linux make sure you have [SSH Access](https://github.com/Stuyk/altv-athena/tree/30bd7878ca990db194ff2779bd43eb597b3e006a/documentation/documentation-before-setup.md#linux-ubuntu-18-04) and have gained root access to your server.

### Cloning the Repository

You are going to want to clone the main repository.

```text
git clone https://github.com/Stuyk/altv-athena.git
```

### Entering the Cloned Repository

This is just a fancy way of saying. Go into the `altv-athena` folder.

Keep in mind that all the commands below need to be ran inside of the `altv-athena` folder where your `package.json` is located. **This is super important.**

```text
cd altv-athena
```

### Updating Submodules

This downloads all of our other repository dependencies such as the Ares Authorization Service.

```text
git submodule update --init --recursive --force --remote
```

### Installing Dependencies

This installs all NodeJS packages and dependencies that help run the server.

```text
npm install
```

### Installing Server Files

From this point forward you can simply run this `npm` command to update dependencies.

```text
npm run update
```

### Installing License Key

The license key is unique to your Gumroad Transaction. The license key will allow you to properly boot the alt:V Athena Server. This can be installed by using Environment Variables or a simple `.env` file will do.

#### Creating the .env File

In the same directory as your `package.json` file. Create a file called `.env` and open it up in whatever text editor you like to use. If you're on Linux try `nano` and make sure to lookup the **hotkeys** for nano.

Add the following lines to your `.env` file depending on what you need.

Note: Anything marked with \* is optional.

#### GUMROAD

This argument is for your [alt:V Athena Subscription License](https://gumroad.com/products/SKpPN/). It lets you boot the script.

```text
GUMROAD=XXXXXXXX-YYYYYYYY-...
```

#### EMAIL

This argument is for your Gumroad Email. The Email you used when you bought a license.

```text
EMAIL=xyz@email.com
```

#### MONGO_URL\*

This argument is if you went with a remote MongoDB Server.

```text
MONGO_URL=mongodb://localhost:27017
```

#### MONGO_USERNAME\*

This argument is if your database has a username anbd password. Highly recommended if you have remote access.

```text
MONGO_USERNAME=myUsername
```

#### MONGO_PASSWORD\*

This argument is if your databae has a username and password. Highly recommended if you have remote access.

```text
MONGO_PASSWORD=coolPassword
```

**Results May Vary**

You should end up with something similar to this.

_Do not put parameters if they are empty. You may not get the desired effect you want._

```text
GUMROAD=XXXXXXXX-YYYYYYYY-...
EMAIL=xyz@emai...
MONGO_URL=
MONGO_USERNAME=
MONGO_PASSWORD=
```

That's it! You're ready to begin using your server.

## Running the Server in Production

Running the server is done through `npm` commands since we need to compile some code before we boot up the server. Run the following commands based on your system.

### Linux

```text
npm run linux
```

### Windows

```text
npm run windows
```

## Running the Server in Development

Running the server in development mode allows for faster compilation and restarts.

This will automatically copy all new file changes and only compile typescript changes.

Highly recommended to use this when modifying the server and performing tests.

### Windows

```text
npm run watch-windows
```

### Linux

```text
npm run watch-linux
```
