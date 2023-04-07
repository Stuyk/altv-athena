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

[client/menus/player.ts:5](https://github.com/Stuyk/altv-athena/blob/4cfdacf/src/core/client/menus/player.ts#L5)

## Functions

### addInjection

::: tip Usage
AthenaClient.menus.player.**addInjection**(`callback`): `any`
:::

Allows the current Menu Options to be modified.
Meaning, a callback that will modify existing options, or append new options to the menu.
Must always return the original wheel menu options + your changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`PlayerMenuInjection`](client_menus_player.md#PlayerMenuInjection) |

#### Returns

`any`

#### Defined in

[client/menus/player.ts:18](https://github.com/Stuyk/altv-athena/blob/4cfdacf/src/core/client/menus/player.ts#L18)

___

### disable

::: tip Usage
AthenaClient.menus.player.**disable**(): `void`
:::

Disable the Player Wheel Menu

**`Export`**

#### Returns

`void`

#### Defined in

[client/menus/player.ts:84](https://github.com/Stuyk/altv-athena/blob/4cfdacf/src/core/client/menus/player.ts#L84)

___

### open

::: tip Usage
AthenaClient.menus.player.**open**(`target`): `any`
:::

Opens the wheel menu against a target player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `Player` |

#### Returns

`any`

#### Defined in

[client/menus/player.ts:37](https://github.com/Stuyk/altv-athena/blob/4cfdacf/src/core/client/menus/player.ts#L37)

___

### override

::: tip Usage
AthenaClient.menus.player.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addInjection"`` |
| `callback` | (`callback`: [`PlayerMenuInjection`](client_menus_player.md#PlayerMenuInjection)) => `any` |

#### Returns

`any`

#### Defined in

[client/menus/player.ts:95](https://github.com/Stuyk/altv-athena/blob/4cfdacf/src/core/client/menus/player.ts#L95)

::: tip Usage
AthenaClient.menus.player.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"open"`` |
| `callback` | (`target`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[client/menus/player.ts:96](https://github.com/Stuyk/altv-athena/blob/4cfdacf/src/core/client/menus/player.ts#L96)
