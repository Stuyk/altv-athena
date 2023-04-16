---
title: Athena.controllers.blip
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addToPlayer

::: tip Usage
Athena.controllers.blip.**addToPlayer**(`player`, `blipData`): `any`
:::

Add a blip to the player.
Only the player specified can see this blip.

Returns a uid or generates one if not specified.

- See [alt:V Blip Sprites](https://docs.altv.mp/gta/articles/references/blips.html)
- See [alt:V Blip Colors](https://docs.altv.mp/gta/articles/references/blips.html#colors)

#### Example
```ts
const uid = Athena.controllers.blip.addToPlayer(somePlayer, {
    color: 5,
    pos: { x: 0, y: 0, z: 0},
    scale: 0.2,
    shortRange: true,
    text: 'My Blip!',
    sprite: 80
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `blipData` | [`Blip`](../interfaces/shared_interfaces_blip_Blip.md) |  |

#### Returns

`any`

#### Defined in

[server/controllers/blip.ts:146](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/blip.ts#L146)

___

### append

::: tip Usage
Athena.controllers.blip.**append**(`blip`): `string`
:::

Adds a global blip the player loads when they join.

Returns a uid or generates one if not specified.

- See [alt:V Blip Sprites](https://docs.altv.mp/gta/articles/references/blips.html)
- See [alt:V Blip Colors](https://docs.altv.mp/gta/articles/references/blips.html#colors)

#### Example
```ts
const uid = Athena.controllers.blip.append({
    color: 5,
    pos: { x: 0, y: 0, z: 0},
    scale: 0.2,
    shortRange: true,
    text: 'My Blip!',
    sprite: 80
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `blip` | [`Blip`](../interfaces/shared_interfaces_blip_Blip.md) |

#### Returns

`string`

A uid to remove it later.

#### Defined in

[server/controllers/blip.ts:33](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/blip.ts#L33)

___

### override

::: tip Usage
Athena.controllers.blip.**override**(`functionName`, `callback`): `any`
:::

Used to override any blip controller function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"append"`` |
| `callback` | (`blip`: [`Blip`](../interfaces/shared_interfaces_blip_Blip.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/blip.ts:185](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/blip.ts#L185)

::: tip Usage
Athena.controllers.blip.**override**(`functionName`, `callback`): `any`
:::

Used to override any blip controller function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`uid`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/controllers/blip.ts:186](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/blip.ts#L186)

::: tip Usage
Athena.controllers.blip.**override**(`functionName`, `callback`): `any`
:::

Used to override any blip controller function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addToPlayer"`` |
| `callback` | (`player`: `Player`, `blipData`: [`Blip`](../interfaces/shared_interfaces_blip_Blip.md)) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/blip.ts:187](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/blip.ts#L187)

::: tip Usage
Athena.controllers.blip.**override**(`functionName`, `callback`): `any`
:::

Used to override any blip controller function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeFromPlayer"`` |
| `callback` | (`player`: `Player`, `uid`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/blip.ts:188](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/blip.ts#L188)

::: tip Usage
Athena.controllers.blip.**override**(`functionName`, `callback`): `any`
:::

Used to override any blip controller function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"populateGlobalBlips"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/blip.ts:189](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/blip.ts#L189)

___

### populateGlobalBlips

::: tip Usage
Athena.controllers.blip.**populateGlobalBlips**(`player`): `any`
:::

Used to load all blips on client-side for a player.
This is already called when the gamemode starts. Not necessary to call twice.

#### Example
```ts
Athena.controllers.blip.populateGlobalBlips(somePlayer);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/controllers/blip.ts:170](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/blip.ts#L170)

___

### remove

::: tip Usage
Athena.controllers.blip.**remove**(`uid`): `boolean`
:::

Removes a blip based on uid.

#### Example
```ts
const uid = Athena.controllers.blip.append({
    color: 5,
    pos: { x: 0, y: 0, z: 0},
    scale: 0.2,
    shortRange: true,
    text: 'My Blip!',
    sprite: 80
});

Athena.controllers.blip.remove(uid);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |

#### Returns

`boolean`

#### Defined in

[server/controllers/blip.ts:73](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/blip.ts#L73)

___

### removeFromPlayer

::: tip Usage
Athena.controllers.blip.**removeFromPlayer**(`player`, `uid`): `any`
:::

Remove a blip from the player.
Do not worry about removing blips on disconnect.

#### Example
```ts
const uid = Athena.controllers.blip.addToPlayer(somePlayer, {
    color: 5,
    pos: { x: 0, y: 0, z: 0},
    scale: 0.2,
    shortRange: true,
    text: 'My Blip!',
    sprite: 80
});

Athena.controllers.blip.removeFromPlayer(somePlayer, uid);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/controllers/blip.ts:110](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/blip.ts#L110)
