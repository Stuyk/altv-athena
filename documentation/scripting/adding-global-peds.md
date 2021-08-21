---
description: Learn how to add objects to the object streamer.
---

# Summary

Ped(s) can pe spawned globally or locally for the player. Peds accept an array of Animation arrays as a parameter when being created.
If the array contains only one set of animations, eg: ```animations: [[anim1, anim2]]```, only that set will be played, otherwise, of more sets are provided, eg: ```animations: [[anim1, anim2], [anim3]]``` then a random set will be played out of the array.
It is also possible to play an animation for an already existing ped.

# Adding a Global Object

Global Ped(s) are defined as a type of object that everyone can see.

All ped(s) must have a unique identifier or a `uid` just in case they need to be removed later.

```ts
    let anim1: Animation = {
        dict: 'random@arrests@busted',
        name: 'idle_a',
        flags: ANIMATION_FLAGS.REPEAT | ANIMATION_FLAGS.UPPERBODY_ONLY,
        duration: -1
    }
    let anim2: Animation = {
        dict: 'random@arrests',
        name: 'idle_2_hands_up',
        flags: ANIMATION_FLAGS.NORMAL | ANIMATION_FLAGS.STOP_LAST_FRAME,
        duration: -1
    }
    let anim3: Animation = {
        dict: 'dam_ko',
        name: 'drown',
        flags: ANIMATION_FLAGS.REPEAT,
        duration: -1
    }


    PedController.append({
            uid: 'test-ped-1',
            model: 'a_f_m_beach_01',
            pos: new alt.Vector3(0,0,0),
            animations: [[anim1, anim2], [anim3]],
            randomizeAppearance: true,
            heading: Math.floor(Math.random() * 360)
        }
    )
```

# Removing a Global Ped

Global Object(s) can easily be removed if you know the `uid` of that object.

```ts
 PedController.remove('test-ped-1')
```

# Adding a Local Object to a Player

Local Object(s) are only for a single player to see. Remember that the `uid` is something you define to remove it later.

```ts
PedController.addToPlayer({
        uid: 'test-ped-local-1',
        model: 'a_f_m_beach_01',
        pos: new alt.Vector3(0,0,0),
        heading: 200
    }
)

```

# Removing a Local Object from a Player

As long as you know the `uid` of the local object it can be removed.

```ts        
ObjectController.removeFromPlayer(player, 'test-ped-local-1');
```

# Play animation for existing ped

As long as you know the `uid` of the local object it can be removed.

```ts        
let anim1: Animation = {
    dict: 'random@arrests@busted',
    name: 'idle_a',
    flags: ANIMATION_FLAGS.REPEAT | ANIMATION_FLAGS.UPPERBODY_ONLY,
    duration: -1
}

let anim2: Animation = {
    dict: 'random@arrests',
    name: 'idle_2_hands_up',
    flags: ANIMATION_FLAGS.NORMAL | ANIMATION_FLAGS.STOP_LAST_FRAME,
    duration: -1
}

PedController.playAnimation('test-ped-1', [anim1,anim2])}, 5000)
```