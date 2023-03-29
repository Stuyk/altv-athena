---
title: Athena.systems.tick
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### onTick

::: tip Usage
Athena.systems.tick.**onTick**(`player`): `Promise`<`void`\>
:::

Used to save the player every once in a while.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/tick.ts:18](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/systems/tick.ts#L18)

___

### override

::: tip Usage
Athena.systems.tick.**override**(`functionName`, `callback`): `any`
:::

Used to override player tick functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"onTick"`` |
| `callback` | (`player`: `Player`) => `Promise`<`void`\> |

#### Returns

`any`

#### Defined in

[server/systems/tick.ts:102](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/systems/tick.ts#L102)

::: tip Usage
Athena.systems.tick.**override**(`functionName`, `callback`): `any`
:::

Used to override player tick functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"handlePing"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/systems/tick.ts:103](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/systems/tick.ts#L103)
