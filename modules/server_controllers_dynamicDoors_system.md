---
title: Athena.controllers.dynamicDoors.system
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### cleanup

::: tip Usage
Athena.controllers.dynamicDoors.system.**cleanup**(`uid`): `void`
:::

Remove a Dynamic Door, but do not remove from the database.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

`void`

#### Defined in

[server/controllers/dynamicDoors/system.ts:55](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/controllers/dynamicDoors/system.ts#L55)

___

### create

::: tip Usage
Athena.controllers.dynamicDoors.system.**create**(`door`): `Promise`<`void`\>
:::

Create a dynamic door and adds it to the database

Ignores already pre-created doors.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `door` | [`DynamicDoor`](../interfaces/server_controllers_dynamicDoors_interfaces_DynamicDoor.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/controllers/dynamicDoors/system.ts:198](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/controllers/dynamicDoors/system.ts#L198)

___

### deleteDoor

::: tip Usage
Athena.controllers.dynamicDoors.system.**deleteDoor**(`uid`): `Promise`<`void`\>
:::

Delete a Dynamic Door from the Database & in-game

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/controllers/dynamicDoors/system.ts:221](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/controllers/dynamicDoors/system.ts#L221)

___

### generate

::: tip Usage
Athena.controllers.dynamicDoors.system.**generate**(`door`): `void`
:::

Generates a dynamic door based on its properties and builds it in both directions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `door` | [`dDynamicDoor`](server_controllers_dynamicDoors_interfaces.md#dDynamicDoor) |

#### Returns

`void`

#### Defined in

[server/controllers/dynamicDoors/system.ts:73](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/controllers/dynamicDoors/system.ts#L73)

___

### goto

::: tip Usage
Athena.controllers.dynamicDoors.system.**goto**(`player`, `door`): `Promise`<`void`\>
:::

Load into a door, if the door IPL fails to load, the player will not move.

The door is the place you are going to.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `door` | [`DoorInfo`](../interfaces/server_controllers_dynamicDoors_interfaces_DoorInfo.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/controllers/dynamicDoors/system.ts:97](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/controllers/dynamicDoors/system.ts#L97)
