---
description: >-
    Learn where to place mods for your server.
---

# Where to Place Mods

Mods are a bit tricky with alt:V but the alt:V Discord should always be your #1 place to ask for modding support and ask general questions. In those regards Athena copies all files from the `./src` directory into the `./resources` directory.

**DO NOT PLACE ANYTHING IN THE `./resources` FOLDER**

Anything inside of `./resources` will always be deleted when you compile or start this game mode.

Anything inside of the `./src` folder that is not a `.ts` file will be copied over to `resources` after compilation.

This is necessary to ensure a clean build is created for each deployment.

### Example Path

`./src/hospital`
