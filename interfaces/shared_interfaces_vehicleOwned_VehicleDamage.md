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

[shared/interfaces/vehicleOwned.ts:31](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/shared/interfaces/vehicleOwned.ts#L31)

___

### lights

• `Optional` **lights**: [`PartDamage`](../modules/shared_interfaces_vehicleOwned.md#PartDamage)[]

What lights are damaged.

#### Defined in

[shared/interfaces/vehicleOwned.ts:55](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/shared/interfaces/vehicleOwned.ts#L55)

___

### parts

• `Optional` **parts**: `Object`

What parts are damaged.

#### Index signature

▪ [part: `string`]: [`PartDamage`](../modules/shared_interfaces_vehicleOwned.md#PartDamage)

#### Defined in

[shared/interfaces/vehicleOwned.ts:23](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/shared/interfaces/vehicleOwned.ts#L23)

___

### wheels

• `Optional` **wheels**: [`PartDamage`](../modules/shared_interfaces_vehicleOwned.md#PartDamage)[]

What wheels are damaged.

#### Defined in

[shared/interfaces/vehicleOwned.ts:47](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/shared/interfaces/vehicleOwned.ts#L47)

___

### windows

• `Optional` **windows**: `Object`

What windows are damaged.

#### Index signature

▪ [part: `string`]: [`PartDamage`](../modules/shared_interfaces_vehicleOwned.md#PartDamage)

#### Defined in

[shared/interfaces/vehicleOwned.ts:39](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/shared/interfaces/vehicleOwned.ts#L39)
