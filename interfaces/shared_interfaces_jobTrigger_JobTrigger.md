---
title: AthenaShared.interfaces.jobTrigger.JobTrigger
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/jobTrigger](../modules/shared_interfaces_jobTrigger.md).JobTrigger

A unique interface to show the player.
Has custom header, summary, and image support.

**`Interface`**

JobTrigger

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |

## Properties

### acceptCallback

• `Optional` **acceptCallback**: (`player`: `T`, `amount?`: `number`) => `void`

#### Type declaration

::: tip Usage
AthenaShared.interfaces.jobTrigger.JobTrigger.(`player`, `amount?`): `void`
:::

A callback if the trigger is accepted.

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `T` |
| `amount?` | `number` |

##### Returns

`void`

#### Defined in

[shared/interfaces/jobTrigger.ts:57](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/shared/interfaces/jobTrigger.ts#L57)

___

### cancelCallback

• `Optional` **cancelCallback**: (`player`: `T`) => `void`

#### Type declaration

::: tip Usage
AthenaShared.interfaces.jobTrigger.JobTrigger.(`player`): `void`
:::

A callback if the trigger is declined.

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `T` |

##### Returns

`void`

#### Defined in

[shared/interfaces/jobTrigger.ts:64](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/shared/interfaces/jobTrigger.ts#L64)

___

### cancelEvent

• `Optional` **cancelEvent**: `string`

Event to trigger when the player declines this job.
Completely optional.

#### Defined in

[shared/interfaces/jobTrigger.ts:50](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/shared/interfaces/jobTrigger.ts#L50)

___

### event

• `Optional` **event**: `string`

Event to trigger when it is accepted.
Recieve this event with 'alt.on'

#### Defined in

[shared/interfaces/jobTrigger.ts:42](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/shared/interfaces/jobTrigger.ts#L42)

___

### header

• **header**: `string`

The header text of the job trigger.

#### Defined in

[shared/interfaces/jobTrigger.ts:20](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/shared/interfaces/jobTrigger.ts#L20)

___

### image

• **image**: `string`

An external https:// based image to show for your job.

#### Defined in

[shared/interfaces/jobTrigger.ts:13](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/shared/interfaces/jobTrigger.ts#L13)

___

### maxAmount

• `Optional` **maxAmount**: `number`

Maximum amount for quantity input.

#### Defined in

[shared/interfaces/jobTrigger.ts:34](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/shared/interfaces/jobTrigger.ts#L34)

___

### summary

• **summary**: `string`

A summary describing what will be done during a job.

#### Defined in

[shared/interfaces/jobTrigger.ts:27](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/shared/interfaces/jobTrigger.ts#L27)
