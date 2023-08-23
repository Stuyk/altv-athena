---
title: Athena.getters.vehicle
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### byDatabaseID

::: tip Usage
Athena.getters.vehicle.**byDatabaseID**(`id`): `alt.Vehicle` \| `undefined`
:::

Get a vehicle based on their database _id
May return undefined if the vehicle is not currently spawned.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`alt.Vehicle` \| `undefined`

#### Defined in

[server/getters/vehicle.ts:55](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/getters/vehicle.ts#L55)

___

### byID

::: tip Usage
Athena.getters.vehicle.**byID**(`id`): `alt.Vehicle` \| `undefined`
:::

Get a vehicle by their alt:V ID

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`alt.Vehicle` \| `undefined`

#### Defined in

[server/getters/vehicle.ts:11](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/getters/vehicle.ts#L11)

___

### byIncrementalDatabaseID

::: tip Usage
Athena.getters.vehicle.**byIncrementalDatabaseID**(`id`): `alt.Vehicle` \| `undefined`
:::

Return a spawned vehicle by is incremental data id.

This only works for persistent vehicles.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` \| `number` |

#### Returns

`alt.Vehicle` \| `undefined`

#### Defined in

[server/getters/vehicle.ts:24](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/getters/vehicle.ts#L24)

___

### closestToPlayer

::: tip Usage
Athena.getters.vehicle.**closestToPlayer**(`player`): `alt.Player` \| `undefined`
:::

The player closest to a player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/getters/vehicle.ts:181](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/getters/vehicle.ts#L181)

___

### closestToVehicle

::: tip Usage
Athena.getters.vehicle.**closestToVehicle**(`player`): `alt.Vehicle` \| `undefined`
:::

The vehicle closest to a player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`alt.Vehicle` \| `undefined`

#### Defined in

[server/getters/vehicle.ts:191](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/getters/vehicle.ts#L191)

___

### driver

::: tip Usage
Athena.getters.vehicle.**driver**(`vehicle`): `alt.Player` \| `undefined`
:::

Just wraps the `vehicle.driver` lookup.
Returns a player if they are driving this vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/getters/vehicle.ts:171](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/getters/vehicle.ts#L171)

___

### inFrontOf

::: tip Usage
Athena.getters.vehicle.**inFrontOf**(`entity`, `startDistance?`): `Promise`<`alt.Vehicle` \| `undefined`\>
:::

Creates a temporary ColShape in front of the current vehicle or player.
The ColShape is then used to check if a vehicle is present within the ColShape.
It will keep subtract distance until it finds a vehicle near the player that is in the ColShape.
Works best on flat land or very close distances.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `entity` | `Entity` | `undefined` |
| `startDistance?` | `number` | `6` |

#### Returns

`Promise`<`alt.Vehicle` \| `undefined`\>

#### Defined in

[server/getters/vehicle.ts:99](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/getters/vehicle.ts#L99)

___

### isNearPosition

::: tip Usage
Athena.getters.vehicle.**isNearPosition**(`vehicle`, `pos`, `dist?`): `boolean`
:::

Checks if a vehicle is within 3 distance of a position.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `vehicle` | `Vehicle` | `undefined` | An alt:V Vehicle Entity |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `dist` | `number` | `3` | - |

#### Returns

`boolean`

#### Defined in

[server/getters/vehicle.ts:150](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/getters/vehicle.ts#L150)

___

### isValidModel

::: tip Usage
Athena.getters.vehicle.**isValidModel**(`model`): `boolean`
:::

Check if a vehicle model is currently valid.
Use `alt.hash` to hash a plain text model. ex: `alt.hash('infernus')`

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `number` |

#### Returns

`boolean`

#### Defined in

[server/getters/vehicle.ts:78](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/getters/vehicle.ts#L78)

___

### passengers

::: tip Usage
Athena.getters.vehicle.**passengers**(`vehicle`): `alt.Player`[]
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

[server/getters/vehicle.ts:160](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/getters/vehicle.ts#L160)
