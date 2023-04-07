---
title: AthenaShared.interfaces.vehicleOwned.OwnedVehicle
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/vehicleOwned](../modules/shared_interfaces_vehicleOwned.md).OwnedVehicle

Used to describe an owned vehicle.

**`Interface`**

OwnedVehicle

## Hierarchy

- [`BaseVehicle`](shared_interfaces_vehicleBase_BaseVehicle.md)

  ↳ **`OwnedVehicle`**

## Properties

### \_id

• `Optional` **\_id**: `unknown`

The vehicle identifier for the database.
Also used to save to the database.

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[_id](shared_interfaces_vehicleBase_BaseVehicle.md#_id)

#### Defined in

[shared/interfaces/vehicleBase.ts:16](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L16)

___

### damage

• `Optional` **damage**: [`VehicleDamage`](shared_interfaces_vehicleOwned_VehicleDamage.md)

Damage to store / apply on a vehicle

#### Defined in

[shared/interfaces/vehicleOwned.ts:87](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleOwned.ts#L87)

___

### dimension

• **dimension**: `number`

Used to control what dimension this vehicle should spawn in / be found in

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[dimension](shared_interfaces_vehicleBase_BaseVehicle.md#dimension)

#### Defined in

[shared/interfaces/vehicleBase.ts:61](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L61)

___

### doNotDespawn

• `Optional` **doNotDespawn**: `boolean`

Flag this value to prevent this vehicle from ever being despawned

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[doNotDespawn](shared_interfaces_vehicleBase_BaseVehicle.md#doNotDespawn)

#### Defined in

[shared/interfaces/vehicleBase.ts:110](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L110)

___

### fuel

• **fuel**: `number`

The fuel level for this vehicle.

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[fuel](shared_interfaces_vehicleBase_BaseVehicle.md#fuel)

#### Defined in

[shared/interfaces/vehicleBase.ts:93](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L93)

___

### garageInfo

• `Optional` **garageInfo**: `number`

Set this value to an indexable garage.
If this value is set it means it will not be spawned when a player joins.

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[garageInfo](shared_interfaces_vehicleBase_BaseVehicle.md#garageInfo)

#### Defined in

[shared/interfaces/vehicleBase.ts:102](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L102)

___

### groups

• `Optional` **groups**: `Object`

A key value pair of a group, and what permissions they have in that group.

**`Memberof`**

BaseVehicle

#### Index signature

▪ [key: `string`]: `string`[]

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[groups](shared_interfaces_vehicleBase_BaseVehicle.md#groups)

#### Defined in

[shared/interfaces/vehicleBase.ts:126](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L126)

___

### id

• `Optional` **id**: `number`

The vehicle id for lookups.

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[id](shared_interfaces_vehicleBase_BaseVehicle.md#id)

#### Defined in

[shared/interfaces/vehicleBase.ts:23](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L23)

___

### keys

• **keys**: `string`[]

A list of character ids that have access to this vehicle

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[keys](shared_interfaces_vehicleBase_BaseVehicle.md#keys)

#### Defined in

[shared/interfaces/vehicleBase.ts:77](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L77)

___

### lastUsed

• `Optional` **lastUsed**: `number`

The last known timestamp when this vehicle was used.

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[lastUsed](shared_interfaces_vehicleBase_BaseVehicle.md#lastUsed)

#### Defined in

[shared/interfaces/vehicleBase.ts:118](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L118)

___

### model

• **model**: `string`

The model of this vehicle.

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[model](shared_interfaces_vehicleBase_BaseVehicle.md#model)

#### Defined in

[shared/interfaces/vehicleBase.ts:40](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L40)

___

### owner

• **owner**: `string`

The player who is the owner of this vehicle.
Corresponds with character._id or null if it belongs to anything else
Obviously permissions and keys should be used if no owner is set.

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[owner](shared_interfaces_vehicleBase_BaseVehicle.md#owner)

#### Defined in

[shared/interfaces/vehicleBase.ts:33](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L33)

___

### permissions

• **permissions**: `string`[]

A list of character permissions that have access to this vehicle

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[permissions](shared_interfaces_vehicleBase_BaseVehicle.md#permissions)

#### Defined in

[shared/interfaces/vehicleBase.ts:85](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L85)

___

### plate

• **plate**: `string`

A unique identifier for this specific vehicle.
Usually automatically generated.

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[plate](shared_interfaces_vehicleBase_BaseVehicle.md#plate)

#### Defined in

[shared/interfaces/vehicleBase.ts:69](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L69)

___

### pos

• **pos**: `IVector3`

The last position where this vehicle was last left.

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[pos](shared_interfaces_vehicleBase_BaseVehicle.md#pos)

#### Defined in

[shared/interfaces/vehicleBase.ts:47](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L47)

___

### rot

• **rot**: `IVector3`

The last rotation where this vehicle was last left.

#### Inherited from

[BaseVehicle](shared_interfaces_vehicleBase_BaseVehicle.md).[rot](shared_interfaces_vehicleBase_BaseVehicle.md#rot)

#### Defined in

[shared/interfaces/vehicleBase.ts:54](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleBase.ts#L54)

___

### state

• `Optional` **state**: [`VehicleState`](shared_interfaces_vehicleState_VehicleState.md) \| [`Partial`](../modules/server_controllers_textlabel_Internal.md#Partial)<[`VehicleState`](shared_interfaces_vehicleState_VehicleState.md)\>

Data that matches the alt.Vehicle API setters

#### Defined in

[shared/interfaces/vehicleOwned.ts:79](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleOwned.ts#L79)

___

### tuning

• `Optional` **tuning**: [`IVehicleTuning`](shared_interfaces_vehicleTuning_IVehicleTuning.md) \| [`Partial`](../modules/server_controllers_textlabel_Internal.md#Partial)<[`IVehicleTuning`](shared_interfaces_vehicleTuning_IVehicleTuning.md)\>

Vehicle Tuning Interface

#### Defined in

[shared/interfaces/vehicleOwned.ts:71](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/shared/interfaces/vehicleOwned.ts#L71)
