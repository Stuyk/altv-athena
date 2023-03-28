---
title: AthenaClient.menus.player
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### PlayerMenuInjection

Ƭ **PlayerMenuInjection**: (`target`: `alt.Player`, `options`: [`player`](server_config.md#player)[]) => [`player`](server_config.md#player)[]

#### Type declaration

::: tip Usage
AthenaClient.menus.player.(`target`, `options`): [`player`](server_config.md#player)[]
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `alt.Player` |
| `options` | [`player`](server_config.md#player)[] |

##### Returns

[`player`](server_config.md#player)[]

#### Defined in

[client/menus/player.ts:5](https://github.com/Stuyk/altv-athena/blob/2226a0a/src/core/client/menus/player.ts#L5)

## Functions

### addInjection

::: tip Usage
AthenaClient.menus.player.**addInjection**(`callback`): `void`
:::

Allows the current Menu Options to be modified.
Meaning, a callback that will modify existing options, or append new options to the menu.
Must always return the original wheel menu options + your changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`PlayerMenuInjection`](client_menus_player.md#PlayerMenuInjection) |

#### Returns

`void`

#### Defined in

[client/menus/player.ts:17](https://github.com/Stuyk/altv-athena/blob/2226a0a/src/core/client/menus/player.ts#L17)

___

### open

::: tip Usage
AthenaClient.menus.player.**open**(`target`): `void`
:::

Opens the wheel menu against a target player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `Player` |

#### Returns

`void`

#### Defined in

[client/menus/player.ts:28](https://github.com/Stuyk/altv-athena/blob/2226a0a/src/core/client/menus/player.ts#L28)
