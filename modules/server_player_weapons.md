---
title: Athena.player.weapons
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### clear

▸ **clear**(`player`): `Promise`<`boolean`\>

Clear all weapons from a player's inventory.

Returns true if weapons were found and removed.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/player/weapons.ts:40](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/weapons.ts#L40)

___

### get

▸ **get**(`player`): `Object`

Return all weapons the player currently has in their inventory, and toolbar.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `inventory` | [`player`](server_config.md#player)[] |
| `toolbar` | [`player`](server_config.md#player)[] |

#### Defined in

[server/player/weapons.ts:12](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/weapons.ts#L12)
