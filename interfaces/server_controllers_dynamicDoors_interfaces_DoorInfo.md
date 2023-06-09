---
title: Athena.controllers.dynamicDoors.interfaces.DoorInfo
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/controllers/dynamicDoors/interfaces](../modules/server_controllers_dynamicDoors_interfaces.md).DoorInfo

## Properties

### afterEnter

• `Optional` **afterEnter**: (`player`: `Player`, `doorInfo`: [`DoorInfo`](server_controllers_dynamicDoors_interfaces_DoorInfo.md)) => `void`

#### Type declaration

::: tip Usage
Athena.controllers.dynamicDoors.interfaces.DoorInfo.(`player`, `doorInfo`): `void`
:::

A callback to trigger when entering through the door.

**`Memberof`**

DoorInfo

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `doorInfo` | [`DoorInfo`](server_controllers_dynamicDoors_interfaces_DoorInfo.md) |

##### Returns

`void`

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:98](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L98)

___

### allowVehicles

• `Optional` **allowVehicles**: ``true``

Set this to true to allow vehicles to move through the door.

**`Memberof`**

DynamicDoor

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:19](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L19)

___

### beforeEnter

• `Optional` **beforeEnter**: (`player`: `Player`, `doorInfo`: [`DoorInfo`](server_controllers_dynamicDoors_interfaces_DoorInfo.md)) => `boolean`

#### Type declaration

::: tip Usage
Athena.controllers.dynamicDoors.interfaces.DoorInfo.(`player`, `doorInfo`): `boolean`
:::

Trigger a callback before opening.

Return true if permitted to enter the door.

Otherwise, return false to prevent player from entering the door.

**`Memberof`**

DoorInfo

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `doorInfo` | [`DoorInfo`](server_controllers_dynamicDoors_interfaces_DoorInfo.md) |

##### Returns

`boolean`

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:91](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L91)

___

### dimension

• `Optional` **dimension**: `number`

If a dimension is specified, it will be used.

Otherwise the door is available everywhere.

The dimension to set when using this door.

**`Memberof`**

DoorInfo

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:39](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L39)

___

### ipl

• `Optional` **ipl**: `string`

An IPL to load when the door is triggered

**`Memberof`**

DoorInfo

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:56](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L56)

___

### iplUnload

• `Optional` **iplUnload**: `string`

An IPL to unload when the door is triggered

**`Memberof`**

DoorInfo

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:64](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L64)

___

### marker

• `Optional` **marker**: `Marker`

A marker to generate for the door.

**`Memberof`**

DoorInfo

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:48](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L48)

___

### pos

• **pos**: `IVector3`

Automatically subtracts 1 on creation.

**`Memberof`**

DoorInfo

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:11](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L11)

___

### text

• `Optional` **text**: `string`

A label for the door, will create a text label if present.

**`Memberof`**

DoorInfo

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:27](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L27)

___

### ytyp

• `Optional` **ytyp**: `string`

A YTYP to load when the door is triggered.

**`Memberof`**

DoorInfo

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:72](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L72)

___

### ytypUnload

• `Optional` **ytypUnload**: `string`

A YTYP to unload when the door is triggered.

**`Memberof`**

DoorInfo

#### Defined in

[server/controllers/dynamicDoors/interfaces.ts:80](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/server/controllers/dynamicDoors/interfaces.ts#L80)
