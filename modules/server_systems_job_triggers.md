---
title: Athena.systems.job.triggers
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### override

::: tip Usage
Athena.systems.job.triggers.**override**(`functionName`, `callback`): `any`
:::

Used to override job objective trigger functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"tryEventCall"`` |
| `callback` | (`player`: `Player`, `objective`: `Objective`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/triggers.ts:110](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/server/systems/job/triggers.ts#L110)

::: tip Usage
Athena.systems.job.triggers.**override**(`functionName`, `callback`): `any`
:::

Used to override job objective trigger functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"tryAnimation"`` |
| `callback` | (`player`: `Player`, `objective`: `Objective`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/triggers.ts:111](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/server/systems/job/triggers.ts#L111)

::: tip Usage
Athena.systems.job.triggers.**override**(`functionName`, `callback`): `any`
:::

Used to override job objective trigger functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"tryAttach"`` |
| `callback` | (`player`: `Player`, `objective`: `Objective`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/triggers.ts:112](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/server/systems/job/triggers.ts#L112)

___

### tryAnimation

::: tip Usage
Athena.systems.job.triggers.**tryAnimation**(`player`, `objective`): `any`
:::

Try playing an animation from the objective.

This should almost never be invoked manually.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `objective` | `Objective` |  |

#### Returns

`any`

#### Defined in

[server/systems/job/triggers.ts:41](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/server/systems/job/triggers.ts#L41)

___

### tryAttach

::: tip Usage
Athena.systems.job.triggers.**tryAttach**(`player`, `objective`): `any`
:::

Try attaching an object to a player.

This should almost never be invoked manually.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `objective` | `Objective` |  |

#### Returns

`any`

#### Defined in

[server/systems/job/triggers.ts:82](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/server/systems/job/triggers.ts#L82)

___

### tryEventCall

::: tip Usage
Athena.systems.job.triggers.**tryEventCall**(`player`, `objective`): `any`
:::

Calls any events attached to the current job objective that is being finished.

Try calling an event. This should almost never be invoked manually.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `objective` | `Objective` |  |

#### Returns

`any`

#### Defined in

[server/systems/job/triggers.ts:15](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/server/systems/job/triggers.ts#L15)
