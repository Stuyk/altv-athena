---
title: Athena.systems.tick
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### onTick

▸ **onTick**(`player`): `Promise`<`void`\>

Used to save the player every once in a while.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/tick.ts:18](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/tick.ts#L18)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override player tick functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"onTick"`` |
| `callback` | (`player`: `Player`) => `Promise`<`void`\> |

#### Returns

`any`

#### Defined in

[server/systems/tick.ts:102](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/tick.ts#L102)

▸ **override**(`functionName`, `callback`): `any`

Used to override player tick functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"handlePing"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/systems/tick.ts:103](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/tick.ts#L103)
