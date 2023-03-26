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

▸ (`value`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

##### Returns

`void`

#### Defined in

[client/systems/playerConfig.ts:4](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/systems/playerConfig.ts#L4)

## Functions

### addCallback

▸ **addCallback**<`CustomKeys`\>(`key`, `callback`): `void`

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

[client/systems/playerConfig.ts:38](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/systems/playerConfig.ts#L38)

___

### get

▸ **get**<`ReturnType`, `CustomKeys`\>(`key`): `ReturnType` \| `undefined`

Get a value assigned by the server.

#### Type parameters

| Name |
| :------ |
| `ReturnType` |
| `CustomKeys` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `any` |

#### Returns

`ReturnType` \| `undefined`

#### Defined in

[client/systems/playerConfig.ts:27](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/systems/playerConfig.ts#L27)
