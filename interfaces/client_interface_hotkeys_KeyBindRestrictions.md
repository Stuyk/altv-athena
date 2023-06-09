---
title: AthenaClient.interface.hotkeys.KeyBindRestrictions
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/interface/hotkeys](../modules/client_interface_hotkeys.md).KeyBindRestrictions

## Properties

### isAiming

• `Optional` **isAiming**: `boolean`

Player must be aiming a weapon of some sort to trigger this key bind.

#### Defined in

[client/interface/hotkeys.ts:37](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/interface/hotkeys.ts#L37)

___

### isOnFoot

• `Optional` **isOnFoot**: `boolean`

Player must be out of a vehicle to use this key bind.

#### Defined in

[client/interface/hotkeys.ts:7](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/interface/hotkeys.ts#L7)

___

### isSwimming

• `Optional` **isSwimming**: `boolean`

Player must be swimming to be able to trigger this key bind.

#### Defined in

[client/interface/hotkeys.ts:45](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/interface/hotkeys.ts#L45)

___

### isVehicle

• `Optional` **isVehicle**: `boolean`

Player must be in any vehicle to use this key bind.
Accessible by anyone in the vehicle.

#### Defined in

[client/interface/hotkeys.ts:15](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/interface/hotkeys.ts#L15)

___

### isVehicleDriver

• `Optional` **isVehicleDriver**: `boolean`

Player must be the driver of the vehicle.

#### Defined in

[client/interface/hotkeys.ts:29](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/interface/hotkeys.ts#L29)

___

### isVehiclePassenger

• `Optional` **isVehiclePassenger**: `boolean`

Player must be in a vehicle as a passenger. Not the driver.

#### Defined in

[client/interface/hotkeys.ts:22](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/interface/hotkeys.ts#L22)

___

### vehicleModels

• `Optional` **vehicleModels**: `number`[]

Create an array of vehicle model hashes that this key bind only works under.
Example: `[alt.hash('infernus'), alt.hash('police2')]`

#### Defined in

[client/interface/hotkeys.ts:53](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/interface/hotkeys.ts#L53)

___

### weaponModels

• `Optional` **weaponModels**: `number`[]

Create an array of weapon model hashes that this key bind only works under.
Example: `[alt.hash('w_ar_advancedrifle')]`

#### Defined in

[client/interface/hotkeys.ts:62](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/interface/hotkeys.ts#L62)
