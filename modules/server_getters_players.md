---
title: Athena.getters.players
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### driving

::: tip Usage
Athena.getters.players.**driving**(): `alt.Player`[]
:::

Returns all players who are currently driving a vehicle.

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:124](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/server/getters/players.ts#L124)

___

### drivingSpecificModel

::: tip Usage
Athena.getters.players.**drivingSpecificModel**(`model`): `alt.Player`[]
:::

Return all online players driving a specific vehicle model.

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `string` \| `number` |

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:156](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/server/getters/players.ts#L156)

___

### inRange

::: tip Usage
Athena.getters.players.**inRange**(`pos`, `range`): `alt.Player`[]
:::

Gets all players around a specific position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pos` | `IVector3` | A position in the world. |
| `range` | `number` |  |

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:80](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/server/getters/players.ts#L80)

___

### inRangeWithDistance

::: tip Usage
Athena.getters.players.**inRangeWithDistance**(`pos`, `range`): { `dist`: `number` ; `player`: `alt.Player`  }[]
:::

Creates an array of players who are closest to a position.
Array is automatically sorted into ascending order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pos` | `IVector3` | A position in the world. |
| `range` | `number` |  |

#### Returns

{ `dist`: `number` ; `player`: `alt.Player`  }[]

#### Defined in

[server/getters/players.ts:47](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/server/getters/players.ts#L47)

___

### inVehicle

::: tip Usage
Athena.getters.players.**inVehicle**(`vehicle`): `alt.Player`[]
:::

Returns all passengers and the driver.
No specific order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:190](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/server/getters/players.ts#L190)

___

### online

::: tip Usage
Athena.getters.players.**online**(): `alt.Player`[]
:::

Return all players currently online and logged into a character.

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:10](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/server/getters/players.ts#L10)

___

### onlineWithWeapons

::: tip Usage
Athena.getters.players.**onlineWithWeapons**(): `alt.Player`[]
:::

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:21](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/server/getters/players.ts#L21)

___

### walking

::: tip Usage
Athena.getters.players.**walking**(): `alt.Player`[]
:::

Return all players who are currently walking / on foot.

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:139](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/server/getters/players.ts#L139)

___

### withName

::: tip Usage
Athena.getters.players.**withName**(`name`): `alt.Player`[]
:::

Gets all online players with a given name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:103](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/server/getters/players.ts#L103)
