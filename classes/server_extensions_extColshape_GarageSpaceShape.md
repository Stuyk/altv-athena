---
title: Athena.extensions.extColshape.GarageSpaceShape
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/extensions/extColshape](../modules/server_extensions_extColshape.md).GarageSpaceShape

## Hierarchy

- [`player`](../modules/server_config.md#player)

  ↳ **`GarageSpaceShape`**

## Constructors

### constructor

• **new GarageSpaceShape**(`position`, `rotation`, `radius`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `IVector3` |
| `rotation` | `IVector3` |
| `radius` | `number` |

#### Overrides

alt.ColshapeSphere.constructor

#### Defined in

[server/extensions/extColshape.ts:38](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/extensions/extColshape.ts#L38)

## Properties

### isGarage

• **isGarage**: `boolean` = `true`

#### Defined in

[server/extensions/extColshape.ts:36](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/extensions/extColshape.ts#L36)

___

### isOpen

• `Private` **isOpen**: `boolean` = `true`

#### Defined in

[server/extensions/extColshape.ts:35](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/extensions/extColshape.ts#L35)

___

### rotation

• `Private` **rotation**: `IVector3`

#### Defined in

[server/extensions/extColshape.ts:34](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/extensions/extColshape.ts#L34)

## Methods

### getPositionAndRotation

▸ **getPositionAndRotation**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `position` | `any` |
| `rotation` | `IVector3` |

#### Defined in

[server/extensions/extColshape.ts:47](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/extensions/extColshape.ts#L47)

___

### getSpaceStatus

▸ **getSpaceStatus**(): `boolean`

#### Returns

`boolean`

#### Defined in

[server/extensions/extColshape.ts:51](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/extensions/extColshape.ts#L51)

___

### setSpaceStatus

▸ **setSpaceStatus**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[server/extensions/extColshape.ts:43](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/extensions/extColshape.ts#L43)
