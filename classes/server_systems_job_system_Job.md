---
title: Athena.systems.job.system.Job
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/systems/job/system](../modules/server_systems_job_system.md).Job

Create a Job Instance

A job can be specified as a series of tasks to complete with specific criteria.

The complexity of a job is limited to your programming knowledge.

ie. Go to this location, interact with this thing, ensure you have this item, etc.

**`Example`**

```ts
// Never recycle the same job instance
const someJob = new Job();

// Never recycle objectives between job instances
Athena.systems.job.objective.createAndAdd(someJob, {
    description: 'Go to a position.',
    pos: {
        x: 0,
        y: 0,
        z: 0 - 1, // Always subtract 1 from a player position
    },
    criteria: Athena.systems.job.objective.buildCriteria({
        NO_VEHICLE: true,
        NO_WEAPON: true,
    }),
    range: 3,
    type: Athena.systems.job.objective.getType('WAYPOINT'),
});

// Adding a player to this job instance starts it
someJob.addPlayer(somePlayer);
```

**`Export`**

## Constructors

### constructor

• **new Job**()

Creates an instance of a job handler.

Used to build a Job for usage.

This instance should be called each time to create new job instances.

**`Memberof`**

Job

#### Defined in

[server/systems/job/system.ts:68](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L68)

## Properties

### completedCallback

• `Private` **completedCallback**: (`job`: [`Job`](server_systems_job_system_Job.md)) => `Promise`<`void`\>

#### Type declaration

▸ (`job`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `job` | [`Job`](server_systems_job_system_Job.md) |

##### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/job/system.ts:56](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L56)

___

### id

• `Private` **id**: `number`

The ID of the player.

**`Memberof`**

Job

#### Defined in

[server/systems/job/system.ts:51](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L51)

___

### objectives

• `Private` **objectives**: `Objective`[] = `[]`

#### Defined in

[server/systems/job/system.ts:53](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L53)

___

### player

• `Private` **player**: `Player`

#### Defined in

[server/systems/job/system.ts:52](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L52)

___

### quitCallback

• `Private` **quitCallback**: (`job`: [`Job`](server_systems_job_system_Job.md), `reason`: `string`) => `void`

#### Type declaration

▸ (`job`, `reason`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `job` | [`Job`](server_systems_job_system_Job.md) |
| `reason` | `string` |

##### Returns

`void`

#### Defined in

[server/systems/job/system.ts:57](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L57)

___

### startTime

• `Private` **startTime**: `number`

#### Defined in

[server/systems/job/system.ts:55](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L55)

___

### vehicles

• `Private` **vehicles**: { `uid`: `string` ; `vehicle`: `Vehicle`  }[] = `[]`

#### Defined in

[server/systems/job/system.ts:54](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L54)

## Methods

### addNextObjective

▸ **addNextObjective**(`objectiveData`): `void`

Inserts an objective to the beginning of the objectives array.

**`Memberof`**

Job

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectiveData` | `Objective` |

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:323](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L323)

___

### addObjective

▸ **addObjective**(`objectiveData`): `void`

Add an objective to this job.
Use the objective interface to generate the objective information.

**`Memberof`**

Job

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectiveData` | `Objective` |

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:92](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L92)

___

### addPlayer

▸ **addPlayer**(`player`): `void`

Add the player to the job this job and start it.

Ensure that this Job is initialized with new Job first.

**`Memberof`**

Job

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:78](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L78)

___

### addVehicle

▸ **addVehicle**(`player`, `model`, `pos`, `rot`, `color1?`, `color2?`): `Vehicle`

Create a unique vehicle for this job.

Objective eventually removes the job vehicle.

This unique job vehicle is temporarily assinged to the player.

Returns a vehicle with a 'uid'.

**`Memberof`**

Job

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `model` | `string` \| `number` |
| `pos` | `IVector3` |
| `rot` | `IVector3` |
| `color1?` | `RGBA` |
| `color2?` | `RGBA` |

#### Returns

`Vehicle`

#### Defined in

[server/systems/job/system.ts:108](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L108)

___

### getCurrentObjective

▸ **getCurrentObjective**(): `any`

Get the current objective the player is completing.

**`Memberof`**

JobBuilder

#### Returns

`any`

#### Defined in

[server/systems/job/system.ts:303](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L303)

___

### getElapsedMilliseconds

▸ **getElapsedMilliseconds**(): `number`

Get the time since this job has started.

**`Memberof`**

Job

#### Returns

`number`

#### Defined in

[server/systems/job/system.ts:313](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L313)

___

### getPlayer

▸ **getPlayer**(): `Player`

Get the current player that is utilizing this job instance.

**`Memberof`**

Job

#### Returns

`Player`

#### Defined in

[server/systems/job/system.ts:253](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L253)

___

### goToNextObjective

▸ `Private` **goToNextObjective**(): `Promise`<`void`\>

Remove the first element of the objective list and move on to the next.

**`Memberof`**

JobBuilder

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/job/system.ts:221](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L221)

___

### loadObjectives

▸ **loadObjectives**(`objectiveData`): `void`

Appends a list of objectives into the Job Framework.

**`Memberof`**

Job

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectiveData` | `Objective`[] |

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:173](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L173)

___

### quit

▸ **quit**(`reason`): `void`

Call this to cleanup a job.

**`Memberof`**

Job

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason` | `string` |

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:198](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L198)

___

### removeAllVehicles

▸ **removeAllVehicles**(): `void`

Remove all vehicles from this job.

**`Memberof`**

Job

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:138](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L138)

___

### removeAttachable

▸ **removeAttachable**(): `void`

Remove the current job attachable.

**`Memberof`**

Job

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:262](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L262)

___

### removeVehicle

▸ **removeVehicle**(`uid`): `void`

Remove a vehicle by unique identifier assigned when adding a vehicle.

**`Memberof`**

Job

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:153](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L153)

___

### setCompletedCallback

▸ **setCompletedCallback**(`callback`): `void`

Set the async callback that is called when a user completed a job.

**`Memberof`**

Job

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | () => `Promise`<`void`\> |

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:335](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L335)

___

### setQuitCallback

▸ **setQuitCallback**(`callback`): `void`

Set the callback that is called when a user quits a job.

**`Memberof`**

Job

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`job`: [`Job`](server_systems_job_system_Job.md), `reason`: `string`) => `void` |

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:345](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L345)

___

### syncObjective

▸ `Private` **syncObjective**(): `void`

Emits data down to the player to start handling job information.

**`Memberof`**

Job

#### Returns

`void`

#### Defined in

[server/systems/job/system.ts:276](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/job/system.ts#L276)
