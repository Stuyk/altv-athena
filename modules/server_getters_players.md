---
title: Athena.getters.players
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### asCharacters

::: tip Usage
Athena.getters.players.**asCharacters**<`T`\>(): `any`
:::

Get all online players as characters.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `Character` |

#### Returns

`any`

#### Defined in

[server/getters/players.ts:209](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/getters/players.ts#L209)

___

### driving

::: tip Usage
Athena.getters.players.**driving**(): `alt.Player`[]
:::

Returns all players who are currently driving a vehicle.

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:132](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/getters/players.ts#L132)

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

[server/getters/players.ts:164](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/getters/players.ts#L164)

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

[server/getters/players.ts:88](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/getters/players.ts#L88)

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

[server/getters/players.ts:55](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/getters/players.ts#L55)

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

[server/getters/players.ts:198](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/getters/players.ts#L198)

___

### online

::: tip Usage
Athena.getters.players.**online**(): `alt.Player`[]
:::

Return all players currently online and logged into a character.

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:11](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/getters/players.ts#L11)

___

### onlineWithWeapons

::: tip Usage
Athena.getters.players.**onlineWithWeapons**(): `alt.Player`[]
:::

Return all players with weapons out.

**`Export`**

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:28](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/getters/players.ts#L28)

___

### walking

::: tip Usage
Athena.getters.players.**walking**(): `alt.Player`[]
:::

Return all players who are currently walking / on foot.

#### Returns

`alt.Player`[]

#### Defined in

[server/getters/players.ts:147](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/getters/players.ts#L147)

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

[server/getters/players.ts:111](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/getters/players.ts#L111)
