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

[client/systems/hotkeyRegistry.ts:8](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/client/systems/hotkeyRegistry.ts#L8)

## Functions

### add

::: tip Usage
AthenaClient.systems.hotkeyRegistry.**add**(`keyBind`): `void`
:::

Add a key bind to the start listening for key presses.
https://www.toptal.com/developers/keycode

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyBind` | `KeyInfo` |

#### Returns

`void`

#### Defined in

[client/systems/hotkeyRegistry.ts:240](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/client/systems/hotkeyRegistry.ts#L240)

___

### checkValidation

::: tip Usage
AthenaClient.systems.hotkeyRegistry.**checkValidation**(`keyOrIdentifier`): `boolean`
:::

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

[client/systems/hotkeyRegistry.ts:258](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/client/systems/hotkeyRegistry.ts#L258)

___

### disable

::: tip Usage
AthenaClient.systems.hotkeyRegistry.**disable**(`keyOrIdentifier`): `void`
:::

Disble a keybind

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyOrIdentifier` | `string` \| `number` |

#### Returns

`void`

#### Defined in

[client/systems/hotkeyRegistry.ts:272](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/client/systems/hotkeyRegistry.ts#L272)

___

### enable

::: tip Usage
AthenaClient.systems.hotkeyRegistry.**enable**(`keyOrIdentifier`): `void`
:::

Enable a keybind

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyOrIdentifier` | `string` \| `number` |

#### Returns

`void`

#### Defined in

[client/systems/hotkeyRegistry.ts:281](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/client/systems/hotkeyRegistry.ts#L281)

___

### hotkey

::: tip Usage
AthenaClient.systems.hotkeyRegistry.**hotkey**(`keyOrIdentifier`): [`player`](server_config.md#player) \| `undefined`
:::

Return a keybind information for a key.
Returns undefined if key is not bound, or found.

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyOrIdentifier` | `string` \| `number` |

#### Returns

[`player`](server_config.md#player) \| `undefined`

#### Defined in

[client/systems/hotkeyRegistry.ts:328](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/client/systems/hotkeyRegistry.ts#L328)

___

### hotkeys

::: tip Usage
AthenaClient.systems.hotkeyRegistry.**hotkeys**(): [`KeyInfoDefault`](client_systems_hotkeyRegistry.md#KeyInfoDefault)[]
:::

Returns all hotkeys and their relevant information.

#### Returns

[`KeyInfoDefault`](client_systems_hotkeyRegistry.md#KeyInfoDefault)[]

#### Defined in

[client/systems/hotkeyRegistry.ts:317](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/client/systems/hotkeyRegistry.ts#L317)

___

### rebind

::: tip Usage
AthenaClient.systems.hotkeyRegistry.**rebind**(`keyOrIdentifier`, `keyCode`): `void`
:::

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

[client/systems/hotkeyRegistry.ts:290](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/client/systems/hotkeyRegistry.ts#L290)
