---
title: Athena.systems.job.instance
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### clear

▸ **clear**(`player`): `any`

Clear the job instance.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/instance.ts:52](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/systems/job/instance.ts#L52)

___

### get

▸ **get**(`player`): [`Job`](../classes/server_systems_job_system_Job.md) \| `undefined`

Get the current job instance for a player, or player id.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `any` |

#### Returns

[`Job`](../classes/server_systems_job_system_Job.md) \| `undefined`

#### Defined in

[server/systems/job/instance.ts:13](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/systems/job/instance.ts#L13)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override job instancing functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | (`player`: `any`) => [`Job`](../classes/server_systems_job_system_Job.md) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/job/instance.ts:84](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/systems/job/instance.ts#L84)

▸ **override**(`functionName`, `callback`): `any`

Used to override job instancing functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"set"`` |
| `callback` | (`player`: `Player`, `newJob`: [`Job`](../classes/server_systems_job_system_Job.md)) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/instance.ts:85](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/systems/job/instance.ts#L85)

▸ **override**(`functionName`, `callback`): `any`

Used to override job instancing functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"clear"`` |
| `callback` | (`player`: `any`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/instance.ts:86](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/systems/job/instance.ts#L86)

___

### set

▸ **set**(`player`, `newJob`): `any`

Set the current job instance for a player.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `newJob` | [`Job`](../classes/server_systems_job_system_Job.md) |  |

#### Returns

`any`

#### Defined in

[server/systems/job/instance.ts:32](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/systems/job/instance.ts#L32)
