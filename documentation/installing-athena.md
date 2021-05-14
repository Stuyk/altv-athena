---
description: This will tell you how to setup a private mirror of Athena.
---

# Installing Athena Advanced

Ensure that you have followed and completed the [Before Setup](./before-setup.md) instructional page. The prerequisites inside of that page are deeply important for making alt:V Athena function out of the box.

## Table of Contents

- [Installing Athena Advanced](#installing-athena-advanced)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
    - [Updating Submodules](#updating-submodules)
    - [Installing Dependencies](#installing-dependencies)
    - [Installing Server Files](#installing-server-files)
    - [Installing License Key](#installing-license-key)
  - [Running the Server](#running-the-server)
    - [Running Production on Windows](#running-production-on-windows)
    - [Running Production on Linux](#running-production-on-linux)
    - [Running in Debug / Auto Refresh Mode](#running-in-debug--auto-refresh-mode)
    - [Cleaning Files, Cache, etc.](#cleaning-files-cache-etc)
- [Updating and Storing Changes](#updating-and-storing-changes)
  - [Merge Conflicts?!](#merge-conflicts)
  - [Pushing Changes to Private Repository](#pushing-changes-to-private-repository)

## Setup

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

### Installing License Key

The license key is unique to your Gumroad Transaction. The license key will allow you to properly boot the alt:V Athena Server. This can be installed by using Environment Variables or a simple `.env` file will do.

**Creating the .env File**

In the same directory as your `package.json` file. Create a file called `.env` and open it up in whatever text editor you like to use. Add the following lines to your `.env` file depending on what you need.

**I cannot stress this enough .env.txt is not the same as a .env file. Make sure your file is actually called `.env` with no extension.**

**GUMROAD**

This argument is for your [alt:V Athena Subscription License](https://gumroad.com/products/SKpPN/). It lets you boot the script.

```text
GUMROAD=XXXXXXXX-YYYYYYYY-...
```

**EMAIL**

This argument is for your Gumroad Email. The Email you used when you bought a license.

```text
EMAIL=xyz@email.com
```

**MONGO\_URL\***

This argument is if you went with a remote MongoDB Server.

_Optional. Not required to add._

```text
MONGO_URL=mongodb://localhost:27017
```



**MONGO\_USERNAME\***

This argument is if your database has a username anbd password. Highly recommended if you have remote access.

_Optional. Not required to add._

```text
MONGO_USERNAME=myUsername
```

**MONGO\_PASSWORD\***

This argument is if your databae has a username and password. Highly recommended if you have remote access.

_Optional. Not required to add._

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

You need to open two terminals. I recommend doing this inside of VSCode as you'll see compilation of your project as well as keeping the server running which will automatically refresh for updates.


**First Terminal**

```
npm run windows
```

**Second Terminal**

```
npm run watch-windows
```

_Replace windows with linux if you are using linux._

### Cleaning Files, Cache, etc.

If you run into issues during your runtime you can always run the cleaning process which will rebuild cache for faster build times. It is only recommended to clean if you are updating.

You **will not** lose any major files upon running this process.

```
npm run clean
```

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