---
title: AthenaClient.systems.hotkeyRegistry
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### KeyInfoDefault

Ƭ **KeyInfoDefault**: [`player`](server_config.md#player) & { `default`: `number`  }

#### Defined in

[client/systems/hotkeyRegistry.ts:8](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/systems/hotkeyRegistry.ts#L8)

## Functions

### add

▸ **add**(`keyBind`): `void`

Add a key bind to the start listening for key presses.
https://www.toptal.com/developers/keycode

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyBind` | `KeyInfo` |

#### Returns

`void`

#### Defined in

[client/systems/hotkeyRegistry.ts:236](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/systems/hotkeyRegistry.ts#L236)

___

### checkValidation

▸ **checkValidation**(`keyOrIdentifier`): `boolean`

Used to check if a keybind passes certain validation metrics.
Useful for show on-screen data related to a key bind.
Should only be called periodically. Roughly every 500ms~1s

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyOrIdentifier` | `string` \| `number` |

#### Returns

`boolean`

#### Defined in

[client/systems/hotkeyRegistry.ts:254](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/systems/hotkeyRegistry.ts#L254)

___

### disable

▸ **disable**(`keyOrIdentifier`): `void`

Disble a keybind

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyOrIdentifier` | `string` \| `number` |

#### Returns

`void`

#### Defined in

[client/systems/hotkeyRegistry.ts:268](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/systems/hotkeyRegistry.ts#L268)

___

### enable

▸ **enable**(`keyOrIdentifier`): `void`

Enable a keybind

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyOrIdentifier` | `string` \| `number` |

#### Returns

`void`

#### Defined in

[client/systems/hotkeyRegistry.ts:277](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/systems/hotkeyRegistry.ts#L277)

___

### hotkey

▸ **hotkey**(`keyOrIdentifier`): [`player`](server_config.md#player) \| `undefined`

Return a keybind information for a key.
Returns undefined if key is not bound, or found.

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyOrIdentifier` | `string` \| `number` |

#### Returns

[`player`](server_config.md#player) \| `undefined`

#### Defined in

[client/systems/hotkeyRegistry.ts:324](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/systems/hotkeyRegistry.ts#L324)

___

### hotkeys

▸ **hotkeys**(): [`KeyInfoDefault`](client_systems_hotkeyRegistry.md#KeyInfoDefault)[]

Returns all hotkeys and their relevant information.

#### Returns

[`KeyInfoDefault`](client_systems_hotkeyRegistry.md#KeyInfoDefault)[]

#### Defined in

[client/systems/hotkeyRegistry.ts:313](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/systems/hotkeyRegistry.ts#L313)

___

### rebind

▸ **rebind**(`keyOrIdentifier`, `keyCode`): `void`

Allows a key to be rebound at runtime.
Once a key is rebound, it will automatically be loaded on server rejoin.

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyOrIdentifier` | `string` \| `number` |
| `keyCode` | `number` |

#### Returns

`void`

#### Defined in

[client/systems/hotkeyRegistry.ts:286](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/systems/hotkeyRegistry.ts#L286)
