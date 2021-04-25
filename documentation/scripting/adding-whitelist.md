---
description: Whitelisting users through Discord.
---

# Discord Whitelist

**An important note before doing this...** it may take upwards of 24 hours for Discord to recognize your Presence Intent and Server Members Intent toggles. This is normal. Please be patient if your Whitelist doesn't immediately start working. This is completely out of our control.

This covers the simplest way to to setup a whitelist service for your server. This is done through using the built-in Discord Bot that comes with this server framework.

What you are going to need to do is create your very own Discord bot. Visit [https://discord.com/developers/applications](https://discord.com/developers/applications) and then create a **New Application**.

Click on **Bot** then select **Add Bot**.

![](https://i.imgur.com/sXD8ZwL.png)

After creating the bot. Scroll down and turn off `Public Bot`.

Then turn on **Presence Intent** as well ass **Server Members Intent**

![](https://i.imgur.com/Eaw7dlk.png)

You are going to need to get the secret of the bot after creating it.

![](https://i.imgur.com/zWFthOt.png)

Then you can import this secret into your `.env` file.

Create a parameter called `DISCORD_BOT` and post your Discord Bot Secret inside of it.

Then you need to add the bot to your server.

Select **OAuth2** and then tick **bot**.

![](https://i.imgur.com/E0GySAn.png)

Then select the following settings under the scopes group.

![](https://i.imgur.com/W3W36qL.png)

Copy and past the URL with permissions and paste it into your browser bar.

This will allow you to add the bot to your server.

![](https://i.imgur.com/18v4YRp.png)

After adding the bot to your server you will need to create a single role called `whitelist`. It can actually be named whatever you want but it just makes it easier to understand what is going on.

I've created the role in the roles section of Discord.

![](https://i.imgur.com/I1NWLIP.png)

Now I can copy the ID of the role and add it to the parameter in my `.env` file called `WHITELIST_ROLE`.

Your last step is to turn on the Discord Bot and Whitelist in the Athena configuration. This can be done inside `./src/core/server/athena/main.ts`

These two settings need to be set to true:

![](https://i.imgur.com/kK3p6DS.png)

## Add Two Options to .env

```text
DISCORD_BOT=NzU5MjM4...
WHITELIST_ROLE=80486922...
DISCORD_SERVER_ID=790039623...
```

