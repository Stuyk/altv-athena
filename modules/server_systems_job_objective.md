---
title: Athena.systems.job.objective
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [DefaultCriteriaOptions](../interfaces/server_systems_job_objective_DefaultCriteriaOptions.md)

## Functions

### buildCriteria

::: tip Usage
Athena.systems.job.objective.**buildCriteria**(`criteria`): `number`
:::

Builds a numerical representation of the flags used to check job criteria.

#### Parameters

| Name | Type |
| :------ | :------ |
| `criteria` | [`DefaultCriteriaOptions`](../interfaces/server_systems_job_objective_DefaultCriteriaOptions.md) |

#### Returns

`number`

#### Defined in

[server/systems/job/objective.ts:98](https://github.com/Stuyk/altv-athena/blob/94d0bf7/src/core/server/systems/job/objective.ts#L98)

___

### createAndAdd

::: tip Usage
Athena.systems.job.objective.**createAndAdd**(`job`, `objective`): [`player`](server_config.md#player)
:::

Cleanly creates an objective to add to a job.

Removes all deep refs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `job` | [`Job`](../classes/server_systems_job_system_Job.md) |
| `objective` | `Objective` |

#### Returns

[`player`](server_config.md#player)

Returns the objective instance; does not need to be added.

#### Defined in

[server/systems/job/objective.ts:81](https://github.com/Stuyk/altv-athena/blob/94d0bf7/src/core/server/systems/job/objective.ts#L81)

___

### getType

::: tip Usage
Athena.systems.job.objective.**getType**(`type`): `number`
:::

Returns the numerical representation of a default objective type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `number` \| `symbol` |

#### Returns

`number`

#### Defined in

[server/systems/job/objective.ts:127](https://github.com/Stuyk/altv-athena/blob/94d0bf7/src/core/server/systems/job/objective.ts#L127)

___

### override

::: tip Usage
Athena.systems.job.objective.**override**(`functionName`, `callback`): `any`
:::

Used to override job objective creation functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"createAndAdd"`` |
| `callback` | (`job`: [`Job`](../classes/server_systems_job_system_Job.md), `objective`: `Objective`) => [`player`](server_config.md#player) |

#### Returns

`any`

#### Defined in

[server/systems/job/objective.ts:143](https://github.com/Stuyk/altv-athena/blob/94d0bf7/src/core/server/systems/job/objective.ts#L143)

::: tip Usage
Athena.systems.job.objective.**override**(`functionName`, `callback`): `any`
:::

Used to override job objective creation functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"buildCriteria"`` |
| `callback` | (`criteria`: [`DefaultCriteriaOptions`](../interfaces/server_systems_job_objective_DefaultCriteriaOptions.md)) => `number` |

#### Returns

`any`

#### Defined in

[server/systems/job/objective.ts:144](https://github.com/Stuyk/altv-athena/blob/94d0bf7/src/core/server/systems/job/objective.ts#L144)

::: tip Usage
Athena.systems.job.objective.**override**(`functionName`, `callback`): `any`
:::

Used to override job objective creation functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getType"`` |
| `callback` | (`type`: `string` \| `number` \| `symbol`) => `number` |

#### Returns

`any`

#### Defined in

[server/systems/job/objective.ts:145](https://github.com/Stuyk/altv-athena/blob/94d0bf7/src/core/server/systems/job/objective.ts#L145)
