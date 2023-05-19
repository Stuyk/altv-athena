---
title: AthenaShared.interfaces.vehicleHandling.default
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/vehicleHandling](../modules/shared_interfaces_vehicleHandling.md).default

A general vehicle handling interface passed from server to client.

**`Interface`**

IVehicleHandling

## Properties

### acceleration

• **acceleration**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:8](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L8)

___

### antiRollBarBiasFront

• **antiRollBarBiasFront**: `number`

The bias between front and rear for the antiroll bar(0 front, 1 rear).

#### Defined in

[shared/interfaces/vehicleHandling.ts:15](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L15)

___

### antiRollBarBiasRear

• **antiRollBarBiasRear**: `number`

This value modify the weight transmission during an acceleration between the left and right.

#### Defined in

[shared/interfaces/vehicleHandling.ts:22](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L22)

___

### antiRollBarForce

• **antiRollBarForce**: `number`

The spring constant that is transmitted to the opposite wheel when under compression larger numbers are a larger force. Larger Numbers = less body roll.

#### Defined in

[shared/interfaces/vehicleHandling.ts:29](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L29)

___

### brakeBiasFront

• **brakeBiasFront**: `number`

Determines the distribution of traction from front to rear.

#### Defined in

[shared/interfaces/vehicleHandling.ts:36](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L36)

___

### brakeBiasRear

• **brakeBiasRear**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:38](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L38)

___

### brakeForce

• **brakeForce**: `number`

Braking power for handbrake. Bigger number = harder braking.

#### Defined in

[shared/interfaces/vehicleHandling.ts:45](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L45)

___

### camberStiffness

• **camberStiffness**: `number`

This value modify the grip of the car when you're drifting and you release the gas. In general, it makes your car slide more on sideways movement. More than 0 make the car sliding on the same angle you're drifting and less than 0 make your car oversteer (not recommend to use more than 0.1 / -0.1 if you don't know what you're doing).

#### Defined in

[shared/interfaces/vehicleHandling.ts:52](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L52)

___

### centreOfMassOffset

• **centreOfMassOffset**: `Object`

This value shifts the center of gravity in meters from side to side (when in vehicle looking forward).

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Defined in

[shared/interfaces/vehicleHandling.ts:59](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L59)

___

### clutchChangeRateScaleDownShift

• **clutchChangeRateScaleDownShift**: `number`

Clutch speed multiplier on down shifts, bigger number = faster shifts.

#### Defined in

[shared/interfaces/vehicleHandling.ts:66](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L66)

___

### clutchChangeRateScaleUpShift

• **clutchChangeRateScaleUpShift**: `number`

Clutch speed multiplier on up shifts, bigger number = faster shifts.

#### Defined in

[shared/interfaces/vehicleHandling.ts:73](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L73)

___

### collisionDamageMult

• **collisionDamageMult**: `number`

Multiplies the game's calculation of damage to the vehicle through collision.

#### Defined in

[shared/interfaces/vehicleHandling.ts:80](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L80)

___

### deformationDamageMult

• **deformationDamageMult**: `number`

Multiplies the game's calculation of deformation damage.

#### Defined in

[shared/interfaces/vehicleHandling.ts:87](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L87)

___

### downforceModifier

• **downforceModifier**: `number`

No Description

#### Defined in

[shared/interfaces/vehicleHandling.ts:94](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L94)

___

### driveBiasFront

• **driveBiasFront**: `number`

This value is used to determine whether a vehicle is front, rear, or four wheel drive.

#### Defined in

[shared/interfaces/vehicleHandling.ts:101](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L101)

___

### driveInertia

• **driveInertia**: `number`

Describes how fast an engine will rev. For example an engine with a long stroke crank and heavy flywheel will take longer to redline than an engine with a short stroke and light flywheel.

#### Defined in

[shared/interfaces/vehicleHandling.ts:108](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L108)

___

### driveMaxFlatVel

• **driveMaxFlatVel**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:110](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L110)

___

### engineDamageMult

• **engineDamageMult**: `number`

Multiplies the game's calculation of damage to the engine, causing explosion or engine failure.

#### Defined in

[shared/interfaces/vehicleHandling.ts:117](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L117)

___

### handBrakeForce

• **handBrakeForce**: `number`

Braking power for handbrake. Bigger number = harder braking.

#### Defined in

[shared/interfaces/vehicleHandling.ts:124](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L124)

___

### handlingFlags

• **handlingFlags**: `number`

Handling flags. Written in HEX. Rightmost digit is the first one.
No additional information on this property.

#### Defined in

[shared/interfaces/vehicleHandling.ts:132](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L132)

___

### initialDragCoeff

• **initialDragCoeff**: `number`

Sets the drag coefficient on the rage physics archetype of the vehicle (proportional to velocity squared). Increase to simulate aerodynamic drag.

#### Defined in

[shared/interfaces/vehicleHandling.ts:139](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L139)

___

### initialDriveForce

• **initialDriveForce**: `number`

This multiplier modifies the game's calculation of drive force (from the output of the transmission).

#### Defined in

[shared/interfaces/vehicleHandling.ts:146](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L146)

___

### initialDriveGears

• **initialDriveGears**: `number`

How many forward speeds a transmission contains.

#### Defined in

[shared/interfaces/vehicleHandling.ts:153](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L153)

___

### initialDriveMaxFlatVel

• **initialDriveMaxFlatVel**: `number`

Determines the speed at redline in top gear. Setting this value does not guarantee the vehicle will reach this speed. Multiply the number in the file by 0-82 to get the speed in mph or multiply by 1.32 to get kph.

#### Defined in

[shared/interfaces/vehicleHandling.ts:160](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L160)

___

### lowSpeedTractionLossMult

• **lowSpeedTractionLossMult**: `number`

How much traction is reduced at low speed, 0.0 means normal traction. It affects mainly car burnout (spinning wheels when car doesn't move) when pressing gas. Decreasing value will cause less burnout, less sliding at start. However, the higher value, the more burnout car gets. Optimal is 1.0.

#### Defined in

[shared/interfaces/vehicleHandling.ts:167](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L167)

___

### rollCentreHeightFront

• **rollCentreHeightFront**: `number`

This value modify the weight transmission during an acceleration between the left and right.

#### Defined in

[shared/interfaces/vehicleHandling.ts:174](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L174)

___

### rollCentreHeightRear

• **rollCentreHeightRear**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:176](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L176)

___

### steeringLock

• **steeringLock**: `number`

This value is a multiplier of the game's calculation of the angle a steer wheel will turn while at full turn. Steering lock is directly related to over or understeer / turning radius.

#### Defined in

[shared/interfaces/vehicleHandling.ts:183](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L183)

___

### steeringLockRatio

• **steeringLockRatio**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:185](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L185)

___

### suspensionBiasFront

• **suspensionBiasFront**: `number`

Force damping scale front/back. If more wheels at back (e.g. trucks) need front suspension to be stronger. This value determines which suspension is stronger, front or rear. If value is above 0.50 then front is stiffer, when below, rear.

#### Defined in

[shared/interfaces/vehicleHandling.ts:192](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L192)

___

### suspensionBiasRear

• **suspensionBiasRear**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:194](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L194)

___

### suspensionCompDamp

• **suspensionCompDamp**: `number`

Damping during strut compression. Bigger = stiffer.

#### Defined in

[shared/interfaces/vehicleHandling.ts:201](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L201)

___

### suspensionForce

• **suspensionForce**: `number`

1 / (Force * NumWheels) = Lower limit for zero force at full extension. Affects how strong suspension is. Can help if car is easily flipped over when turning.

#### Defined in

[shared/interfaces/vehicleHandling.ts:208](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L208)

___

### suspensionLowerLimit

• **suspensionLowerLimit**: `number`

Visual limit... how far can wheels move up / down from original position.

#### Defined in

[shared/interfaces/vehicleHandling.ts:215](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L215)

___

### suspensionRaise

• **suspensionRaise**: `number`

The amount that the suspension raises the body off the wheels. Recommend adjusting at second decimal unless vehicle has room to move. ie -0.02 is plenty of drop on an already low car. Too much will show the wheels clipping through or if positive, no suspension joining the body to wheels.

#### Defined in

[shared/interfaces/vehicleHandling.ts:222](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L222)

___

### suspensionReboundDamp

• **suspensionReboundDamp**: `number`

Damping during strut rebound. Bigger = stiffer.

#### Defined in

[shared/interfaces/vehicleHandling.ts:229](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L229)

___

### suspensionUpperLimit

• **suspensionUpperLimit**: `number`

Visual limit... how far can wheels move up / down from original position.

#### Defined in

[shared/interfaces/vehicleHandling.ts:236](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L236)

___

### tractionBiasFront

• **tractionBiasFront**: `number`

Determines the distribution of traction from front to rear.

#### Defined in

[shared/interfaces/vehicleHandling.ts:243](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L243)

___

### tractionBiasRear

• **tractionBiasRear**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:245](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L245)

___

### tractionCurveLateral

• **tractionCurveLateral**: `number`

Shape of lateral traction curve (peak traction position in degrees).

#### Defined in

[shared/interfaces/vehicleHandling.ts:252](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L252)

___

### tractionCurveLateralRatio

• **tractionCurveLateralRatio**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:254](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L254)

___

### tractionCurveMax

• **tractionCurveMax**: `number`

Cornering grip of the vehicle as a multiplier of the tire surface friction.

#### Defined in

[shared/interfaces/vehicleHandling.ts:261](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L261)

___

### tractionCurveMaxRatio

• **tractionCurveMaxRatio**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:263](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L263)

___

### tractionCurveMin

• **tractionCurveMin**: `number`

Accelerating/braking grip of the vehicle as a multiplier of the tire surface friction.

#### Defined in

[shared/interfaces/vehicleHandling.ts:270](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L270)

___

### tractionCurveMinRatio

• **tractionCurveMinRatio**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:272](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L272)

___

### tractionLossMult

• **tractionLossMult**: `number`

How much is traction affected by material grip differences from 1.0. Basically it affects how much grip is changed when driving on asphalt and mud (the higher, the more grip you loose, making car less responsive and prone to sliding).

#### Defined in

[shared/interfaces/vehicleHandling.ts:279](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L279)

___

### tractionSpringDeltaMax

• **tractionSpringDeltaMax**: `number`

This value denotes at what distance above the ground the car will lose traction.

#### Defined in

[shared/interfaces/vehicleHandling.ts:286](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L286)

___

### tractionSpringDeltaMaxRatio

• **tractionSpringDeltaMaxRatio**: `number`

#### Defined in

[shared/interfaces/vehicleHandling.ts:288](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L288)

___

### weaponDamageMult

• **weaponDamageMult**: `number`

Multiplies the game's calculation of damage to the vehicle by weapons.

#### Defined in

[shared/interfaces/vehicleHandling.ts:295](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/shared/interfaces/vehicleHandling.ts#L295)
