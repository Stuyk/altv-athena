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

### allowInAnyMenu

• `Optional` **allowInAnyMenu**: ``true``

If set to true, any page / menu will allow triggering this keybind.

**`Memberof`**

KeyInfo

#### Defined in

[client/interface/hotkeys.ts:201](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L201)

___

### allowInSpecificPage

• `Optional` **allowInSpecificPage**: `string`

Allows the keybind to be ignore menu checks if in a specific page.

**`Memberof`**

BaseKeyInfo

#### Defined in

[client/interface/hotkeys.ts:209](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L209)

___

### delayedKeyDown

• `Optional` **delayedKeyDown**: `Object`

Only triggered when `msToTrigger` is also specified for this key bind.

**`Memberof`**

KeyInfo

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `msToTrigger?` | `number` | Milliseconds needed to trigger this keybind. Used for triggering if the key is held long enough. The trigger is fired instantly after the time point is exceeded. **`Memberof`** KeyInfo |

#### Defined in

[client/interface/hotkeys.ts:157](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L157)

___

### description

• **description**: `string`

Describe what this keybind is meant to do.

**`Memberof`**

KeyInfo

#### Defined in

[client/interface/hotkeys.ts:141](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L141)

___

### doNotAllowRebind

• `Optional` **doNotAllowRebind**: `boolean`

Prevent his key from being rebound?

**`Memberof`**

BaseKeyInfo

#### Defined in

[client/interface/hotkeys.ts:231](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L231)

___

### identifier

• **identifier**: `string`

Give a keybind an identifier, like a unique id.

**`Memberof`**

KeyInfo

#### Defined in

[client/interface/hotkeys.ts:149](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L149)

___

### key

• **key**: `number`

The primary key for this keybind.

**`Memberof`**

KeyInfo

#### Defined in

[client/interface/hotkeys.ts:133](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L133)

___

### keyUp

• `Optional` **keyUp**: `Function`

Call this function when the key is let go.
This function is only called when a key is released.

**`Memberof`**

KeyInfo

#### Defined in

[client/interface/hotkeys.ts:176](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L176)

___

### modifier

• `Optional` **modifier**: ``"shift"`` \| ``"ctrl"`` \| ``"alt"``

Specify a modifier for this key to trigger

**`Memberof`**

KeyInfo

#### Defined in

[client/interface/hotkeys.ts:193](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L193)

___

### restrictions

• `Optional` **restrictions**: [`KeyBindRestrictions`](client_interface_hotkeys_KeyBindRestrictions.md)

Restrictions to apply to this key bind.
These are all optional. By default key binds work regardless of setting these values.

#### Defined in

[client/interface/hotkeys.ts:223](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L223)

___

### spamPreventionInMs

• `Optional` **spamPreventionInMs**: `number`

The amount of milliseconds before this hotkey can be pressed again.

**`Memberof`**

BaseKeyInfo

#### Defined in

[client/interface/hotkeys.ts:217](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L217)

___

### whilePressed

• `Optional` **whilePressed**: `Function`

Call this function on repeat while this key is held down.
Equivalent to an everyTick.

**`Memberof`**

KeyInfo

#### Defined in

[client/interface/hotkeys.ts:185](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/interface/hotkeys.ts#L185)
