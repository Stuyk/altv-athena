---
title: Athena.systems.job.verify
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addCustomCheck

▸ **addCustomCheck**(`type`, `callback`): `any`

Adds a custom check type to the global job system.

* Criteria -> Defined as things like can't have weapons, or can't be on-foot, etc.
* Type -> Defined as things like a capture point, or jump 5 times here... etc.

CANNOT BE ASYNC

**`Example`**

```
Athena.systems.job.verify.addCustomCheck('criteria', (player: alt.Player, objective: Objective) => {
    // Ignore this objective if the uid does not match.
    // Force it to always pass.
    if (objective.uid !== 'medkit-ambulance-check') {
        return true;
    }

    if (!player || !player.vehicle) {
        return false;
    }

    // Check if they are in a specific vehicle with a specific model
    if (player.vehicle.model !== alt.hash('ambulance')) {
        return false;
    }

    // This item does not exist by default in Athena
    return Athena.player.inventory.has(player, 'medkit', 1);
});
```

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"type"`` \| ``"criteria"`` |
| `callback` | (`player`: `Player`, `objective`: `Objective`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/job/verify.ts:306](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/job/verify.ts#L306)

___

### criteria

▸ **criteria**(`player`, `objective`): `boolean`

Verifies job criteria such as not being in a vehicle, no weapons, etc.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `objective` | `Objective` |  |

#### Returns

`boolean`

#### Defined in

[server/systems/job/verify.ts:84](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/job/verify.ts#L84)

___

### objective

▸ **objective**(`job`): `Promise`<`boolean`\>

Verifies all objective content / functionality.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `job` | [`Job`](../classes/server_systems_job_system_Job.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/job/verify.ts:18](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/job/verify.ts#L18)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override job objective verification functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addCustomCheck"`` |
| `callback` | (`type`: ``"type"`` \| ``"criteria"``, `callback`: (`player`: `Player`, `objective`: `Objective`) => `boolean`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/job/verify.ts:334](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/job/verify.ts#L334)

▸ **override**(`functionName`, `callback`): `any`

Used to override job objective verification functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"type"`` |
| `callback` | (`player`: `Player`, `objective`: `Objective`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/job/verify.ts:335](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/job/verify.ts#L335)

▸ **override**(`functionName`, `callback`): `any`

Used to override job objective verification functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"criteria"`` |
| `callback` | (`player`: `Player`, `objective`: `Objective`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/job/verify.ts:336](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/job/verify.ts#L336)

▸ **override**(`functionName`, `callback`): `any`

Used to override job objective verification functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"objective"`` |
| `callback` | (`job`: [`Job`](../classes/server_systems_job_system_Job.md)) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/systems/job/verify.ts:337](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/job/verify.ts#L337)

___

### type

▸ **type**(`player`, `objective`): `boolean`

Verifies job types such as a waypoint, or capture point.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `objective` | `Objective` |  |

#### Returns

`boolean`

#### Defined in

[server/systems/job/verify.ts:212](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/job/verify.ts#L212)
