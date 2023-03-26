---
title: Athena.systems.jobTrigger
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### create

::: tip Usage
Athena.systems.jobTrigger.**create**(`player`, `data`): `any`
:::

Creates a WebView Job Window to show to the player.
Will invoke a callback or an event if accepted or declined.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `data` | `JobTrigger` |  |

#### Returns

`any`

#### Defined in

[server/systems/jobTrigger.ts:87](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/systems/jobTrigger.ts#L87)

___

### override

::: tip Usage
Athena.systems.jobTrigger.**override**(`functionName`, `callback`): `any`
:::

Used to override job trigger functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"create"`` |
| `callback` | (`player`: `Player`, `data`: `JobTrigger`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/jobTrigger.ts:106](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/systems/jobTrigger.ts#L106)
