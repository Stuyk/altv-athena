---
title: AthenaClient.interface.hotkeys.BaseKeyInfo
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/interface/hotkeys](../modules/client_interface_hotkeys.md).BaseKeyInfo

## Hierarchy

- **`BaseKeyInfo`**

  ↳ [`KeyInfo`](client_interface_hotkeys_KeyInfo.md)

## Properties

### allowIfDead

• `Optional` **allowIfDead**: ``true``

Allow using the keybind even if the player is dead.

**`Memberof`**

BaseKeyInfo

#### Defined in

[client/interface/hotkeys.ts:209](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L209)

___

### allowInAnyMenu

• `Optional` **allowInAnyMenu**: ``true``

If set to true, any page / menu will allow triggering this keybind.

#### Defined in

[client/interface/hotkeys.ts:201](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L201)

___

### allowInSpecificPage

• `Optional` **allowInSpecificPage**: `string`

Allows the keybind to be ignore menu checks if in a specific page.

#### Defined in

[client/interface/hotkeys.ts:217](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L217)

___

### delayedKeyDown

• `Optional` **delayedKeyDown**: `Object`

Only triggered when `msToTrigger` is also specified for this key bind.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `msToTrigger?` | `number` | Milliseconds needed to trigger this keybind. Used for triggering if the key is held long enough. The trigger is fired instantly after the time point is exceeded. |

#### Defined in

[client/interface/hotkeys.ts:157](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L157)

___

### description

• **description**: `string`

Describe what this keybind is meant to do.

#### Defined in

[client/interface/hotkeys.ts:141](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L141)

___

### doNotAllowRebind

• `Optional` **doNotAllowRebind**: `boolean`

Prevent his key from being rebound?

#### Defined in

[client/interface/hotkeys.ts:239](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L239)

___

### identifier

• **identifier**: `string`

Give a keybind an identifier, like a unique id.

#### Defined in

[client/interface/hotkeys.ts:149](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L149)

___

### key

• **key**: `number`

The primary key for this keybind.

#### Defined in

[client/interface/hotkeys.ts:133](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L133)

___

### keyUp

• `Optional` **keyUp**: `Function`

Call this function when the key is let go.
This function is only called when a key is released.

#### Defined in

[client/interface/hotkeys.ts:176](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L176)

___

### modifier

• `Optional` **modifier**: ``"shift"`` \| ``"ctrl"`` \| ``"alt"``

Specify a modifier for this key to trigger

#### Defined in

[client/interface/hotkeys.ts:193](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L193)

___

### restrictions

• `Optional` **restrictions**: [`KeyBindRestrictions`](client_interface_hotkeys_KeyBindRestrictions.md)

Restrictions to apply to this key bind.
These are all optional. By default key binds work regardless of setting these values.

#### Defined in

[client/interface/hotkeys.ts:231](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L231)

___

### spamPreventionInMs

• `Optional` **spamPreventionInMs**: `number`

The amount of milliseconds before this hotkey can be pressed again.

#### Defined in

[client/interface/hotkeys.ts:225](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L225)

___

### whilePressed

• `Optional` **whilePressed**: `Function`

Call this function on repeat while this key is held down.
Equivalent to an everyTick.

#### Defined in

[client/interface/hotkeys.ts:185](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/interface/hotkeys.ts#L185)
