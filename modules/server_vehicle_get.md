---
title: Athena.vehicle.get
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### ownedVehicleByDatabaseID

::: tip Usage
Athena.vehicle.get.**ownedVehicleByDatabaseID**(`id`): `Promise`<[`player`](server_config.md#player)\>
:::

Returns an owned vehicle by Database ID.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` \| `number` |

#### Returns

`Promise`<[`player`](server_config.md#player)\>

#### Defined in

[server/vehicle/get.ts:96](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/vehicle/get.ts#L96)

___

### ownedVehicleByDocumentID

::: tip Usage
Athena.vehicle.get.**ownedVehicleByDocumentID**(`_id`): `Promise`<[`player`](server_config.md#player)\>
:::

Returns an owned vehicle by Document ID.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `_id` | `string` |

#### Returns

`Promise`<[`player`](server_config.md#player)\>

#### Defined in

[server/vehicle/get.ts:85](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/vehicle/get.ts#L85)

___

### ownedVehiclesByPlayer

::: tip Usage
Athena.vehicle.get.**ownedVehiclesByPlayer**<`T`\>(`playerOrDocumentID`): `Promise`<`T`[]\>
:::

Returns a list of vehicle documents owned by the player.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `OwnedVehicle` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `playerOrDocumentID` | `any` |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[server/vehicle/get.ts:185](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/vehicle/get.ts#L185)

___

### spawnedVehicleByDatabaseID

::: tip Usage
Athena.vehicle.get.**spawnedVehicleByDatabaseID**(`id`): `alt.Vehicle` \| `undefined`
:::

Returns a spawned vehicle by their database identifier.

Not to be confused with `_id`.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` \| `number` |

#### Returns

`alt.Vehicle` \| `undefined`

#### Defined in

[server/vehicle/get.ts:28](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/vehicle/get.ts#L28)

___

### spawnedVehicleByDocumentID

::: tip Usage
Athena.vehicle.get.**spawnedVehicleByDocumentID**(`_id`): `alt.Vehicle` \| `undefined`
:::

Returns a spawned vehicle by their unique database `_id`.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `_id` | `string` |

#### Returns

`alt.Vehicle` \| `undefined`

#### Defined in

[server/vehicle/get.ts:61](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/vehicle/get.ts#L61)

___

### spawnedVehicleByEntityID

::: tip Usage
Athena.vehicle.get.**spawnedVehicleByEntityID**(`id`): `any`
:::

Used the internal alt:V Identifiers to find a vehicle.

These IDs always change, and are never the same.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`any`

#### Defined in

[server/vehicle/get.ts:15](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/vehicle/get.ts#L15)

___

### temporaryVehicles

::: tip Usage
Athena.vehicle.get.**temporaryVehicles**(): `alt.Vehicle`[]
:::

Get all temporary vehicles.

#### Example
```ts
const vehicles = Athena.vehicle.get.temporaryVehicles();
```

#### Returns

`alt.Vehicle`[]

An array of temporary vehicles.

#### Defined in

[server/vehicle/get.ts:120](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/vehicle/get.ts#L120)

___

### vehiclesSpawnedByPlayer

::: tip Usage
Athena.vehicle.get.**vehiclesSpawnedByPlayer**(`playerOrDocumentID`): `any`
:::

Takes a player instance, or `_id` and returns all spawned & owned vehicles

#### Example
```ts
function something(player: alt.Player) {
    const vehicles = Athena.vehicle.get.vehiclesSpawnedByPlayer(player);
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `playerOrDocumentID` | `any` |

#### Returns

`any`

An array of vehicles owned and spawned by a player.

#### Defined in

[server/vehicle/get.ts:157](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/vehicle/get.ts#L157)

___

### vehiclesWithOwnership

::: tip Usage
Athena.vehicle.get.**vehiclesWithOwnership**(): `alt.Vehicle`[]
:::

Get all owned vehicles.

#### Example
```ts
const vehicles = Athena.vehicle.get.vehiclesWithOwnership();
```

#### Returns

`alt.Vehicle`[]

An array of owned vehicles.

#### Defined in

[server/vehicle/get.ts:137](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/vehicle/get.ts#L137)
