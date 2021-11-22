---
description: Learn where to place mods for your server.
---

# Load Order

You absolutely must put **core last** in your `server.cfg`.

Example:

```
resources: ["my-building-mod", "my-car-mod", "webserver","core"],
```

# Where to Place Mods

Mods are a bit tricky with alt:V but the alt:V Discord should always be your \#1 place to ask for modding support and ask general questions. In those regards Athena copies all files from the `./src` directory into the `./resources` directory.

**DO NOT PLACE ANYTHING IN THE `./resources` FOLDER**

Anything inside of `./resources` will always be deleted when you compile or start this game mode.

Anything inside of the `./src` folder that is not a `.ts` file will be copied over to `resources` after compilation.

This is necessary to ensure a clean build is created for each deployment.

## Example

**File Path:**

`./src/hospital`

**Resource Name**

`hospital`

# Vehicle Mods

If you are adding vehicle mods you will need to append their vehicle data to `src/core/shared/information/vehicles.ts` and add their seat count, type, class, etc.

If you do not add these your vehicle **will not** function.

Make sure you look at other example vehicles because `seat count` may not be what it seems.
