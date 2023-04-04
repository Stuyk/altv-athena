---
title: AthenaShared.interfaces.vehicleInfo.VehicleInfo
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/vehicleInfo](../modules/shared_interfaces_vehicleInfo.md).VehicleInfo

Interface for working with / using vehicles.

**`Interface`**

VehicleInfo

## Properties

### class

• **class**: `VEHICLE_CLASS`

The class of the vehicle; sport, utility, etc.

#### Defined in

[shared/interfaces/vehicleInfo.ts:50](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L50)

___

### displayName

• **displayName**: `string`

The display name of the vehicle.

#### Defined in

[shared/interfaces/vehicleInfo.ts:15](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L15)

___

### fuelTankSize

• `Optional` **fuelTankSize**: `number`

The total tanksize of the vehicle used for fuel cost calculations

#### Defined in

[shared/interfaces/vehicleInfo.ts:106](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L106)

___

### fuelType

• **fuelType**: [`FUEL_TYPE`](../enums/shared_enums_vehicleTypeFlags_FUEL_TYPE.md)

The type of fuel the vehicle uses

#### Defined in

[shared/interfaces/vehicleInfo.ts:78](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L78)

___

### hash

• **hash**: `number`

The model hash of this vehicle.

**`Memberof`**

VehicleInfo

#### Defined in

[shared/interfaces/vehicleInfo.ts:85](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L85)

___

### hexHash

• `Optional` **hexHash**: `string`

The hex model hash of this vehicle.

**`Memberof`**

VehicleInfo

#### Defined in

[shared/interfaces/vehicleInfo.ts:99](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L99)

___

### manufacturer

• **manufacturer**: `string`

The manufacturer of the vehicle.

**`Memberof`**

VehicleInfo

#### Defined in

[shared/interfaces/vehicleInfo.ts:36](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L36)

___

### manufacturerDisplayName

• **manufacturerDisplayName**: `string`

The display name of the manufacturer of the vehicle.

**`Memberof`**

VehicleInfo

#### Defined in

[shared/interfaces/vehicleInfo.ts:29](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L29)

___

### name

• **name**: `string`

The model of the vehicle.

#### Defined in

[shared/interfaces/vehicleInfo.ts:22](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L22)

___

### price

• **price**: `number`

The price of this vehicle if purchaseable.

#### Defined in

[shared/interfaces/vehicleInfo.ts:64](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L64)

___

### seats

• `Optional` **seats**: `number`

The total number of available seats in a vehicle

#### Defined in

[shared/interfaces/vehicleInfo.ts:113](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L113)

___

### sell

• **sell**: `boolean`

Is this vehicle purchaseable?

#### Defined in

[shared/interfaces/vehicleInfo.ts:57](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L57)

___

### signedHash

• `Optional` **signedHash**: `number`

The signed model hash of this vehicle.

**`Memberof`**

VehicleInfo

#### Defined in

[shared/interfaces/vehicleInfo.ts:92](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L92)

___

### storage

• **storage**: `number`

How much storage this vehicle should have.

#### Defined in

[shared/interfaces/vehicleInfo.ts:71](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L71)

___

### type

• **type**: [`VEHICLE_TYPE`](../enums/shared_enums_vehicleTypeFlags_VEHICLE_TYPE.md)

The vehicle type; vehicle, boat, plane, etc.

#### Defined in

[shared/interfaces/vehicleInfo.ts:43](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/shared/interfaces/vehicleInfo.ts#L43)
