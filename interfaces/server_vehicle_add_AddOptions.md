---
title: Athena.vehicle.add.AddOptions
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/vehicle/add](../modules/server_vehicle_add.md).AddOptions

## Properties

### doNotDespawn

• `Optional` **doNotDespawn**: `boolean`

Should this vehicle always persist on the server and never be allowed to despawn?

#### Defined in

[server/vehicle/add.ts:51](https://github.com/Stuyk/altv-athena/blob/380b7cf/src/core/server/vehicle/add.ts#L51)

___

### keys

• `Optional` **keys**: `string`[]

An array of character ids to add to the vehicle.

If doing a large group, consider permissions instead.

#### Defined in

[server/vehicle/add.ts:35](https://github.com/Stuyk/altv-athena/blob/380b7cf/src/core/server/vehicle/add.ts#L35)

___

### permissions

• `Optional` **permissions**: `string`[]

Permissions to append

#### Defined in

[server/vehicle/add.ts:43](https://github.com/Stuyk/altv-athena/blob/380b7cf/src/core/server/vehicle/add.ts#L43)

___

### state

• `Optional` **state**: `any`

Vehicle state
such as color, neon, etc.

#### Defined in

[server/vehicle/add.ts:25](https://github.com/Stuyk/altv-athena/blob/380b7cf/src/core/server/vehicle/add.ts#L25)

___

### tuning

• `Optional` **tuning**: `any`

Vehicle Tuning Interface
Such as modkits and the like

#### Defined in

[server/vehicle/add.ts:16](https://github.com/Stuyk/altv-athena/blob/380b7cf/src/core/server/vehicle/add.ts#L16)
