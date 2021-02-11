---
description: Learn how to add commands to your game mode.
---

# Adding Commands

Adding commands can be done through the CommandController interface. This interface provides all the necessary functions for you to add a command and bind the functionality of what should happen during a command.

## server/commands

Inside of the Athena framework you will find a folder called `commands` in the `server` directory. Inside you will find various pre-baked commands that come with this game mode that will help you understand the logic behind writing a command.

## Writing a Command

Create a file and call it anything you want. We're going to call this one `myCommand.ts`.

Open the file and add these two imports at the very top.

```typescript
import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { Permissions } from '../../shared/flags/permissions';
```

When you're working with commands you will want to start by typing `ChatController.`

Inside of an development program such as Visual Studio Code it will give you auto-completion information.

![](https://i.imgur.com/dS88Dnw.png)

You're going to write the basis for your first command.

```typescript
import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { Permissions } from '../../shared/flags/permissions';

ChatController.addCommand('mycommand', '/mycommand - does stuff', Permissions.None, handleCommand);

function handleCommand(player: alt.Player) {
    player.emit().message(`Hello from server-side`);
}
```

Once our file has some basic command functionality written we can then import it in the `commands.ts` file.

Which can be done by adding:

```typescript
import './myCommand';
```

Now when a player types `/mycommand` in-game they will receive a message from the server.

It's quite simple.

## Building Off Example

It's highly recommended that you check out the other commands in the folder to see how they function.

There are great examples of processing messages, numbers, ids, etc. that will help you understand the rest.

