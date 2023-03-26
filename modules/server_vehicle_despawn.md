---
title: Athena.vehicle.despawn
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### all

▸ **all**(): `Promise`<`void`\>

Despawns all vehicles, except for vehicles flagged to prevent despawning.

May take some time to despawn, and save all vehicle data.

Wait for this function to finish before attempting to respawn.

**`Export`**

#### Returns

`Promise`<`void`\>

#### Defined in

[server/vehicle/despawn.ts:13](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/despawn.ts#L13)

___

### list

▸ **list**(`ids`): `Promise`<`void`\>

Despawn a list of vehicles by identifier

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `number`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/vehicle/despawn.ts:100](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/despawn.ts#L100)

___

### one

▸ **one**(`id`): `Promise`<`boolean`\>

Returns true if the vehicle has been despawned / destroyed.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/despawn.ts:63](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/despawn.ts#L63)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override despawn vehicle functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"all"`` |
| `callback` | () => `Promise`<`void`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/despawn.ts:122](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/despawn.ts#L122)

▸ **override**(`functionName`, `callback`): `any`

Used to override despawn vehicle functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"one"`` |
| `callback` | (`id`: `number`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/despawn.ts:123](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/despawn.ts#L123)

▸ **override**(`functionName`, `callback`): `any`

Used to override despawn vehicle functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"list"`` |
| `callback` | (`ids`: `number`[]) => `Promise`<`void`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/despawn.ts:124](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/despawn.ts#L124)
