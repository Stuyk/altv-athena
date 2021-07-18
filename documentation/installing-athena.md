---
description: This will tell you how to setup a private mirror of Athena.
---

# Installing Athena Advanced

Ensure that you have followed and completed the [Before Setup](./before-setup.md) instructional page. The prerequisites inside of that page are deeply important for making alt:V Athena function out of the box.

## Table of Contents

- [Installing Athena Advanced](#installing-athena-advanced)
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
- [Updating and Storing Changes](#updating-and-storing-changes)
  - [Merge Conflicts?!](#merge-conflicts)
  - [Pushing Changes to Private Repository](#pushing-changes-to-private-repository)

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

**Creating the .env File**

In the same directory as your `package.json` file. Create a file called `.env` and open it up in whatever text editor you like to use. Add the following lines to your `.env` file depending on what you need.

This file should not have **ANY EXTENSION** make sure it doesn't say it's a text document. You have to modify the extension of the file to make this work. Pick up a program like VSCode to do this. I cannot stress this enough .env.txt is not the same as a .env file. Make sure your file is actually called `.env` with no extension.

**Bare Minimum Configuration**

* WEBSERVER_IP

**Configuration Options**

```sh    
# Optional Discord Bot Integration
DISCORD_BOT=<DISCORD_BOT_KEY>

# Optional Discord Whitelist Role ID
WHITELIST_ROLE=<SOME_ID>

# A connection string for MongoDB. If using localhost don't bother.
MONGO_URL=<MONGODB_CONNECTION_STRING>

# List of Collections to Generate Besides the Default(s)
# Collections are also known as tables.
MONGO_COLLECTIONS=SomeCollection,SomeOtherCollection,SomeMoreCollection

# You must specify your server's IP Address here.
WEBSERVER_IP=<YOUR_SERVER_IP>
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

**DO NOT SKIP THIS. NOBODY CAN JOIN WITHOUT IT.**

```
7788
9111
```

## Checking Ports

Append your IP into this website with both ports while your **server is running** to verify that the ports are open.

https://www.yougetsignal.com/tools/open-ports/

## Running the Server

Running the server should always be done through your command line, terminal, or powershell interface. You should use the `npm` scripts that included inside of `package.json`.

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

# Updating and Storing Changes

Instead of being super ineffecient and merging files in one at a time, you're going to be using git to pull down changes. Which does things mostly automatically.

Here are some notes before you perform these actions **\(SUPER IMPORTANT\)**:

* Close All Open Files
* Push All Current Change to Private Repository
* Create a backup of your current folder
* Run the two commands below.

```bash
git fetch upstream
git pull upstream master
```

If you run into merge conflicts... see the video below. It will help you understand what needs to be done to resolve merge conflicts.

## Merge Conflicts?!

Don't worry I made a simple video to help explain merge conflicts. Check out this video:

[![Resolving Merge Conflicts](https://img.youtube.com/vi/sc_vo30hu_M/0.jpg)](https://www.youtube.com/watch?v=sc_vo30hu_M)

Merge conflicts only occur when you are pulling in new data from an existing repository. This means that it found similar code but isn't sure if you want to override your current code or mix the two. A merge conflict can easily be seen inside vscode when pulling dwon from the upstream.

## Pushing Changes to Private Repository

If you make changes in your private clone. You can now simply push to the private repository and pull it down anywhere. Which is really great.

Here's how you can push changes.

```bash
git add .
git commit -m "What did I commit to the repo"
git push origin master
```
