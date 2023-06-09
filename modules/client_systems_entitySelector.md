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

[client/systems/entitySelector.ts:12](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/entitySelector.ts#L12)

___

### ValidEntityTypes

Ƭ **ValidEntityTypes**: ``"object"`` \| ``"pos"`` \| ``"npc"`` \| ``"player"`` \| ``"vehicle"`` \| ``"interaction"``

#### Defined in

[client/systems/entitySelector.ts:11](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/entitySelector.ts#L11)

## Functions

### getSelectables

::: tip Usage
AthenaClient.systems.entitySelector.**getSelectables**(): [`TargetInfo`](client_systems_entitySelector.md#TargetInfo)[]
:::

Get all of the current entities in the player's radius.

#### Returns

[`TargetInfo`](client_systems_entitySelector.md#TargetInfo)[]

#### Defined in

[client/systems/entitySelector.ts:280](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/entitySelector.ts#L280)

___

### getSelection

::: tip Usage
AthenaClient.systems.entitySelector.**getSelection**(): [`TargetInfo`](client_systems_entitySelector.md#TargetInfo) \| `undefined`
:::

Return the currently selected entity.

#### Returns

[`TargetInfo`](client_systems_entitySelector.md#TargetInfo) \| `undefined`

#### Defined in

[client/systems/entitySelector.ts:267](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/entitySelector.ts#L267)

___

### setInteraction

::: tip Usage
AthenaClient.systems.entitySelector.**setInteraction**(`interaction`): `void`
:::

Sets an interaction to be pushed into the entity list.

#### Parameters

| Name | Type |
| :------ | :------ |
| `interaction` | `any` |

#### Returns

`void`

#### Defined in

[client/systems/entitySelector.ts:289](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/entitySelector.ts#L289)

___

### setMarkerColor

::: tip Usage
AthenaClient.systems.entitySelector.**setMarkerColor**(`customColor`): `void`
:::

Change the defualt marker colour.

#### Parameters

| Name | Type |
| :------ | :------ |
| `customColor` | `RGBA` |

#### Returns

`void`

#### Defined in

[client/systems/entitySelector.ts:306](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/entitySelector.ts#L306)

___

### setMarkerOff

::: tip Usage
AthenaClient.systems.entitySelector.**setMarkerOff**(): `void`
:::

Turn the marker off.

#### Returns

`void`

#### Defined in

[client/systems/entitySelector.ts:297](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/entitySelector.ts#L297)

___

### setMarkerSize

::: tip Usage
AthenaClient.systems.entitySelector.**setMarkerSize**(`markerSize`): `void`
:::

Change the defualt marker size.

#### Parameters

| Name | Type |
| :------ | :------ |
| `markerSize` | `Vector3` |

#### Returns

`void`

#### Defined in

[client/systems/entitySelector.ts:315](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/entitySelector.ts#L315)

___

### setToAutoMode

::: tip Usage
AthenaClient.systems.entitySelector.**setToAutoMode**(): `void`
:::

When this function is called, it automatically will always
find the closest entity. It will not allow cycling Targets.

**`Export`**

#### Returns

`void`

#### Defined in

[client/systems/entitySelector.ts:325](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/entitySelector.ts#L325)
