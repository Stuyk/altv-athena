---
title: AthenaClient.interface.hotkeys.KeyInfo
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/interface/hotkeys](../modules/client_interface_hotkeys.md).KeyInfo

## Hierarchy

- [`BaseKeyInfo`](client_interface_hotkeys_BaseKeyInfo.md)

  ↳ **`KeyInfo`**

## Properties

### allowIfDead

• `Optional` **allowIfDead**: ``true``

Allow using the keybind even if the player is dead.

**`Memberof`**

BaseKeyInfo

#### Inherited from

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[allowIfDead](client_interface_hotkeys_BaseKeyInfo.md#allowIfDead)

#### Defined in

[client/interface/hotkeys.ts:209](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L209)

___

### allowInAnyMenu

• `Optional` **allowInAnyMenu**: ``true``

If set to true, any page / menu will allow triggering this keybind.

#### Inherited from

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[allowInAnyMenu](client_interface_hotkeys_BaseKeyInfo.md#allowInAnyMenu)

#### Defined in

[client/interface/hotkeys.ts:201](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L201)

___

### allowInSpecificPage

• `Optional` **allowInSpecificPage**: `string`

Allows the keybind to be ignore menu checks if in a specific page.

#### Inherited from

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[allowInSpecificPage](client_interface_hotkeys_BaseKeyInfo.md#allowInSpecificPage)

#### Defined in

[client/interface/hotkeys.ts:217](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L217)

___

### delayedKeyDown

• `Optional` **delayedKeyDown**: `Object`

Only triggered when `msToTrigger` is also specified for this key bind.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | `Function` | Function to call after the criteria is met. |
| `msToTrigger?` | `number` | Milliseconds needed to trigger this keybind. Used for triggering if the key is held long enough. The trigger is fired instantly after the time point is exceeded. |

#### Overrides

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[delayedKeyDown](client_interface_hotkeys_BaseKeyInfo.md#delayedKeyDown)

#### Defined in

[client/interface/hotkeys.ts:80](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L80)

___

### description

• **description**: `string`

Describe what this keybind is meant to do.

#### Inherited from

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[description](client_interface_hotkeys_BaseKeyInfo.md#description)

#### Defined in

[client/interface/hotkeys.ts:141](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L141)

___

### disabled

• `Optional` **disabled**: `boolean`

Set a key as disabled, preventing all function callbacks.

#### Defined in

[client/interface/hotkeys.ts:123](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L123)

___

### doNotAllowRebind

• `Optional` **doNotAllowRebind**: `boolean`

Prevent his key from being rebound?

#### Inherited from

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[doNotAllowRebind](client_interface_hotkeys_BaseKeyInfo.md#doNotAllowRebind)

#### Defined in

[client/interface/hotkeys.ts:239](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L239)

___

### identifier

• **identifier**: `string`

Give a keybind an identifier, like a unique id.

#### Inherited from

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[identifier](client_interface_hotkeys_BaseKeyInfo.md#identifier)

#### Defined in

[client/interface/hotkeys.ts:149](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L149)

___

### key

• **key**: `number`

The primary key for this keybind.

#### Inherited from

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[key](client_interface_hotkeys_BaseKeyInfo.md#key)

#### Defined in

[client/interface/hotkeys.ts:133](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L133)

___

### keyDown

• `Optional` **keyDown**: `Function`

Call this function when the key is pressed down once.

#### Defined in

[client/interface/hotkeys.ts:72](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L72)

___

### keyUp

• `Optional` **keyUp**: `Function`

Call this function when the key is let go.
This function is only called when a key is released.

#### Overrides

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[keyUp](client_interface_hotkeys_BaseKeyInfo.md#keyUp)

#### Defined in

[client/interface/hotkeys.ts:106](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L106)

___

### modifier

• `Optional` **modifier**: ``"shift"`` \| ``"ctrl"`` \| ``"alt"``

Specify a modifier for this key to trigger

#### Inherited from

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[modifier](client_interface_hotkeys_BaseKeyInfo.md#modifier)

#### Defined in

[client/interface/hotkeys.ts:193](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L193)

___

### restrictions

• `Optional` **restrictions**: [`KeyBindRestrictions`](client_interface_hotkeys_KeyBindRestrictions.md)

Restrictions to apply to this key bind.
These are all optional. By default key binds work regardless of setting these values.

#### Inherited from

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[restrictions](client_interface_hotkeys_BaseKeyInfo.md#restrictions)

#### Defined in

[client/interface/hotkeys.ts:231](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L231)

___

### spamPreventionInMs

• `Optional` **spamPreventionInMs**: `number`

The amount of milliseconds before this hotkey can be pressed again.

#### Inherited from

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[spamPreventionInMs](client_interface_hotkeys_BaseKeyInfo.md#spamPreventionInMs)

#### Defined in

[client/interface/hotkeys.ts:225](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L225)

___

### whilePressed

• `Optional` **whilePressed**: `Function`

Call this function on repeat while this key is held down.
Equivalent to an everyTick.

#### Overrides

[BaseKeyInfo](client_interface_hotkeys_BaseKeyInfo.md).[whilePressed](client_interface_hotkeys_BaseKeyInfo.md#whilePressed)

#### Defined in

[client/interface/hotkeys.ts:115](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/interface/hotkeys.ts#L115)
