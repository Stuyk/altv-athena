---
title: Athena.player.weapons
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### clear

::: tip Usage
Athena.player.weapons.**clear**(`player`): `Promise`<`boolean`\>
:::

Clear all weapons from a player's inventory.

Returns true if weapons were found and removed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/player/weapons.ts:40](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/player/weapons.ts#L40)

___

### get

::: tip Usage
Athena.player.weapons.**get**(`player`): `Object`
:::

Return all weapons the player currently has in their inventory, and toolbar.

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

[server/player/weapons.ts:12](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/player/weapons.ts#L12)
