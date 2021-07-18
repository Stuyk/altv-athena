---
description: >-
  Here is a list of things you will need to install on Windows or Linux
  depending on your setup.
---

# Before Setup

- [Before Setup](#before-setup)
  - [Before Buying a Server](#before-buying-a-server)
  - [Obtain a License Key](#obtain-a-license-key)
  - [Windows 10 / Windows Server](#windows-10--windows-server)
  - [Make Sure MongoDB is Running as a Service](#make-sure-mongodb-is-running-as-a-service)
      - [Port Forwarding](#port-forwarding)
  - [Linux Ubuntu 18.04](#linux-ubuntu-1804)
      - [General Server Recommendation for Starting Out](#general-server-recommendation-for-starting-out)
      - [Port Forwarding](#port-forwarding-1)
    - [Install libatomic1](#install-libatomic1)
    - [Install GIT](#install-git)
    - [Install NodeJS](#install-nodejs)
    - [Install MongoDB](#install-mongodb)
      - [Running MongoDB](#running-mongodb)
      - [Checking Status of MongoDB](#checking-status-of-mongodb)

## Before Buying a Server

Who you should **NOT USE** for hosting Athena:

* Zap
* Iceline
* **ANY Pay Per Player Slot Provider**

**Why?** These server providers do not give you direct access to the server in most cases. Athena requires additional setup through a terminal but also to install MongoDB to store data. Meaning that if you choose these hosting providers for your server. **You are solely responsible for figuring out how to set them up**.

Nobody in the **Athena Discord** will be providing you with instructions for your server host.

## Obtain a License Key

Athena uses a licensing system for assisting with booting the framework.

[Buy an Athena License from Gumroad](https://gumroad.com/products/SKpPN/)

## Windows 10 / Windows Server

You need to download and install these programs and binaries from the links below.

[Download and install NodeJS 13+](https://nodejs.org/en/download/)

[Download and install GIT](https://git-scm.com/downloads)

[Download and install MongoDB Server](https://www.mongodb.com/try/download/community)

_When Installing MongoDB Keep Everything Default_

## Make Sure MongoDB is Running as a Service

![](https://i.imgur.com/2Osus8S.png)


#### Port Forwarding

At the very least you will need to open port 7788 for your main server.

You will need to open the following ports in your **Windows Firewall** and **Router**.

* 7788
* 9111

Here's a `.bat` script that will open both ports in your **Windows Firewall.**

```text
ECHO OFF

echo Opening 7788 for TCP
netsh advfirewall firewall add rule name="alt:V-7788-IN-TCP" dir=in action=allow protocol=TCP localport=7788
netsh advfirewall firewall add rule name="alt:V-7788-OUT-TCP" dir=out action=allow protocol=TCP localport=7788

echo Opening 9111 for TCP
netsh advfirewall firewall add rule name="alt:V-9111-IN-TCP" dir=in action=allow protocol=TCP localport=9111
netsh advfirewall firewall add rule name="alt:V-9111-OUT-TCP" dir=out action=allow protocol=TCP localport=9111

echo Opening 7788 for UDP
netsh advfirewall firewall add rule name="alt:V-7788-IN-UDP" dir=in action=allow protocol=UDP localport=7788
netsh advfirewall firewall add rule name="alt:V-7788-OUT-UDP" dir=out action=allow protocol=UDP localport=7788

echo Opening 9111 for UDP
netsh advfirewall firewall add rule name="alt:V-9111-IN-UDP" dir=in action=allow protocol=UDP localport=9111
netsh advfirewall firewall add rule name="alt:V-9111-OUT-UDP" dir=out action=allow protocol=UDP localport=9111

pause
```

If you need additional help with port forwarding in your router you should check out this[ Port Forward Website](https://portforward.com/router.htm) where you can find instructions for your router based on brand.

## Linux Ubuntu 18.04

The recommended distro for alt:V is Ubuntu 18.04. You are going to need to perform a handful of Linux commands through a **shell/terminal interface** to fully utilize this framework. This can often be done with [Putty ](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)on a Windows computer. Athena will **only work** with an **unmanaged vps** or **unmanaged dedicated server**.

What that means for you as an end-user is using one of the following services:

* [Search for a Server](https://www.serverhunter.com/?search=III-WKN-HCH)
* [Digital Ocean](https://m.do.co/c/0a2a8f925176)
* [Vultr](https://www.vultr.com/?ref=8765742)
* [Linode](https://www.linode.com/?r=c47f0e725298f2f75972a9750cedb2e0decc3046)
* [OVH Game Servers](https://us.ovhcloud.com/bare-metal/game/prices/)

[If you are not sure how to use SSH click this link](https://www.youtube.com/watch?v=pWDHUlvcAsg) and learn how to use SSH.

[If you are not sure how to copy files to a VPS or Dedicated server click this link.](https://www.youtube.com/watch?v=w1Tqr7Wk5aU)

#### General Server Recommendation for Starting Out

This is just a general server recommendation for Linux Servers. If you can afford a OVH Game Server and have the player base for it; it is highly recommended for their anti-ddos services.

* 2 Cores
* 3+ GHz Processor
* 4 - 32GB of RAM
* Unmetered Incoming Bandwidth
* Unmetered Outgoing Bandwidth
* SSD 100GB~
* Anti-DDoS Service

#### Port Forwarding

```text
sudo ufw allow 7788
sudo ufw allow 9111
```

Special Note: Your server host may have an additional firewall option in their control panel. Ensure you open your ports through there as well. OVH is known to have this feature.

### Install libatomic1

This is used by alt:V

```text
sudo apt-get install libatomic1
```

### Install GIT

Run the following commands to install GIT on Ubuntu 18.04

```text
sudo apt install git
```

### Install NodeJS

Run the following commands to install NodeJS on Ubuntu 18.04

```text
sudo apt install curl
```

```text
curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh -o install_nvm.sh
```

```text
bash install_nvm.sh
```

```text
source ~/.bashrc
```

```text
nvm install 14
```

```text
node --version && npm --version
```

NodeJS should be installed and both commands should return a version.

### Install MongoDB

It is highly recommended you checkout [how to setup a secure MongoDB instance](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-mongodb-on-ubuntu-16-04) through Digital Ocean's documentation as it will fit your needs. However, I've provided basic setup instructions below that works without authentication to the database.

Run the following commands to install MongoDB on Ubuntu 18.04.

```text
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```

```text
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```

```text
sudo apt-get update
```

```text
sudo apt-get install -y mongodb-org
```

#### Running MongoDB

```text
sudo systemctl start mongod
```

If an **error occurs** try running this first:

```text
sudo systemctl daemon-reload
```

#### Checking Status of MongoDB

```text
sudo systemctl status mongod
```

