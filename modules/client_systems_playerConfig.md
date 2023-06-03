---
title: AthenaClient.systems.playerConfig
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### ConfigCallback

Ƭ **ConfigCallback**: (`value`: `any`) => `void`

#### Type declaration

::: tip Usage
AthenaClient.systems.playerConfig.(`value`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

##### Returns

`void`

#### Defined in

[client/systems/playerConfig.ts:6](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/client/systems/playerConfig.ts#L6)

## Functions

### addCallback

::: tip Usage
AthenaClient.systems.playerConfig.**addCallback**<`CustomKeys`\>(`key`, `callback`): `void`
:::

Add a custom callback to listen for config changes.

#### Type parameters

| Name |
| :------ |
| `CustomKeys` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `any` |
| `callback` | [`ConfigCallback`](client_systems_playerConfig.md#ConfigCallback) |

#### Returns

`void`

#### Defined in

[client/systems/playerConfig.ts:42](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/client/systems/playerConfig.ts#L42)

___

### get

::: tip Usage
AthenaClient.systems.playerConfig.**get**(`key`): [`player`](server_config.md#player) \| `undefined`
:::

Get a value assigned by the server.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | ``"character-data"`` |

#### Returns

[`player`](server_config.md#player) \| `undefined`

#### Defined in

[client/systems/playerConfig.ts:22](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/client/systems/playerConfig.ts#L22)

::: tip Usage
AthenaClient.systems.playerConfig.**get**(`key`): [`player`](server_config.md#player) \| `undefined`
:::

Get a value assigned by the server.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | ``"account-data"`` |

#### Returns

[`player`](server_config.md#player) \| `undefined`

#### Defined in

[client/systems/playerConfig.ts:23](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/client/systems/playerConfig.ts#L23)
