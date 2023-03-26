---
title: AthenaClient.streamers.item
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### CreatedDrop

Ƭ **CreatedDrop**: [`player`](server_config.md#player) & { `createdObject?`: `alt.Object`  }

#### Defined in

[client/streamers/item.ts:8](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/streamers/item.ts#L8)

## Functions

### getClosest

▸ **getClosest**(): [`player`](server_config.md#player)[]

Return an array of items that are closest to the player.

**`Static`**

**`Memberof`**

ClientItemDrops

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[client/streamers/item.ts:132](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/streamers/item.ts#L132)

___

### getDropped

▸ **getDropped**(`id`): [`CreatedDrop`](client_streamers_item.md#CreatedDrop) \| `undefined`

Determine if this alt.Object is an item drop.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

[`CreatedDrop`](client_streamers_item.md#CreatedDrop) \| `undefined`

#### Defined in

[client/streamers/item.ts:161](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/streamers/item.ts#L161)

___

### setDefaultDropModel

▸ **setDefaultDropModel**(`model`): `void`

Overrides the default model for item drops.
By default it is a cardboard box.

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `string` |

#### Returns

`void`

#### Defined in

[client/streamers/item.ts:142](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/streamers/item.ts#L142)

___

### setDefaultMaxDistance

▸ **setDefaultMaxDistance**(`distance?`): `void`

Set the maximum distance a player can see item drops.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `distance?` | `number` | `5` |

#### Returns

`void`

#### Defined in

[client/streamers/item.ts:151](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/streamers/item.ts#L151)
