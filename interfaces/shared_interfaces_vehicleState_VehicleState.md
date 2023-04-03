---
title: AthenaShared.interfaces.vehicleState.VehicleState
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/vehicleState](../modules/shared_interfaces_vehicleState.md).VehicleState

Wraps the alt.Vehicle properties that can be set.

Used to auto-sync a vehicle from a database.

**`Interface`**

VehicleState

## Properties

### activeRadioStation

• **activeRadioStation**: `number`

Gets or sets the active radio station.

#### Defined in

[shared/interfaces/vehicleState.ts:18](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L18)

___

### boatAnchorActive

• **boatAnchorActive**: `boolean`

#### Defined in

[shared/interfaces/vehicleState.ts:255](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L255)

___

### bodyAdditionalHealth

• **bodyAdditionalHealth**: `number`

Gets or sets the additional body health.

#### Defined in

[shared/interfaces/vehicleState.ts:23](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L23)

___

### bodyHealth

• **bodyHealth**: `number`

Gets or sets the body health.

#### Defined in

[shared/interfaces/vehicleState.ts:27](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L27)

___

### counterMeasureCount

• **counterMeasureCount**: `number`

#### Defined in

[shared/interfaces/vehicleState.ts:261](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L261)

___

### customPrimaryColor

• **customPrimaryColor**: `RGBA`

Gets or sets the custom primary color as a RGBA type

#### Defined in

[shared/interfaces/vehicleState.ts:32](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L32)

___

### customSecondaryColor

• **customSecondaryColor**: `RGBA`

Gets or sets the custom secondary color as a RGBA type.
#### Example
```js
const someVehicle = new alt.Vehicle('elegy', 0, 0, 0, 0, 0, 0);
someVehicle.customSecondaryColor = new alt.RGBA(255, 0, 0);
console.log(`Vehicle custom secondary color was set to red`);
```

#### Defined in

[shared/interfaces/vehicleState.ts:43](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L43)

___

### customTires

• **customTires**: `boolean`

Gets or sets if the vehicle instance has custom tires.

#### Defined in

[shared/interfaces/vehicleState.ts:48](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L48)

___

### darkness

• **darkness**: `number`

Applies some decoration effects to the vehicle (e.g.: It makes the hydra looking rusty or applies snow to the front bumper of `policeold1`). Does not work on every vehicle model.

#### Defined in

[shared/interfaces/vehicleState.ts:53](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L53)

___

### dashboardColor

• **dashboardColor**: `number`

Gets or sets the dashboard color of the vehicle.

Dash board colors range from 0 to 159.

#### Defined in

[shared/interfaces/vehicleState.ts:61](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L61)

___

### dirtLevel

• **dirtLevel**: `number`

Gets or sets the dirt level of the vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:66](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L66)

___

### driftModeEnabled

• **driftModeEnabled**: `boolean`

Gets or sets the drift mode state of the vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:183](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L183)

___

### engineHealth

• **engineHealth**: `number`

Gets or sets the current engine health.

Default maximum engine health is 1000.
The `vehicle.repair()` function should be used to repair a vehicle if the engine health is less than or equal to zero.

#### Defined in

[shared/interfaces/vehicleState.ts:75](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L75)

___

### engineOn

• **engineOn**: `boolean`

Gets or sets the engine state of the vehicle.

The functionality of the vehicle engine can be triggered on either client-side or server-side. If you want to trigger the engine on client-side use native.setVehicleEngineOn.

#### Defined in

[shared/interfaces/vehicleState.ts:83](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L83)

___

### headlightColor

• **headlightColor**: `number`

Gets or sets the headlight color of a vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:88](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L88)

___

### hybridExtraActive

• **hybridExtraActive**: `boolean`

#### Defined in

[shared/interfaces/vehicleState.ts:265](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L265)

___

### hybridExtraState

• **hybridExtraState**: `number`

#### Defined in

[shared/interfaces/vehicleState.ts:267](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L267)

___

### interiorColor

• **interiorColor**: `number`

Gets or sets the interior color of a vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:92](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L92)

___

### isMissionTrain

• **isMissionTrain**: `boolean`

Gets or sets if the created train is a mission train.

#### Defined in

[shared/interfaces/vehicleState.ts:188](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L188)

___

### isTrainCaboose

• **isTrainCaboose**: `boolean`

Gets or sets if the train is a caboose.

#### Defined in

[shared/interfaces/vehicleState.ts:217](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L217)

___

### isTrainEngine

• **isTrainEngine**: `boolean`

Gets or sets if the train is the engine of the train.

#### Defined in

[shared/interfaces/vehicleState.ts:212](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L212)

___

### lightState

• **lightState**: `number`

#### Defined in

[shared/interfaces/vehicleState.ts:257](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L257)

___

### lightsMultiplier

• **lightsMultiplier**: `number`

Gets or sets the lights intensity and distance of a vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:96](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L96)

___

### livery

• **livery**: `number`

Gets or sets the livery of a vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:100](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L100)

___

### lockState

• **lockState**: `VehicleLockState`

Gets or sets the lock state of a vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:104](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L104)

___

### manualEngineControl

• **manualEngineControl**: `boolean`

Enables or disables the manual engine control.

#### Defined in

[shared/interfaces/vehicleState.ts:108](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L108)

___

### neon

• **neon**: `IVehicleNeon`

Enables or disables a neon light on a specific position.

#### Defined in

[shared/interfaces/vehicleState.ts:113](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L113)

___

### neonColor

• **neonColor**: `RGBA`

Gets or sets the color of the neon lights.

#### Defined in

[shared/interfaces/vehicleState.ts:118](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L118)

___

### numberPlateIndex

• **numberPlateIndex**: `number`

Gets or sets the current number plate style.

#### Defined in

[shared/interfaces/vehicleState.ts:123](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L123)

___

### numberPlateText

• **numberPlateText**: `string`

Gets or sets the current text displayed on the number plate.

#### Defined in

[shared/interfaces/vehicleState.ts:128](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L128)

___

### pearlColor

• **pearlColor**: `number`

Gets or sets the pearl color of a vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:133](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L133)

___

### petrolTankHealth

• **petrolTankHealth**: `number`

Gets or sets the current health amount of the petrol tank.

#### Defined in

[shared/interfaces/vehicleState.ts:138](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L138)

___

### primaryColor

• **primaryColor**: `number`

Gets or sets the current primary color of a vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:143](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L143)

___

### rocketRefuelSpeed

• **rocketRefuelSpeed**: `number`

#### Defined in

[shared/interfaces/vehicleState.ts:259](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L259)

___

### roofLivery

• **roofLivery**: `number`

Gets or sets the roof livery of a vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:148](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L148)

___

### roofState

• **roofState**: `boolean`

Gets or sets the roof state of a vehicle (closed or open).

#### Defined in

[shared/interfaces/vehicleState.ts:153](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L153)

___

### scriptMaxSpeed

• **scriptMaxSpeed**: `number`

#### Defined in

[shared/interfaces/vehicleState.ts:263](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L263)

___

### secondaryColor

• **secondaryColor**: `number`

Gets or sets the current secondary color.

#### Defined in

[shared/interfaces/vehicleState.ts:158](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L158)

___

### sirenActive

• **sirenActive**: `boolean`

Gets or sets the siren state of a vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:163](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L163)

___

### tireSmokeColor

• **tireSmokeColor**: `RGBA`

Gets or sets the color of the tire smoke.

#### Defined in

[shared/interfaces/vehicleState.ts:168](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L168)

___

### trainCarriageConfigIndex

• **trainCarriageConfigIndex**: `number`

Gets or sets the config index of the train's carriage.

#### Defined in

[shared/interfaces/vehicleState.ts:247](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L247)

___

### trainConfigIndex

• **trainConfigIndex**: `number`

Gets or sets the trains config index.

**`Remarks`**

You can find a list of all possible config indices in the trains.xml. Valid indices are between 1 and 25.

#### Defined in

[shared/interfaces/vehicleState.ts:202](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L202)

___

### trainCruiseSpeed

• **trainCruiseSpeed**: `number`

Gets or sets the cruise speed of the train.

#### Defined in

[shared/interfaces/vehicleState.ts:242](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L242)

___

### trainDirection

• **trainDirection**: `boolean`

Gets or sets the direction of the train.

#### Defined in

[shared/interfaces/vehicleState.ts:227](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L227)

___

### trainDistanceFromEngine

• **trainDistanceFromEngine**: `number`

Gets or sets the distance of the trains to the engine.

#### Defined in

[shared/interfaces/vehicleState.ts:207](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L207)

___

### trainForceDoorsOpen

• **trainForceDoorsOpen**: `boolean`

Gets or sets if the doors of the trains should be forced open.

#### Defined in

[shared/interfaces/vehicleState.ts:237](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L237)

___

### trainPassengerCarriages

• **trainPassengerCarriages**: `boolean`

Gets or sets if the train is a passenger carriage.

#### Defined in

[shared/interfaces/vehicleState.ts:222](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L222)

___

### trainRenderDerailed

• **trainRenderDerailed**: `boolean`

Gets or sets if the trains is rendered derailed.

#### Defined in

[shared/interfaces/vehicleState.ts:232](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L232)

___

### trainTrackId

• **trainTrackId**: `number`

Gets or sets the track id of the train.

**`Remarks`**

Valid track ids are between 0 and 11.

#### Defined in

[shared/interfaces/vehicleState.ts:195](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L195)

___

### trainUnk1

• **trainUnk1**: `boolean`

#### Defined in

[shared/interfaces/vehicleState.ts:249](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L249)

___

### trainUnk2

• **trainUnk2**: `boolean`

#### Defined in

[shared/interfaces/vehicleState.ts:251](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L251)

___

### trainUnk3

• **trainUnk3**: `boolean`

#### Defined in

[shared/interfaces/vehicleState.ts:253](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L253)

___

### wheelColor

• **wheelColor**: `number`

Gets or sets the wheel color.

#### Defined in

[shared/interfaces/vehicleState.ts:173](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L173)

___

### windowTint

• **windowTint**: `WindowTint`

Gets or sets the window tint of a vehicle.

#### Defined in

[shared/interfaces/vehicleState.ts:178](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/shared/interfaces/vehicleState.ts#L178)
