---
title: AthenaClient.utility.directionToVector.DirectionVector
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/utility/directionToVector](../modules/client_utility_directionToVector.md).DirectionVector

## Constructors

### constructor

• **new DirectionVector**(`position`, `rotation`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `any` |
| `rotation` | `any` |

#### Defined in

[client/utility/directionToVector.ts:7](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/utility/directionToVector.ts#L7)

## Properties

### position

• `Private` **position**: `IVector3`

#### Defined in

[client/utility/directionToVector.ts:4](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/utility/directionToVector.ts#L4)

___

### rotation

• `Private` **rotation**: `IVector3`

#### Defined in

[client/utility/directionToVector.ts:5](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/utility/directionToVector.ts#L5)

## Methods

### eulerToQuaternion

::: Tip
AthenaClient.utility.directionToVector.DirectionVector.**eulerToQuaternion**(`rotation`): `Object`
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

[client/utility/directionToVector.ts:12](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/utility/directionToVector.ts#L12)

___

### forward

::: Tip
AthenaClient.utility.directionToVector.DirectionVector.**forward**(`distance`): `IVector3`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `distance` | `number` |

#### Returns

`IVector3`

#### Defined in

[client/utility/directionToVector.ts:42](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/utility/directionToVector.ts#L42)

___

### forwardVector

::: Tip
AthenaClient.utility.directionToVector.DirectionVector.**forwardVector**(): `IVector3`
:::

#### Returns

`IVector3`

#### Defined in

[client/utility/directionToVector.ts:33](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/utility/directionToVector.ts#L33)

___

### right

::: Tip
AthenaClient.utility.directionToVector.DirectionVector.**right**(`distance`): `Object`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `distance` | `number` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `x` | `any` |
| `y` | `any` |
| `z` | `any` |

#### Defined in

[client/utility/directionToVector.ts:62](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/utility/directionToVector.ts#L62)

___

### rightVector

::: Tip
AthenaClient.utility.directionToVector.DirectionVector.**rightVector**(): `Object`
:::

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Defined in

[client/utility/directionToVector.ts:52](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/utility/directionToVector.ts#L52)

___

### up

::: Tip
AthenaClient.utility.directionToVector.DirectionVector.**up**(`distance`): `Object`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `distance` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `x` | `any` |
| `y` | `any` |
| `z` | `any` |

#### Defined in

[client/utility/directionToVector.ts:81](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/utility/directionToVector.ts#L81)

___

### upVector

::: Tip
AthenaClient.utility.directionToVector.DirectionVector.**upVector**(): `Object`
:::

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Defined in

[client/utility/directionToVector.ts:72](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/utility/directionToVector.ts#L72)
