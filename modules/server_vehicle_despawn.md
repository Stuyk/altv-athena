---
title: Athena.vehicle.despawn
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### all

::: tip Usage
Athena.vehicle.despawn.**all**(): `Promise`<`void`\>
:::

Despawns all vehicles, except for vehicles flagged to prevent despawning.

May take some time to despawn, and save all vehicle data.

Wait for this function to finish before attempting to respawn.

#### Returns

`Promise`<`void`\>

#### Defined in

[server/vehicle/despawn.ts:13](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/vehicle/despawn.ts#L13)

___

### list

::: tip Usage
Athena.vehicle.despawn.**list**(`ids`): `Promise`<`void`\>
:::

Despawn a list of vehicles by identifier

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `number`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/vehicle/despawn.ts:100](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/vehicle/despawn.ts#L100)

___

### one

::: tip Usage
Athena.vehicle.despawn.**one**(`id`): `Promise`<`boolean`\>
:::

Returns true if the vehicle has been despawned / destroyed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/despawn.ts:63](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/vehicle/despawn.ts#L63)

___

### override

::: tip Usage
Athena.vehicle.despawn.**override**(`functionName`, `callback`): `any`
:::

Used to override despawn vehicle functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"all"`` |
| `callback` | () => `Promise`<`void`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/despawn.ts:122](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/vehicle/despawn.ts#L122)

::: tip Usage
Athena.vehicle.despawn.**override**(`functionName`, `callback`): `any`
:::

Used to override despawn vehicle functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"one"`` |
| `callback` | (`id`: `number`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/despawn.ts:123](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/vehicle/despawn.ts#L123)

::: tip Usage
Athena.vehicle.despawn.**override**(`functionName`, `callback`): `any`
:::

Used to override despawn vehicle functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"list"`` |
| `callback` | (`ids`: `number`[]) => `Promise`<`void`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/despawn.ts:124](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/vehicle/despawn.ts#L124)
