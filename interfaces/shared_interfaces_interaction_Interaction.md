---
title: AthenaShared.interfaces.interaction.Interaction
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/interaction](../modules/shared_interfaces_interaction.md).Interaction

By default Interactions are supported for vehicle and player.

This interface is used to pass interaction information form server to client.

**`Interface`**

Interaction

## Properties

### callback

• `Optional` **callback**: (`player`: `Player`, ...`args`: `any`[]) => `void`

#### Type declaration

::: tip Usage
AthenaShared.interfaces.interaction.Interaction.(`player`, `...args`): `void`
:::

What function to call back after the player has interacted with the Interaction Point

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `...args` | `any`[] |

##### Returns

`void`

#### Defined in

[shared/interfaces/interaction.ts:51](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L51)

___

### data

• `Optional` **data**: `any`[]

Data to pass back through the callback.
Serves as a way to pass unique data through the callback.

#### Defined in

[shared/interfaces/interaction.ts:74](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L74)

___

### debug

• `Optional` **debug**: `boolean`

If set to true debug information will be sent to console.

#### Defined in

[shared/interfaces/interaction.ts:103](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L103)

___

### description

• `Optional` **description**: `string`

Description of what the Interaction does

#### Defined in

[shared/interfaces/interaction.ts:22](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L22)

___

### dimension

• `Optional` **dimension**: `number`

What dimension this player must be in to use this colshape.

#### Defined in

[shared/interfaces/interaction.ts:45](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L45)

___

### height

• `Optional` **height**: `number`

Overrides the height for the interaction.

#### Defined in

[shared/interfaces/interaction.ts:96](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L96)

___

### isPlayerOnly

• `Optional` **isPlayerOnly**: `boolean`

Should this interaction only work if the player is on foot?

#### Defined in

[shared/interfaces/interaction.ts:88](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L88)

___

### isVehicleOnly

• `Optional` **isVehicleOnly**: `boolean`

Should this interaction only work if the player is in a vehicle?

#### Defined in

[shared/interfaces/interaction.ts:81](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L81)

___

### onLeaveCallback

• `Optional` **onLeaveCallback**: (`player`: `Player`, ...`args`: `any`[]) => `void`

#### Type declaration

::: tip Usage
AthenaShared.interfaces.interaction.Interaction.(`player`, `...args`): `void`
:::

Called when a player has left an interaction point.

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `...args` | `any`[] |

##### Returns

`void`

#### Defined in

[shared/interfaces/interaction.ts:66](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L66)

___

### position

• **position**: `IVector3`

The position in the 3D space of where this interaction should be.
Remember to subtract `1` from the z axis if you're using player coordinates.

#### Defined in

[shared/interfaces/interaction.ts:31](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L31)

___

### range

• `Optional` **range**: `number`

The max distance in which this interaction can be interacted with.

#### Defined in

[shared/interfaces/interaction.ts:38](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L38)

___

### triggerCallbackOnEnter

• `Optional` **triggerCallbackOnEnter**: `boolean`

Forces the callback to immediately trigger without actually interacting.

#### Defined in

[shared/interfaces/interaction.ts:59](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L59)

___

### uid

• `Optional` **uid**: `string`

A unique identifier for the Interaction

#### Defined in

[shared/interfaces/interaction.ts:15](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/shared/interfaces/interaction.ts#L15)
