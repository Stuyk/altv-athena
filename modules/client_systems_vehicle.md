---
title: AthenaClient.systems.vehicle
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### VehicleController

• `Const` **VehicleController**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `emitEngine` | () => `void` |
| `emitLock` | () => `void` |
| `enableSeatBelt` | (`value?`: `boolean`) => `void` |
| `enterVehicle` | () => `void` |
| `handleVehicleDisables` | () => `void` |
| `registerKeybinds` | () => `void` |
| `removeSeatBelt` | (`vehicle`: `Vehicle`) => `void` |
| `setIntoVehicle` | (`vehicle`: `Vehicle`, `seat`: `number`) => `Promise`<`void`\> |
| `toggleEngine` | (`status`: `boolean`) => `void` |

#### Defined in

[client/systems/vehicle.ts:22](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/systems/vehicle.ts#L22)
