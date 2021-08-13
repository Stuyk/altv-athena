---
description: Learn how to build a Wheel Menu.
---

# Summary

Wheel Menu's are exactly how they sound. It's a wheel with a bunch of items you can select. Those items inside of the menu can have other items buried behind it. They can currently only be created on `client-side`.

# Video Guide

[![Interaction Video Guide](https://img.youtube.com/vi/15K0IWaTrhw/0.jpg)](https://www.youtube.com/watch?v=15K0IWaTrhw)

# Basic Example

This example simply has an event where if an event is passed from server to client. It will open this menu.

```ts
import * as alt from 'alt-client';
import { IWheelItem, WheelMenu } from '../utility/wheelMenu'; 
// May not be a valid path. Use auto-import feature from your code editor.

alt.onServer('open:MyMenu', () => {

    WheelMenu.create(
        'Description in Middle',
        [
            {
                name: 'Say Hi in Console',
                callback: () => {
                    alt.log('Hello World!');
                }
            }
        ],
        true // Should we move the cursor to the middle for this menu?
    );
});
```

# Nested Example

```ts
import * as alt from 'alt-client';
import { IWheelItem, WheelMenu } from '../utility/wheelMenu'; 
// May not be a valid path. Use auto-import feature from your code editor.

alt.onServer('open:MyMenu', () => {
    WheelMenu.create(
        'First Menu',
        [
            {
                name: 'Go to "A" Second Menu',
                callback: aSecondMenu
            },
             {
                name: 'Go to "B" Second Menu',
                callback: bSecondMenu
            }
        ],
        true // Should we move the cursor to the middle for this menu?
    );
});

function aSecondMenu() {
    WheelMenu.create(
        'Second Menu A',
        [
            {
                name: 'log something',
                callback: () => {
                    console.log('item from a')
                }
            }
        ],
        false
    );
}

function bSecondMenu() {
    WheelMenu.create(
        'Second Menu B',
        [
            {
                name: 'log something',
                callback: () => {
                    console.log('item from b');
                }
            }
        ],
        false
    );
}
```