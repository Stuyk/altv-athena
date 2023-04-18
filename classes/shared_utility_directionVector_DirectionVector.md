---
title: AthenaShared.utility.directionVector.DirectionVector
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/utility/directionVector](../modules/shared_utility_directionVector.md).DirectionVector

## Constructors

### constructor

• **new DirectionVector**(`position`, `rotation`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `IVector3` |
| `rotation` | `IVector3` |

#### Defined in

[shared/utility/directionVector.ts:7](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/shared/utility/directionVector.ts#L7)

## Properties

### position

• `Private` **position**: `IVector3`

#### Defined in

[shared/utility/directionVector.ts:4](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/shared/utility/directionVector.ts#L4)

___

### rotation

• `Private` **rotation**: `IVector3`

#### Defined in

[shared/utility/directionVector.ts:5](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/shared/utility/directionVector.ts#L5)

## Methods

### eulerToQuaternion

::: tip Usage
AthenaShared.utility.directionVector.DirectionVector.**eulerToQuaternion**(`rotation`): `Object`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `rotation` | `IVector3` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `w` | `number` |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Defined in

[shared/utility/directionVector.ts:12](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/shared/utility/directionVector.ts#L12)

___

### forward

::: tip Usage
AthenaShared.utility.directionVector.DirectionVector.**forward**(`distance`): `IVector3`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `distance` | `number` |

#### Returns

`IVector3`

#### Defined in

[shared/utility/directionVector.ts:42](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/shared/utility/directionVector.ts#L42)

___

### forwardVector

::: tip Usage
AthenaShared.utility.directionVector.DirectionVector.**forwardVector**(): `IVector3`
:::

#### Returns

`IVector3`

#### Defined in

[shared/utility/directionVector.ts:33](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/shared/utility/directionVector.ts#L33)

___

### right

::: tip Usage
AthenaShared.utility.directionVector.DirectionVector.**right**(`distance`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `distance` | `number` |

#### Returns

`any`

#### Defined in

[shared/utility/directionVector.ts:62](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/shared/utility/directionVector.ts#L62)

___

### rightVector

::: tip Usage
AthenaShared.utility.directionVector.DirectionVector.**rightVector**(): `any`
:::

#### Returns

`any`

#### Defined in

[shared/utility/directionVector.ts:52](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/shared/utility/directionVector.ts#L52)

___

### up

::: tip Usage
AthenaShared.utility.directionVector.DirectionVector.**up**(`distance`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `distance` | `number` |

#### Returns

`any`

#### Defined in

[shared/utility/directionVector.ts:81](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/shared/utility/directionVector.ts#L81)

___

### upVector

::: tip Usage
AthenaShared.utility.directionVector.DirectionVector.**upVector**(): `any`
:::

#### Returns

`any`

#### Defined in

[shared/utility/directionVector.ts:72](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/shared/utility/directionVector.ts#L72)
