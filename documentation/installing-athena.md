---
description: This will tell you how to setup a private mirror of Athena.
---

# Installing Athena

Ensure that you have followed and completed the [Before Setup](./before-setup.md) instructional page. The prerequisites inside of that page are deeply important for making alt:V Athena function out of the box.

## Table of Contents

- [Installing Athena](#installing-athena)
  - [Table of Contents](#table-of-contents)
  - [Setup Private Repo](#setup-private-repo)
  - [Set Private Repo Main Branch to Master](#set-private-repo-main-branch-to-master)
  - [Download from Private Repo](#download-from-private-repo)
    - [Updating Submodules](#updating-submodules)
    - [Installing Dependencies](#installing-dependencies)
    - [Installing Server Files](#installing-server-files)
    - [Using License Key](#using-license-key)
    - [Important Configuration](#important-configuration)
  - [Obtaining your Own IP](#obtaining-your-own-ip)
  - [Port Forwarding](#port-forwarding)
  - [Checking Ports](#checking-ports)
  - [Running the Server](#running-the-server)
    - [Running Production on Windows](#running-production-on-windows)
    - [Running Production on Linux](#running-production-on-linux)
    - [Running in Debug / Auto Refresh Mode](#running-in-debug--auto-refresh-mode)
- [What is Next?](#what-is-next)

## Setup Private Repo

Create a bare clone of the Athena Repository

```bash
git clone https://github.com/Stuyk/altv-athena --bare altv-athena-bare
```

Create a new private repistory on github. Let's call it altv-athena-private

![](https://i.imgur.com/y1Lxqwn.png)

Copy your URL from github.

![](https://i.imgur.com/Dd7Zrke.png)

Move into the bare directory from your command line tool of choice

```bash
cd altv-athena-bare
```

Mirror the bare repository to your private mirror.

```bash
git push --mirror <your_github_url_here>
```

Delete the bare repository.

```bash
cd ..
rmdir altv-athena-bare
```

## Set Private Repo Main Branch to Master

![](https://i.imgur.com/FXae1k2.png)

![](https://i.imgur.com/czfpchr.png)

## Download from Private Repo
Clone the repository down from github.

```bash
git clone <your_github_url_here>
```

Add the upstream of the original athena repository.

```bash
git remote add upstream git@github.com:Stuyk/altv-athena.git
git remote set-url --push upstream DISABLE
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

### Using License Key

The license key is unique to your Gumroad Transaction. The license key should be kept a secret.

The [Official alt:V Athena Discord](https://discord.gg/pZvbJmKN8Y) will allow you to manage your license key and IP(s) which can use it through the Athena Key Manager Bot.

Please make sure to join and and `!help` to get information about the bot.

You should either `refresh` your email and key to keep it active. The backend service will check the validity of the key.

```
!refresh <gumroad_email> <key>
```

After binding the license you can append your IP to your license or any of your developer(s).

```
!append <key> <ip>
```

### Important Configuration

There is now a file called `AthenaConfig.json` in the root of your project. This is where you can specify different parameters and configuration option(s) for Athena.

Here's an example configuration with descriptions.

```json
{
    "[?] A Discord Bot Secret from the Discord Developer Panel": {},
    "DISCORD_BOT": "",
    "[?] A Role ID from your Discord to use as the white list role. Requires DISCORD_BOT": {},
    "WHITELIST_ROLE": "",
    "[?] A URI with authentication to connect to a MongoDB Database": {},
    "[?] ex: mongodb://username:password@127.0.0.1:27017": {},
    "MONGO_URL": "",
    "[?] A list of collection(s) to create. Separated by a common. ie. one,two,three": {},
    "MONGO_COLLECTIONS": "",
    "[?] Used to turn on development mode for WebViews": {},
    "VUE_DEBUG": true,
    "[?] Used for Ares Service Debugging": {},
    "ARES_ENDPOINT": "",
    "[?] Used to give the client the IP to connect to the WebServer **Deprecated": {},
    "WEBSERVER_IP": ""
}
```

## Obtaining your Own IP

**Windows**

Just google what is my IP.

https://www.google.com/search?q=what+is+my+ip

**Linux**

Run the following in your terminal.

```sh
curl ipinfo.io/ip
```

## Port Forwarding

You will need to port forward for the following ports on TCP & UDP.

```
7788
```

## Checking Ports

Append your IP into this website with both ports while your **server is running** to verify that the ports are open.

https://www.yougetsignal.com/tools/open-ports/

## Running the Server

Running the server should always be done through your command line, terminal, or powershell interface. You should use the `npm` scripts that included inside of `package.json`.

**HEY, LISTEN!**

When you run a server in `production` mode that means that your server is running without development node. You should be modifying your `server.cfg` and removing debug mode and adding the `webserver` resource before core.

Example:

```
resources: ["webserver", "core"],
```

Please do not forget to do this!

_Make sure you follow the full setup before running any of this._

### Running Production on Windows

```
npm run windows
```

### Running Production on Linux

```
npm run linux
```

### Running in Debug / Auto Refresh Mode

You need to run one simple command. This will start your server, webserver, and an auto-reconnection client.

Only works on Windows.

```
npm run dev
```

_Replace windows with linux if you are using linux._

# What is Next?

Read the next page of this tutorial to fully understand how to save your changes and work with incoming Athena updates.

[Updating Athena](./updating-athena.md)