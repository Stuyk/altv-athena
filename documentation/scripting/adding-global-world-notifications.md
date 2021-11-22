---
description: Learn how to add global world notifications.
---

# Global World Notifications

World Notifications or 3D Help Text are these cool little bubbles that show up in a 3D space. They're particularly useful for ensuring users see something specific. It's almost like an alternative to Text Labels.

![](https://i.imgur.com/n8P5cYT.jpeg)

# Usage for Global Players

Adds a single world notification to ALL players.

```ts
const uid = ServerWorldNotificationController.append({
    text: 'Hello World!',
    type: WORLD_NOTIFICATION_TYPE.ARROW_BOTTOM,
    pos: { x:195.04470825195312, y:-933.7807006835938, z:30.686779022216797},
});

// Removes it after 5 seconds.
alt.setTimeout(() => {
    ServerWorldNotificationController.remove(uid);
}, 5000);
```

# Usage for Local Player

Adds a single world notification to a single user.

```ts
const uid = ServerWorldNotificationController.addToPlayer(player, {
    text: 'Hello World!',
    type: WORLD_NOTIFICATION_TYPE.ARROW_BOTTOM,
    pos: { x:195.04470825195312, y:-933.7807006835938, z:30.686779022216797},
});

alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        ServerWorldNotificationController.removeFromPlayer(player, uid);
}, 5000);
```