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

[client/menus/npc.ts:8](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/menus/npc.ts#L8)

## Functions

### addInjection

::: tip Usage
AthenaClient.menus.npc.**addInjection**(`callback`): `any`
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

`any`

#### Defined in

[client/menus/npc.ts:22](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/menus/npc.ts#L22)

___

### disable

::: tip Usage
AthenaClient.menus.npc.**disable**(): `void`
:::

Disable the NPC Wheel Menu

**`Export`**

#### Returns

`void`

#### Defined in

[client/menus/npc.ts:93](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/menus/npc.ts#L93)

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

[client/menus/npc.ts:42](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/menus/npc.ts#L42)

___

### override

::: tip Usage
AthenaClient.menus.npc.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addInjection"`` |
| `callback` | (`callback`: [`NpcMenuInjection`](client_menus_npc.md#NpcMenuInjection)) => `any` |

#### Returns

`any`

#### Defined in

[client/menus/npc.ts:104](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/menus/npc.ts#L104)

::: tip Usage
AthenaClient.menus.npc.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"open"`` |
| `callback` | (`scriptID`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[client/menus/npc.ts:105](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/menus/npc.ts#L105)
