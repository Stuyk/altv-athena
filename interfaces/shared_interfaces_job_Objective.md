---
title: AthenaShared.interfaces.job.Objective
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/job](../modules/shared_interfaces_job.md).Objective

Used to pass objective information from server to client.

**`Interface`**

Objective

## Properties

### animation

• `Optional` **animation**: [`JobAnimation`](shared_interfaces_animation_JobAnimation.md)

An animation to associate with this objective.

#### Defined in

[shared/interfaces/job.ts:143](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L143)

___

### attachable

• `Optional` **attachable**: [`JobAttachable`](shared_interfaces_iAttachable_JobAttachable.md)

An object to associate with this objective.

#### Defined in

[shared/interfaces/job.ts:150](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L150)

___

### blip

• `Optional` **blip**: [`Blip`](shared_interfaces_blip_Blip.md)

A local blip to associate with this objective.

#### Defined in

[shared/interfaces/job.ts:136](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L136)

___

### callbackOnCheck

• `Optional` **callbackOnCheck**: (`player`: `any`) => `Promise`<`boolean`\>

#### Type declaration

::: tip Usage
AthenaShared.interfaces.job.Objective.(`player`): `Promise`<`boolean`\>
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `any` |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[shared/interfaces/job.ts:195](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L195)

___

### callbackOnFinish

• `Optional` **callbackOnFinish**: (`player`: `any`) => `void`

#### Type declaration

::: tip Usage
AthenaShared.interfaces.job.Objective.(`player`): `void`
:::

Server-side callback when objective is completed.

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `any` |

##### Returns

`void`

#### Defined in

[shared/interfaces/job.ts:201](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L201)

___

### callbackOnStart

• `Optional` **callbackOnStart**: (`player`: `any`) => `void`

#### Type declaration

::: tip Usage
AthenaShared.interfaces.job.Objective.(`player`): `void`
:::

Server-side callback when objective is started.

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `any` |

##### Returns

`void`

#### Defined in

[shared/interfaces/job.ts:189](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L189)

___

### captureMaximum

• `Optional` **captureMaximum**: `number`

An optional internal tracker for how much progress needs to be done to complete it.

#### Defined in

[shared/interfaces/job.ts:108](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L108)

___

### captureProgress

• `Optional` **captureProgress**: `number`

An optional internal tracker for how far this objective is along.

#### Defined in

[shared/interfaces/job.ts:101](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L101)

___

### criteria

• **criteria**: [`ObjectiveCriteria`](../enums/shared_interfaces_job_ObjectiveCriteria.md)

The criteria necessary to complete this Objective.

#### Defined in

[shared/interfaces/job.ts:65](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L65)

___

### data

• `Optional` **data**: `Object`

Data to put on this objective.
Do not add callbacks.

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[shared/interfaces/job.ts:183](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L183)

___

### description

• **description**: `string`

A description of what to do to complete this objective.

#### Defined in

[shared/interfaces/job.ts:94](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L94)

___

### eventCall

• `Optional` **eventCall**: [`EventCall`](shared_interfaces_eventCall_EventCall.md)

An event that can be triggered when the objective is started, completed, etc.
Useful for adding custom functionality to an objective.

#### Defined in

[shared/interfaces/job.ts:158](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L158)

___

### marker

• `Optional` **marker**: [`Marker`](shared_interfaces_marker_Marker.md)

A local marker to associate with this objective.

#### Defined in

[shared/interfaces/job.ts:122](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L122)

___

### nextCaptureTime

• `Optional` **nextCaptureTime**: `number`

The time between captures. This should be left alone.

#### Defined in

[shared/interfaces/job.ts:115](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L115)

___

### onlyCallbackCheck

• `Optional` **onlyCallbackCheck**: `boolean`

Turns off all other objective checks, and only does the `callbackOnCheck` callback provided.

#### Defined in

[shared/interfaces/job.ts:174](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L174)

___

### particle

• `Optional` **particle**: [`Particle`](shared_interfaces_particle_Particle.md)

Particles to show in the area of the objective.
Useful to add some 'flavor' to your objective.

#### Defined in

[shared/interfaces/job.ts:166](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L166)

___

### pos

• **pos**: `IVector3`

The 3D Position of this objective.

#### Defined in

[shared/interfaces/job.ts:79](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L79)

___

### range

• **range**: `number`

The range which this objective can be completed in.
Usually set to around 2.

#### Defined in

[shared/interfaces/job.ts:87](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L87)

___

### textLabel

• `Optional` **textLabel**: [`TextLabel`](shared_interfaces_textLabel_TextLabel.md)

A local text label to associate with this objective.

#### Defined in

[shared/interfaces/job.ts:129](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L129)

___

### type

• **type**: [`ObjectiveType`](../enums/shared_interfaces_job_ObjectiveType.md)

An objective type that is unique to this objective.

#### Defined in

[shared/interfaces/job.ts:72](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L72)

___

### uid

• `Optional` **uid**: `string`

A unique identifier that can be assigned to an objective to help identify it easily.

#### Defined in

[shared/interfaces/job.ts:58](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/interfaces/job.ts#L58)
