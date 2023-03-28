---
title: AthenaClient.menus.npc
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### NpcMenuInjection

Ƭ **NpcMenuInjection**: (`scriptID`: `number`, `ped`: [`player`](server_config.md#player), `options`: [`player`](server_config.md#player)[]) => [`player`](server_config.md#player)[]

#### Type declaration

::: tip Usage
AthenaClient.menus.npc.(`scriptID`, `ped`, `options`): [`player`](server_config.md#player)[]
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `scriptID` | `number` |
| `ped` | [`player`](server_config.md#player) |
| `options` | [`player`](server_config.md#player)[] |

##### Returns

[`player`](server_config.md#player)[]

#### Defined in

[client/menus/npc.ts:8](https://github.com/Stuyk/altv-athena/blob/2226a0a/src/core/client/menus/npc.ts#L8)

## Functions

### addInjection

::: tip Usage
AthenaClient.menus.npc.**addInjection**(`callback`): `void`
:::

Allows the current Menu Options to be modified.
Meaning, a callback that will modify existing options, or append new options to the menu.
Must always return the original wheel menu options + your changes.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`NpcMenuInjection`](client_menus_npc.md#NpcMenuInjection) |

#### Returns

`void`

#### Defined in

[client/menus/npc.ts:21](https://github.com/Stuyk/altv-athena/blob/2226a0a/src/core/client/menus/npc.ts#L21)

___

### open

::: tip Usage
AthenaClient.menus.npc.**open**(`scriptID`): `void`
:::

Opens the wheel menu against a target npc script id.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptID` | `number` |

#### Returns

`void`

#### Defined in

[client/menus/npc.ts:33](https://github.com/Stuyk/altv-athena/blob/2226a0a/src/core/client/menus/npc.ts#L33)
