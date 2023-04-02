---
title: Athena.systems.job.instance
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### clear

::: tip Usage
Athena.systems.job.instance.**clear**(`player`): `any`
:::

Clear the job instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/instance.ts:52](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/job/instance.ts#L52)

___

### get

::: tip Usage
Athena.systems.job.instance.**get**(`player`): [`Job`](../classes/server_systems_job_system_Job.md) \| `undefined`
:::

Get the current job instance for a player, or player id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `any` |

#### Returns

[`Job`](../classes/server_systems_job_system_Job.md) \| `undefined`

#### Defined in

[server/systems/job/instance.ts:13](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/job/instance.ts#L13)

___

### override

::: tip Usage
Athena.systems.job.instance.**override**(`functionName`, `callback`): `any`
:::

Used to override job instancing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | (`player`: `any`) => [`Job`](../classes/server_systems_job_system_Job.md) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/job/instance.ts:84](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/job/instance.ts#L84)

::: tip Usage
Athena.systems.job.instance.**override**(`functionName`, `callback`): `any`
:::

Used to override job instancing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"set"`` |
| `callback` | (`player`: `Player`, `newJob`: [`Job`](../classes/server_systems_job_system_Job.md)) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/instance.ts:85](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/job/instance.ts#L85)

::: tip Usage
Athena.systems.job.instance.**override**(`functionName`, `callback`): `any`
:::

Used to override job instancing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"clear"`` |
| `callback` | (`player`: `any`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/instance.ts:86](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/job/instance.ts#L86)

___

### set

::: tip Usage
Athena.systems.job.instance.**set**(`player`, `newJob`): `any`
:::

Set the current job instance for a player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `newJob` | [`Job`](../classes/server_systems_job_system_Job.md) |  |

#### Returns

`any`

#### Defined in

[server/systems/job/instance.ts:32](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/job/instance.ts#L32)
