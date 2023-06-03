---
title: Athena.systems.job.events
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### override

::: tip Usage
Athena.systems.job.events.**override**(`functionName`, `callback`): `any`
:::

Used to override job objective checking functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"invokeObjectiveCheck"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/events.ts:52](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/server/systems/job/events.ts#L52)
