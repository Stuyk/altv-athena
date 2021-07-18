---
description: Frequently asked questions.
---

# FAQ

- [FAQ](#faq)
  - [Should I use this without knowing programming?](#should-i-use-this-without-knowing-programming)
  - [Do I actually need to buy a license?](#do-i-actually-need-to-buy-a-license)
  - [How do I purchase a license?](#how-do-i-purchase-a-license)
  - [Is there a lifetime package?](#is-there-a-lifetime-package)
  - [Why should I buy this framework?](#why-should-i-buy-this-framework)
  - [Do you have a Roadmap?](#do-you-have-a-roadmap)
  - [What happens after Athena stops development?](#what-happens-after-athena-stops-development)
  - [Server Specification Recommendations](#server-specification-recommendations)
  - [How do I install this one linux!?](#how-do-i-install-this-one-linux)
  - [How do I keep my files while staying up-to-date?](#how-do-i-keep-my-files-while-staying-up-to-date)
  - [Why MongoDB?](#why-mongodb)
  - [Can I use MySQL?](#can-i-use-mysql)
  - [How do I use a CDN?](#how-do-i-use-a-cdn)
  - [Downloads are super slow?](#downloads-are-super-slow)
  - [Do you provide custom support / scripts?](#do-you-provide-custom-support--scripts)
  - [Will all features be free?](#will-all-features-be-free)
  - [May I share my license?](#may-i-share-my-license)
  - [Theoretical Player Limitations?](#theoretical-player-limitations)
  - [Cannot Interact with Anything](#cannot-interact-with-anything)
  - [How long until 'x' feature?](#how-long-until-x-feature)
  - [How do I preview the Athena project?](#how-do-i-preview-the-athena-project)
  - [How do I check what version I am using?](#how-do-i-check-what-version-i-am-using)
  - [Failed to contact server to post login details?](#failed-to-contact-server-to-post-login-details)
  - [Failed to find access\_token](#failed-to-find-access_token)
  - [Interfaces are sometimes laggy or delayed.](#interfaces-are-sometimes-laggy-or-delayed)
  - [What server hosts do your recommend for deployment?](#what-server-hosts-do-your-recommend-for-deployment)
  - [How do I switch branches?](#how-do-i-switch-branches)
  - [What about mods?](#what-about-mods)
  - [What is Ares?](#what-is-ares)
  - [Do I have to use Discord?](#do-i-have-to-use-discord)
  - [Images are Broken in-game](#images-are-broken-in-game)

## Should I use this without knowing programming?

That is your own decision to make. However, having actual programming knowledge will make using this framework infinitely easier to understand and build off of. **IF YOU CAN'T USE COMMAND LINE TERMINALS THIS IS NOT FOR YOU.**

## Do I actually need to buy a license?

If you respect the development that I'm doing and the open source nature of the project then yes. This costs me a lot of my personal time to create an environment that new developers and experienced developers will both understand with a little bit of time. I've written a lot of open source alt:V resources and this builds on experience you may not get otherwise.

## How do I purchase a license?

You may obtain a license from [https://gum.co/SKpPN](https://gum.co/SKpPN). The process is entirely automated. Please review the documentation and installation instructions for booting up the gamemode after purchase.

## Is there a lifetime package?

No, we only offer a subscription based roleplay script as this is a solid way for us to continue pushing updates for each change that GTA 5 receives. Paying for Athena means you are receiving support for upcoming changes, performance improvements, and new features.


## Why should I buy this framework?

You will be able to startup a Roleplay server almost out of the gate by the time the core features of this project are completed. It's written in a way that makes it extendable and can tap into the various utilities that are built into this script. You get my experience, and intellectual knowledge crafted into a neat package for your consumption. You get the right to modify, and use this framework by simply supporting the core development work needed to create a stable experience.

## Do you have a Roadmap?

No. Unfortunately a Roadmap is determined based on the needs of the main developer. If there is a need for reduced build times, the main developer will work on increasing build times. If there is a need for a phone system, the phone system will be written. It's all dependent on the origin of a problem and what needs to be done to reach a solution for that specific problem.

## What happens after Athena stops development?

The script becomes fully open source and the bootup instructions are released publicly for everyone to gain access. However, this project will likely see at least 3 years of on-going development, performance improvements, and pushing for increased ease-of-use.

## Server Specification Recommendations

You do not need a ton of RAM for a GTA:V server. Make sure you're not overdoing it. I've seen large player cap servers paying for 64GB of RAM which is completely unnecessary.

```
- 2 Cores
- 3+ GHz Processor
- 8GB - 16GB of RAM
- Unmetered Incoming Bandwidth
- Unmetered Outgoing Bandwidth
- SSD 100GB~
- Anti-DDoS Service
```

## How do I install this one linux!?

Here's a video that covers the entire installation process for Athena on Linux.

 https://www.youtube.com/watch?v=5aXU_4-6tWI

## How do I keep my files while staying up-to-date?

In most cases if you put things inside of the extras folder for Athena you will not lose them when you pull down updates from the main Athena repository. It is highly recommended that you get a firm grasp on git as far as pulling, merging, etc.

Check out the installation guide for Athena to get an understanding of what merge conflicts are. There's even a video that covers the topic.

## Why MongoDB?

If you are not handling millions of customers at a time then MongoDB is more than sufficient for your Roleplay server. MongoDB and Javascript go hand in hand and it's extremely easy to work with MongoDB.

MongoDB simply lets you store javascript objects into a database and that makes synchronization of data, adding new fields, and managing player data **VERY** easy.

## Can I use MySQL?

Sure, but you're going to have write the interface and disconnect MongoDB from the current gamemode. If you are not sure what you're doing then this task might seem impossible.

## How do I use a CDN?

CDNs need to have a lower TTL time of about 1 to 10 minutes if you are making frequent updates. It is highly recommended that you only use a CDN when you are deploying your infrastructure and going into production mode. You may follow alt:V's CDN guide as a general setup guide.

https://wiki.altv.mp/wiki/Tutorial:Setup_CDN

Side note: It's a lot easier than it seems. Tried it myself without any issues.

## Downloads are super slow?

If you are running a production server without a CDN it is highly recommended that you get a CDN as soon as possible to split the load between downloading server files and playing on the server.

https://wiki.altv.mp/wiki/Tutorial:Setup_CDN

## Do you provide custom support / scripts?

I provide basic support for getting it running. However, I will not be providing support for writing most scripts. Users may tap into the shared knowledge in the Athena Discord to get some guidance on how to create or construct new scripts.

## Will all features be free?

The core features, items, etc. will always come with Athena. However, the data to construct complex jobs in the eventual Job Framework will likely become addons that you can get for your server. Feel free to write your own jobs though.

## May I share my license?

Licenses are currently limited to 5 IP\(s\) at any given time. If the number of IP\(s\) is exceeded you will have to wait until Ares is rebooted to get a reset on usage.

## Theoretical Player Limitations?

The Athena framework has not been tested with high player counts yet. However, compared to the old code of O:RP and the steps I've taken to ensure that client's get the best performance they can. I do believe Athena is capable of handling at least 500 players at a time. However, this will only apply to the vanilla version of Athena which means not using any additional mods.

For those who are looking to host a voice server you will likely end up hitting a cap of around 800 players as TeamSpeak may only handle 800 users at any given time.

It's recommended you split your server into two groups and provided the same features and functionality on both servers if you have a larger player base.

Obviously, you should not be running these servers on the same infrastructre.

## Cannot Interact with Anything

Make sure you press 'left alt' before you do anything. This turn son a bunch of loops to help with interacting and figuring out what the player needs to do. This is purposely left off to ensure client's get the highest performacne while playing with the Athena Framework.

## How long until 'x' feature?

I can't predict the future. However, I work on this project when I'm not being bogged down by my work and general life.

## How do I preview the Athena project?

You can view some general screenshots, gifs, etc. in the Athena Discord.

## How do I check what version I am using?

Check your `package.json` and check under `version`.

## Failed to contact server to post login details?

Usually means port 7790 is closed. Make sure to open it on your router and in your windows &gt; firewall. Use [https://www.yougetsignal.com/tools/open-ports/](https://www.yougetsignal.com/tools/open-ports/) to verify your port\(s\) are open while the serving is running.

## Failed to find access\_token

Ares may have run into an issue when trying to assign a Token to a user who was attempting to login. This is a pretty rare occurrence. Have the user try logging in again.

## Interfaces are sometimes laggy or delayed.

Turn down your MSAA in your graphics settings. It apparently happens depending on your graphics card. Turning MSAA down to x2 instead of x4 or x8 instantly fixes this issue. It's a strange bug that alt:V has but nobody has a lead on.

## What server hosts do your recommend for deployment?

OVH \(Game Servers Only\), Linode, Avoro, AWS. I do not recommend a server host that cannot provide you a linux shell you can connect to and customize for your server's deployment and get the right database software installed. Look for a dedicated server or a vps that isn't just over FTP. You should be uploading your gamemode to a private repository and pulling it down on your server.

## How do I switch branches?

Depending on your needs you can switch branches if you clone down the repository by performing the following commands in your terminal/console.

```
git checkout <branch_name>
git pull origin <branch_name>
```

If you made local changes you will need to either commit them or stash them before changing branches.

## What about mods?

alt:V actively supports mods. However, Athena is built with vanilla GTA:V in mind and will not be adding additional mods and data unless it benefits the gamemode. Mods are supported, there just will not be supported provided by the Athena main developer.

## What is Ares?

Ares is the backend service and Discord Authorization handler. Ares provides a simple way for your users to easily log into your server by Authenticating with Discord through their browser.

## Do I have to use Discord?

If you wish to use a whitelist and some other features then the answer is yes. However, you may remove the Discord based login and you will have to make a large amount of changes to unhook the Discord Authentication service.

## Images are Broken in-game

You need to port forward 9111 to enable the web server for your server.