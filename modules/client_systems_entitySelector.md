---
title: AthenaClient.systems.entitySelector
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### TargetInfo

Ƭ **TargetInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dist` | `number` |
| `height` | `number` |
| `id` | `number` |
| `pos` | `alt.IVector3` |
| `type` | [`ValidEntityTypes`](client_systems_entitySelector.md#ValidEntityTypes) |

#### Defined in

[client/systems/entitySelector.ts:12](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/systems/entitySelector.ts#L12)

___

### ValidEntityTypes

Ƭ **ValidEntityTypes**: ``"object"`` \| ``"pos"`` \| ``"npc"`` \| ``"player"`` \| ``"vehicle"`` \| ``"interaction"``

#### Defined in

[client/systems/entitySelector.ts:11](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/systems/entitySelector.ts#L11)

## Functions

### getSelectables

▸ **getSelectables**(): [`TargetInfo`](client_systems_entitySelector.md#TargetInfo)[]

Get all of the current entities in the player's radius.

#### Returns

[`TargetInfo`](client_systems_entitySelector.md#TargetInfo)[]

#### Defined in

[client/systems/entitySelector.ts:268](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/systems/entitySelector.ts#L268)

___

### getSelection

▸ **getSelection**(): [`TargetInfo`](client_systems_entitySelector.md#TargetInfo) \| `undefined`

Return the currently selected entity.

#### Returns

[`TargetInfo`](client_systems_entitySelector.md#TargetInfo) \| `undefined`

#### Defined in

[client/systems/entitySelector.ts:255](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/systems/entitySelector.ts#L255)

___

### setInteraction

▸ **setInteraction**(`interaction`): `void`

Sets an interaction to be pushed into the entity list.

#### Parameters

| Name | Type |
| :------ | :------ |
| `interaction` | `any` |

#### Returns

`void`

#### Defined in

[client/systems/entitySelector.ts:277](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/systems/entitySelector.ts#L277)

___

### setMarkerColor

▸ **setMarkerColor**(`customColor`): `void`

Change the defualt marker colour.

#### Parameters

| Name | Type |
| :------ | :------ |
| `customColor` | `RGBA` |

#### Returns

`void`

#### Defined in

[client/systems/entitySelector.ts:294](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/systems/entitySelector.ts#L294)

___

### setMarkerOff

▸ **setMarkerOff**(): `void`

Turn the marker off.

#### Returns

`void`

#### Defined in

[client/systems/entitySelector.ts:285](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/systems/entitySelector.ts#L285)

___

### setMarkerSize

▸ **setMarkerSize**(`markerSize`): `void`

Change the defualt marker size.

#### Parameters

| Name | Type |
| :------ | :------ |
| `markerSize` | `Vector3` |

#### Returns

`void`

#### Defined in

[client/systems/entitySelector.ts:303](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/systems/entitySelector.ts#L303)
