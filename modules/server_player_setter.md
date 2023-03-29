---
title: Athena.player.setter
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### account

::: tip Usage
Athena.player.setter.**account**(`player`, `accountData`): `Promise`<`void`\>
:::

Set the current account data for this player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `accountData` | [`Account`](../interfaces/server_interface_iAccount_Account.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/player/setter.ts:20](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/setter.ts#L20)

___

### actionMenu

::: tip Usage
Athena.player.setter.**actionMenu**(`player`, `actionMenu`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `actionMenu` | `ActionMenu` |

#### Returns

`any`

#### Defined in

[server/player/setter.ts:37](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/setter.ts#L37)

___

### override

::: tip Usage
Athena.player.setter.**override**(`functionName`, `callback`): `any`
:::

Used to override any setter functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"account"`` |
| `callback` | (`player`: `Player`, `accountData`: [`Account`](../interfaces/server_interface_iAccount_Account.md)) => `Promise`<`void`\> |

#### Returns

`any`

#### Defined in

[server/player/setter.ts:68](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/setter.ts#L68)

::: tip Usage
Athena.player.setter.**override**(`functionName`, `callback`): `any`
:::

Used to override any setter functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"actionMenu"`` |
| `callback` | (`player`: `Player`, `actionMenu`: `ActionMenu`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/setter.ts:69](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/setter.ts#L69)

::: tip Usage
Athena.player.setter.**override**(`functionName`, `callback`): `any`
:::

Used to override any setter functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"respawned"`` |
| `callback` | (`player`: `Player`, `position`: `IVector3`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/setter.ts:70](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/setter.ts#L70)

___

### respawned

::: tip Usage
Athena.player.setter.**respawned**(`player`, `position`): `void`
:::

Set this player as respawned.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | - |
| `position` | `IVector3` | Use null to find closest hospital. |

#### Returns

`void`

#### Defined in

[server/player/setter.ts:50](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/setter.ts#L50)
