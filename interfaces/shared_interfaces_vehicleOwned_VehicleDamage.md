---
title: AthenaShared.interfaces.vehicleOwned.VehicleDamage
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/vehicleOwned](../modules/shared_interfaces_vehicleOwned.md).VehicleDamage

Used to describe vehicle damage to apply to a vehicle.

**`Interface`**

VehicleDamage

## Properties

### bumpers

• `Optional` **bumpers**: `Object`

What bumpers are damaged.

#### Index signature

▪ [part: `string`]: [`PartDamage`](../modules/shared_interfaces_vehicleOwned.md#PartDamage)

#### Defined in

[shared/interfaces/vehicleOwned.ts:32](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/shared/interfaces/vehicleOwned.ts#L32)

___

### lights

• `Optional` **lights**: [`PartDamage`](../modules/shared_interfaces_vehicleOwned.md#PartDamage)[]

What lights are damaged.

#### Defined in

[shared/interfaces/vehicleOwned.ts:56](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/shared/interfaces/vehicleOwned.ts#L56)

___

### parts

• `Optional` **parts**: `Object`

What parts are damaged.

#### Index signature

▪ [part: `string`]: [`PartDamage`](../modules/shared_interfaces_vehicleOwned.md#PartDamage)

#### Defined in

[shared/interfaces/vehicleOwned.ts:24](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/shared/interfaces/vehicleOwned.ts#L24)

___

### wheels

• `Optional` **wheels**: [`PartDamage`](../modules/shared_interfaces_vehicleOwned.md#PartDamage)[]

What wheels are damaged.

#### Defined in

[shared/interfaces/vehicleOwned.ts:48](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/shared/interfaces/vehicleOwned.ts#L48)

___

### windows

• `Optional` **windows**: `Object`

What windows are damaged.

#### Index signature

▪ [part: `string`]: [`PartDamage`](../modules/shared_interfaces_vehicleOwned.md#PartDamage)

#### Defined in

[shared/interfaces/vehicleOwned.ts:40](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/shared/interfaces/vehicleOwned.ts#L40)
