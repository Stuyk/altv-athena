---
title: Athena.getters.player
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### byAccount

::: tip Usage
Athena.getters.player.**byAccount**(`id`): `alt.Player` \| `undefined`
:::

Gets an online player by account identifier based on their MongoDB account _id.

#### Example
```ts
const player = Athena.getters.player.byAccount('123456789');
if (player) {
    console.log(`Found player ${player.id} with account ID ${player.account._id}`);
} else {
   console.log('No player found with that account ID');
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/getters/player.ts:26](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L26)

___

### byDatabaseID

::: tip Usage
Athena.getters.player.**byDatabaseID**(`id`): `alt.Player` \| `undefined`
:::

Get an online player based on their MongoDB _id

#### Example
```ts
const id = 'abc123jkfewfwe';
const player = Athena.getters.player.byDatabaseID(id);

if (player) {
    console.log(`Found player with id ${id}`);
} else {
    console.log(`No player found with the id '${id}'`);
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/getters/player.ts:133](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L133)

___

### byID

::: tip Usage
Athena.getters.player.**byID**(`id`): `alt.Player` \| `undefined`
:::

Return a player based on their ID given the Identifier strategy currently setup.
Use this to get the player in-game that you see with your eyes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/getters/player.ts:155](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L155)

___

### byName

::: tip Usage
Athena.getters.player.**byName**(`name`): `alt.Player` \| `undefined`
:::

Gets an online player by their name.

Not case sensitive and returns the first player it finds matching that name.

#### Example
```ts
const player = Athena.getters.player.byName('john_fettermanjoe');
if (player) {
    console.log(`Found player ${player.id} with name ${player.name}`);
} else {
    console.log('No player found with that name');
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/getters/player.ts:63](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L63)

___

### byPartialName

::: tip Usage
Athena.getters.player.**byPartialName**(`partialName`): `alt.Player` \| `undefined`
:::

Gets an online player by their partial name.

Not case sensitive and returns the first player it finds that includes the partial

#### Example
```ts
const partialName = 'john';
const player = Athena.getters.player.byPartialName(partialName);

if (player) {
    console.log(`Found player ${player.id} with name ${player.name}`);
} else {
    console.log(`No player found with the partial name '${partialName}'`);
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `partialName` | `string` |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/getters/player.ts:99](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L99)

___

### characters

::: tip Usage
Athena.getters.player.**characters**(`playerOrAccount`): `Promise`<[`player`](server_config.md#player)[]\>
:::

Returns all characters that belong to a player.
Requires account info, player, or account id string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `playerOrAccount` | `any` |

#### Returns

`Promise`<[`player`](server_config.md#player)[]\>

#### Defined in

[server/getters/player.ts:318](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L318)

___

### closestOwnedVehicle

::: tip Usage
Athena.getters.player.**closestOwnedVehicle**(`player`): `alt.Vehicle` \| `undefined`
:::

Returns the closest owned vehicle for a given player.
Counts any owned vehicles from other players that have supplied an injection for ownership.
Ignores vehicles with keyless for start.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`alt.Vehicle` \| `undefined`

#### Defined in

[server/getters/player.ts:262](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L262)

___

### closestToPlayer

::: tip Usage
Athena.getters.player.**closestToPlayer**(`player`): `alt.Player` \| `undefined`
:::

The player closest to a player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/getters/player.ts:240](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L240)

___

### closestToVehicle

::: tip Usage
Athena.getters.player.**closestToVehicle**(`vehicle`): `alt.Player` \| `undefined`
:::

The player closest to a vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/getters/player.ts:250](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L250)

___

### inFrontOf

::: tip Usage
Athena.getters.player.**inFrontOf**(`player`, `startDistance?`): `Promise`<`alt.Player` \| `undefined`\>
:::

Creates a temporary ColShape in front of the player.
The ColShape is then used to check if the entity is present within the ColShape.
It will keep subtract distance until it finds a player near the player that is in the ColShape.
Works best on flat land or very close distances.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `startDistance?` | `number` | `6` |  |

#### Returns

`Promise`<`alt.Player` \| `undefined`\>

#### Defined in

[server/getters/player.ts:169](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L169)

___

### isDead

::: tip Usage
Athena.getters.player.**isDead**(`player`): `boolean`
:::

Determine if a player is currently dead / marked as dead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`boolean`

#### Defined in

[server/getters/player.ts:350](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L350)

___

### isNearPosition

::: tip Usage
Athena.getters.player.**isNearPosition**(`player`, `pos`, `dist?`): `boolean`
:::

Checks if a player is within 3 distance of a position.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `dist` | `number` | `3` | - |

#### Returns

`boolean`

#### Defined in

[server/getters/player.ts:220](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L220)

___

### isValid

::: tip Usage
Athena.getters.player.**isValid**(`player`): `boolean`
:::

Determine if a player is valid, and spawned as a character.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`boolean`

#### Defined in

[server/getters/player.ts:366](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L366)

___

### ownedVehicleDocuments

::: tip Usage
Athena.getters.player.**ownedVehicleDocuments**(`player`): `Promise`<[`player`](server_config.md#player)[]\>
:::

Get all owned vehicles from the database for a given character.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<[`player`](server_config.md#player)[]\>

#### Defined in

[server/getters/player.ts:302](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L302)

___

### waypoint

::: tip Usage
Athena.getters.player.**waypoint**(`player`): `alt.IVector3` \| `undefined`
:::

Get the current waypoint marked on a player's map.
Will return undefined it is not currently set.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`alt.IVector3` \| `undefined`

#### Defined in

[server/getters/player.ts:230](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/getters/player.ts#L230)
