---
title: Athena.player.events
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### AthenaPlayerEvents

Ƭ **AthenaPlayerEvents**: ``"drop-item"`` \| ``"increased-play-time"`` \| ``"item-equipped"`` \| ``"item-unequipped"`` \| ``"pickup-item"`` \| ``"player-account-created"`` \| ``"player-character-created"`` \| ``"player-armour-set"`` \| ``"player-died"`` \| ``"player-disconnected"`` \| ``"player-entered-vehicle-as-driver"`` \| ``"player-health-set"`` \| ``"player-left-vehicle-seat"`` \| ``"player-pos-set"`` \| ``"player-skin-cleared"`` \| ``"player-skin-set"`` \| ``"player-uniform-cleared"`` \| ``"player-uniform-set"`` \| ``"player-weapon-unequipped"`` \| ``"respawned"`` \| ``"selected-character"`` \| ``"set-account-data"`` \| ``"spawned"``

#### Defined in

[server/player/events.ts:6](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L6)

## Functions

### on

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player item has changed from unequipped to equipped.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"item-equipped"`` |
| `callback` | (`player`: `Player`, `slot`: `number`, `type`: `InventoryType`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:68](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L68)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player item has changed to unequipped

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"item-unequipped"`` |
| `callback` | (`player`: `Player`, `slot`: `number`, `type`: `InventoryType`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:80](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L80)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player has died.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-died"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:92](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L92)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player uniform has been set.
Check `characterDocument.data`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-uniform-set"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:102](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L102)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player uniform has been cleared.
Uniform is set to undefined / null

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-uniform-cleared"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:112](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L112)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player has their model set to non-multiplayer models.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-skin-set"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:121](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L121)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player has their model cleared to a multiplayer model.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-skin-cleared"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:130](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L130)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when the internal safe health functions are invoked.
This is never called when `player.health` is modified

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-health-set"`` |
| `callback` | (`player`: `Player`, `oldValue`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:140](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L140)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when the internal safe armour functions are invoked.
This is never called when `player.armour` is modified.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-armour-set"`` |
| `callback` | (`player`: `Player`, `oldValue`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:150](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L150)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when the internal safe position functions are invoked.
This is never called when `player.pos` is modified.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-pos-set"`` |
| `callback` | (`player`: `Player`, `oldValue`: `IVector3`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:160](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L160)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when playtime has increased slightly.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"increased-play-time"`` |
| `callback` | (`player`: `Player`, `newHours`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:169](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L169)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player has dropped an item.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"drop-item"`` |
| `callback` | (`player`: `Player`, `storedItem`: `StoredItem`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:178](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L178)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player picks up an item.
The `_id` is a reference to the item in the database; or the item in the ItemDrops system.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"pickup-item"`` |
| `callback` | (`player`: `Player`, `_id`: `string`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:188](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L188)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player selects a character

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"selected-character"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:197](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L197)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player has been respawned by internal functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"respawned"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:206](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L206)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player has left a vehicle seat.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-left-vehicle-seat"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`, `seat`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:215](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L215)

::: tip Usage
Athena.player.events.**on**(`eventName`, `callback`): `any`
:::

Called when a player enters a vehicle as a driver.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-entered-vehicle-as-driver"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:227](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L227)

::: tip Usage
Athena.player.events.**on**<`T`\>(`eventName`, `callback`): `any`
:::

Triggers when a player id is unbound from a document.
Formally known as a disconnect event.
PLAYER WILL BE UNDEFINED, DO NOT USE VARIABLE

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-disconnected"`` |
| `callback` | (`player`: `Player`, `id`: `number`, `document`: `any`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:242](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L242)

::: tip Usage
Athena.player.events.**on**<`T`\>(`eventName`, `callback`): `any`
:::

Triggers when a player unequips a weapon.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-weapon-unequipped"`` |
| `callback` | (`player`: `Player`, `slot`: `number`, `type`: `InventoryType`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:255](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L255)

::: tip Usage
Athena.player.events.**on**<`T`\>(`eventName`, `callback`): `any`
:::

Called when a new account is created.

This means a new account is now bound to a new player.

Any additional document changes with this event will need to handled through the Athena.document.account system.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-account-created"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:272](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L272)

::: tip Usage
Athena.player.events.**on**<`T`\>(`eventName`, `callback`): `any`
:::

Called when a new character is created.

This means a new character is now bound to a player.

Any additional document changes with this event will need to handled through the Athena.document.player system.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"player-character-created"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/events.ts:286](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L286)

___

### trigger

::: tip Usage
Athena.player.events.**trigger**<`CustomEvents`\>(`eventName`, `player`, `...args`): `void`
:::

Usually called by internal functions. Can be used to manually trigger an Athena Event though.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomEvents` | [`AthenaPlayerEvents`](server_player_events.md#AthenaPlayerEvents) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `CustomEvents` |  |
| `player` | `Player` | An alt:V Player Entity |
| `...args` | `any`[] | - |

#### Returns

`void`

#### Defined in

[server/player/events.ts:43](https://github.com/Stuyk/altv-athena/blob/d9ae327/src/core/server/player/events.ts#L43)
