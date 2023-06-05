---
title: Athena.systems.job.utility
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### cloneObjective

::: tip Usage
Athena.systems.job.utility.**cloneObjective**(`objectiveData`): [`player`](server_config.md#player)
:::

Cleanly clones an objective and rebinds all callbacks.

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectiveData` | `Objective` |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[server/systems/job/utility.ts:11](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/server/systems/job/utility.ts#L11)

___

### override

::: tip Usage
Athena.systems.job.utility.**override**(`functionName`, `callback`): `any`
:::

Used to override job objective trigger functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"cloneObjective"`` |
| `callback` | (`objectiveData`: `Objective`) => [`player`](server_config.md#player) |

#### Returns

`any`

#### Defined in

[server/systems/job/utility.ts:32](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/server/systems/job/utility.ts#L32)
