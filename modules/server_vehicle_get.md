---
title: Athena.vehicle.get
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### ownedVehicles

::: tip Usage
Athena.vehicle.get.**ownedVehicles**(): `alt.Vehicle`[]
:::

Get all owned vehicles.

#### Example
```ts
const vehicles = Athena.vehicle.get.ownedVehicles();
```

#### Returns

`alt.Vehicle`[]

An array of owned vehicles.

#### Defined in

[server/vehicle/get.ts:32](https://github.com/Stuyk/altv-athena/blob/feb0cb2/src/core/server/vehicle/get.ts#L32)

___

### playerOwnedVehicles

::: tip Usage
Athena.vehicle.get.**playerOwnedVehicles**(`player`): `any`
:::

Takes a player instance, or `_id` and returns all spawned & owned vehicles

#### Example
```ts
function something(player: alt.Player) {
    const vehicles = Athena.vehicle.get.playerOwnedVehicles(player);
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `any` |

#### Returns

`any`

An array of vehicles owned and spawned by a player.

#### Defined in

[server/vehicle/get.ts:52](https://github.com/Stuyk/altv-athena/blob/feb0cb2/src/core/server/vehicle/get.ts#L52)

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

[server/vehicle/get.ts:15](https://github.com/Stuyk/altv-athena/blob/feb0cb2/src/core/server/vehicle/get.ts#L15)
