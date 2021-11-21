---
description: >-
    Learn how to add icons for your items.
---

# Adding Inventory Icons

Adding icons for the inventory must be done in a `.png` format as it's the most accessible. It's recommended that you use at least `64x64` or a `128x128` image. Anything larger will pretty much be pointless since the inventory doesn't scale much larger.

Icons need to be placed inside of:

```
src-webviews/public/assets/icons
```

It is highly recommended that you compress your `.png` file after it has been resized.

Check out [PNG Gauntlet](https://pnggauntlet.com/) for resizing several images.

# Video Guide

[![Interaction Video Guide](https://img.youtube.com/vi/dPztbrxcqQ8/0.jpg)](https://www.youtube.com/watch?v=dPztbrxcqQ8)

# Broken Images?

If you are running in **production mode** add the resource `webserver` before core in your `server.cfg`.

If you are running in **development mode** you may not have added `WEBSERVER_IP` to your `.env` file.

You can append the following to make it work locally for development mode:

```
WEBSERVER_IP=127.0.0.1:9111
```

When you run the server in development mode you can verify images are available through this URL.

```
http://127.0.0.1:9111/icons/advancedrifle.png
```