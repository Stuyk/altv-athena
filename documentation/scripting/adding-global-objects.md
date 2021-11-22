---
description: Learn how to add objects to the object streamer.
---

# Summary

Object(s) inheritely are always global unless they are attached to an interior. In our case we'll just be generating some basic objects and explaining what is happening.

# Video Guide

[![Object Adding Video](https://img.youtube.com/vi/admIUGmp4-g/0.jpg)](https://www.youtube.com/watch?v=admIUGmp4-g)

# Adding a Global Object

Global Object(s) are defined as a type of object that everyone can see.

All object(s) must have a unique identifier or a `uid` just in case they need to be removed later.

```ts
ServerObjectController.append({ uid: `test-object-1`, model: 'prop_ld_int_safe_01', pos });
```

# Removing a Global Object

Global Object(s) can easily be removed if you know the `uid` of that object.

```ts
 ServerObjectController.remove('test-object-1')
```

# Adding a Local Object to a Player

Local Object(s) are only for a single player to see. Remember that the `uid` is something you define to remove it later.

```ts
ServerObjectController.addToPlayer(player, { uid: `test-object-local-1`, model: 'prop_ld_int_safe_01', pos })
```

# Removing a Local Object from a Player

As long as you know the `uid` of the local object it can be removed.

```ts        
ServerObjectController.removeFromPlayer(player, 'test-object-local-1');
```