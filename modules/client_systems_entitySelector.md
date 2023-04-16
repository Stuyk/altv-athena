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

[client/systems/entitySelector.ts:12](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/client/systems/entitySelector.ts#L12)

___

### ValidEntityTypes

Ƭ **ValidEntityTypes**: ``"object"`` \| ``"pos"`` \| ``"npc"`` \| ``"player"`` \| ``"vehicle"`` \| ``"interaction"``

#### Defined in

[client/systems/entitySelector.ts:11](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/client/systems/entitySelector.ts#L11)

## Functions

### getSelectables

::: tip Usage
AthenaClient.systems.entitySelector.**getSelectables**(): [`TargetInfo`](client_systems_entitySelector.md#TargetInfo)[]
:::

Get all of the current entities in the player's radius.

#### Returns

[`TargetInfo`](client_systems_entitySelector.md#TargetInfo)[]

#### Defined in

[client/systems/entitySelector.ts:273](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/client/systems/entitySelector.ts#L273)

___

### getSelection

::: tip Usage
AthenaClient.systems.entitySelector.**getSelection**(): [`TargetInfo`](client_systems_entitySelector.md#TargetInfo) \| `undefined`
:::

Return the currently selected entity.

#### Returns

[`TargetInfo`](client_systems_entitySelector.md#TargetInfo) \| `undefined`

#### Defined in

[client/systems/entitySelector.ts:260](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/client/systems/entitySelector.ts#L260)

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

[client/systems/entitySelector.ts:282](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/client/systems/entitySelector.ts#L282)

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

[client/systems/entitySelector.ts:299](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/client/systems/entitySelector.ts#L299)

___

### setMarkerOff

::: tip Usage
AthenaClient.systems.entitySelector.**setMarkerOff**(): `void`
:::

Turn the marker off.

#### Returns

`void`

#### Defined in

[client/systems/entitySelector.ts:290](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/client/systems/entitySelector.ts#L290)

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

[client/systems/entitySelector.ts:308](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/client/systems/entitySelector.ts#L308)

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

[client/systems/entitySelector.ts:318](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/client/systems/entitySelector.ts#L318)
