---
title: AthenaClient.utility.math
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### degToRad

::: tip Usage
AthenaClient.utility.math.**degToRad**(`degrees`): `number`
:::

Converts degrees to radians

**`Name`**

degToRad

#### Parameters

| Name | Type |
| :------ | :------ |
| `degrees` | `number` |

#### Returns

`number`

s

#### Defined in

[client/utility/math.ts:43](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/client/utility/math.ts#L43)

___

### getAverage

::: tip Usage
AthenaClient.utility.math.**getAverage**(`data`): `number`
:::

Returns the average value among all numbers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `number`[] |

#### Returns

`number`

#### Defined in

[client/utility/math.ts:113](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/client/utility/math.ts#L113)

___

### getCrossProduct

::: tip Usage
AthenaClient.utility.math.**getCrossProduct**(`v1`, `v2`): `alt.Vector3`
:::

It's a function that takes two vectors and returns a vector.

**`Name`**

getCrossProduct

#### Parameters

| Name | Type |
| :------ | :------ |
| `v1` | `Vector3` |
| `v2` | `Vector3` |

#### Returns

`alt.Vector3`

s

#### Defined in

[client/utility/math.ts:14](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/client/utility/math.ts#L14)

___

### getDirectionFromRotation

::: tip Usage
AthenaClient.utility.math.**getDirectionFromRotation**(`rotation`): `alt.IVector3`
:::

It's converting a rotation to a direction.

**`Name`**

getDirectionFromRotation

#### Parameters

| Name | Type |
| :------ | :------ |
| `rotation` | `IVector3` |

#### Returns

`alt.IVector3`

s

#### Defined in

[client/utility/math.ts:72](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/client/utility/math.ts#L72)

___

### getNormalizedVector

::: tip Usage
AthenaClient.utility.math.**getNormalizedVector**(`vector`): `alt.Vector3`
:::

It's a function that takes a vector and returns a normalized vector.

**`Name`**

getNormalizedVector

#### Parameters

| Name | Type |
| :------ | :------ |
| `vector` | `Vector3` |

#### Returns

`alt.Vector3`

s

#### Defined in

[client/utility/math.ts:28](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/client/utility/math.ts#L28)

___

### getPointsInCircle

::: tip Usage
AthenaClient.utility.math.**getPointsInCircle**(`points`, `radius`, `center`): `alt.IVector2`[]
:::

Returns an array of alt.IVector2 in a circle

**`Name`**

getPointsInCircle

#### Parameters

| Name | Type |
| :------ | :------ |
| `points` | `number` |
| `radius` | `number` |
| `center` | `IVector2` |

#### Returns

`alt.IVector2`[]

s

#### Defined in

[client/utility/math.ts:92](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/client/utility/math.ts#L92)

___

### rotationToDirection

::: tip Usage
AthenaClient.utility.math.**rotationToDirection**(`rotation`): `alt.Vector3`
:::

Could also be seen as rotAnglesToVector

#### Parameters

| Name | Type |
| :------ | :------ |
| `rotation` | `IVector3` |

#### Returns

`alt.Vector3`

#### Defined in

[client/utility/math.ts:54](https://github.com/Stuyk/altv-athena/blob/01dffad/src/core/client/utility/math.ts#L54)
