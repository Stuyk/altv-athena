---
title: Athena.systems.job.utility
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### cloneObjective

▸ **cloneObjective**(`objectiveData`): [`player`](server_config.md#player)

Cleanly clones an objective and rebinds all callbacks.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectiveData` | `Objective` |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[server/systems/job/utility.ts:11](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/utility.ts#L11)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override job objective trigger functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"cloneObjective"`` |
| `callback` | (`objectiveData`: `Objective`) => [`player`](server_config.md#player) |

#### Returns

`any`

#### Defined in

[server/systems/job/utility.ts:32](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/utility.ts#L32)
