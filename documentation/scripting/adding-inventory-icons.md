---
description: >-
    Learn how to add icons for your items.
---

# Adding Inventory Icons

Adding icons for the inventory must be done in a `.png` format as it's the most accessible. It's recommended that you use at least `64x64` or a `128x128` image. Anything larger will pretty much be pointless since the inventory doesn't scale much larger.

Icons need to be placed inside of:

```
utility/webserver/files/icons
```

It is highly recommended that you compress your `.png` file after it has been resized.

Check out [PNG Gauntlet](https://pnggauntlet.com/) for resizing several images.

# Broken Images?

Did you forget to port forward `9111` and verify you can make a connection to it while the server is running?

```
http://<some_ip>:9111/icons/advancedrifle.png
```