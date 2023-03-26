---
title: AthenaClient.streamers.ped
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### append

::: tip Usage
AthenaClient.streamers.ped.**append**(`pedData`): `void`
:::

Create a client-only static pedestrian.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pedData` | `IPed` |

#### Returns

`void`

#### Defined in

[client/streamers/ped.ts:221](https://github.com/Stuyk/altv-athena/blob/9c5aa90/src/core/client/streamers/ped.ts#L221)

___

### get

::: tip Usage
AthenaClient.streamers.ped.**get**(`scriptId`): [`player`](server_config.md#player) \| `undefined`
:::

Gets an NPC based on their scriptID if present.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptId` | `number` |

#### Returns

[`player`](server_config.md#player) \| `undefined`

#### Defined in

[client/streamers/ped.ts:184](https://github.com/Stuyk/altv-athena/blob/9c5aa90/src/core/client/streamers/ped.ts#L184)

___

### remove

::: tip Usage
AthenaClient.streamers.ped.**remove**(`uid`): `void`
:::

Remove a client ped by uid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |

#### Returns

`void`

#### Defined in

[client/streamers/ped.ts:248](https://github.com/Stuyk/altv-athena/blob/9c5aa90/src/core/client/streamers/ped.ts#L248)
