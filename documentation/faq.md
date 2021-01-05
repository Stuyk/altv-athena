---
description: Frequently asked questions.
---

# FAQ

## May I share my license?

In the future licenses will be checked for multiple users and be restricted to around 2-3 IPs using it at once time. I feel it's fair that each license should belong to one individual or a small team.

## How long until 'x' feature?

I can't predict the future. However, I work on this project when I'm not being bogged down by my work and general life.

## How do I preview the Athena project?

You can view some general screenshots, gifs, etc. in the Athena Discord.

## How do I check what version I am using?

Check your `package.json` and check under `version`.

## Failed to contact server to post login details?

Usually means port 7790 is closed. Make sure to open it on your router and in your windows > firewall. Use https://www.yougetsignal.com/tools/open-ports/ to verify your port(s) are open while the serving is running.

## Failed to find access_token

Ares may have run into an issue when trying to assign a Token to a user who was attempting to login. This is a pretty rare occurrence. Have the user try logging in again.

## Interfaces are sometimes laggy or delayed.

Turn down your MSAA in your graphics settings. It apparently happens depending on your graphics card. Turning MSAA down to x2 instead of x4 or x8 instantly fixes this issue. It's a strange bug that alt:V has but nobody has a lead on.

## What server hosts do your recommend for deployment?

OVH (Game Servers Only), Linode, Avoro, AWS. I do not recommend a server host that cannot provide you a linux shell you can connect to and customize for your server's deployment and get the right database software installed. Look for a dedicated server or a vps that isn't just over FTP. You should be uploading your gamemode to a private repository and pulling it down on your server.
