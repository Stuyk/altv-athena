---
title: AthenaShared.interfaces.vehicleBase.BaseVehicle
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/vehicleBase](../modules/shared_interfaces_vehicleBase.md).BaseVehicle

Used as the main describer of a stored vehicle.

**`Interface`**

BaseVehicle

## Hierarchy

- **`BaseVehicle`**

  ↳ [`OwnedVehicle`](shared_interfaces_vehicleOwned_OwnedVehicle.md)

## Properties

### \_id

• `Optional` **\_id**: `unknown`

The vehicle identifier for the database.
Also used to save to the database.

#### Defined in

[shared/interfaces/vehicleBase.ts:16](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L16)

___

### dimension

• **dimension**: `number`

Used to control what dimension this vehicle should spawn in / be found in

#### Defined in

[shared/interfaces/vehicleBase.ts:61](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L61)

___

### doNotDespawn

• `Optional` **doNotDespawn**: `boolean`

Flag this value to prevent this vehicle from ever being despawned

#### Defined in

[shared/interfaces/vehicleBase.ts:110](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L110)

___

### fuel

• **fuel**: `number`

The fuel level for this vehicle.

#### Defined in

[shared/interfaces/vehicleBase.ts:93](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L93)

___

### garageInfo

• `Optional` **garageInfo**: `number`

Set this value to an indexable garage.
If this value is set it means it will not be spawned when a player joins.

#### Defined in

[shared/interfaces/vehicleBase.ts:102](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L102)

___

### groups

• `Optional` **groups**: `Object`

A key value pair of a group, and what permissions they have in that group.

**`Memberof`**

BaseVehicle

#### Index signature

▪ [key: `string`]: `string`[]

#### Defined in

[shared/interfaces/vehicleBase.ts:126](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L126)

___

### id

• `Optional` **id**: `number`

The vehicle id for lookups.

#### Defined in

[shared/interfaces/vehicleBase.ts:23](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L23)

___

### keys

• **keys**: `string`[]

A list of character ids that have access to this vehicle

#### Defined in

[shared/interfaces/vehicleBase.ts:77](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L77)

___

### lastUsed

• `Optional` **lastUsed**: `number`

The last known timestamp when this vehicle was used.

#### Defined in

[shared/interfaces/vehicleBase.ts:118](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L118)

___

### model

• **model**: `string`

The model of this vehicle.

#### Defined in

[shared/interfaces/vehicleBase.ts:40](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L40)

___

### owner

• **owner**: `string`

The player who is the owner of this vehicle.
Corresponds with character._id or null if it belongs to anything else
Obviously permissions and keys should be used if no owner is set.

#### Defined in

[shared/interfaces/vehicleBase.ts:33](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L33)

___

### permissions

• **permissions**: `string`[]

A list of character permissions that have access to this vehicle

#### Defined in

[shared/interfaces/vehicleBase.ts:85](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L85)

___

### plate

• **plate**: `string`

A unique identifier for this specific vehicle.
Usually automatically generated.

#### Defined in

[shared/interfaces/vehicleBase.ts:69](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L69)

___

### pos

• **pos**: `IVector3`

The last position where this vehicle was last left.

#### Defined in

[shared/interfaces/vehicleBase.ts:47](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L47)

___

### rot

• **rot**: `IVector3`

The last rotation where this vehicle was last left.

#### Defined in

[shared/interfaces/vehicleBase.ts:54](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/shared/interfaces/vehicleBase.ts#L54)
