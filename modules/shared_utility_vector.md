---
title: AthenaShared.utility.vector
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `distance` | (`vector1`: `IVector3`, `vector2`: `IVector3`) => `number` |
| `distance2d` | (`vector1`: `IVector2`, `vector2`: `IVector2`) => `number` |
| `fwdX` | (`x`: `number`, `z`: `number`) => `number` |
| `fwdY` | (`x`: `number`, `z`: `number`) => `number` |
| `fwdZ` | (`x`: `number`) => `number` |
| `getClosestEntity` | <T\>(`playerPosition`: `IVector3`, `rot`: `IVector3`, `entities`: { `pos`: `IVector3` ; `valid?`: `boolean`  }[], `dist`: `number`, `checkBackwards`: `boolean`) => `T` \| ``null`` |
| `getClosestOfType` | <T\>(`pos`: `IVector3`, `elements`: readonly `T` & { `pos`: `IVector3`  }[], `lastDistance`: `number`) => `T` \| `undefined` |
| `getClosestTypes` | <T\>(`pos`: `IVector3`, `elements`: `T`[], `maxDistance`: `number`, `mustHaveProperties`: `string`[], `positionName`: `string`) => `T`[] |
| `getClosestVector` | (`pos`: `IVector3`, `arrayOfPositions`: `IVector3`[]) => `IVector3` |
| `getClosestVectorByPos` | <T\>(`pos`: `IVector3`, `arrayOfPositions`: `T`[], `posVariable?`: `string`) => `T` |
| `getForwardVector` | (`rot`: `IVector3`) => `alt.IVector3` |
| `getVectorInFrontOfPlayer` | (`entity`: { `pos`: `IVector3` ; `rot`: `IVector3`  }, `distance`: `number`) => `alt.Vector3` |
| `isBetweenVectors` | (`pos`: `IVector3`, `vector1`: `IVector3`, `vector2`: `IVector3`) => `boolean` |
| `lerp` | (`a`: `number`, `b`: `number`, `t`: `number`) => `number` |
| `vectorLerp` | (`start`: `IVector3`, `end`: `IVector3`, `l`: `number`, `clamp`: `boolean`) => `alt.IVector3` |

#### Defined in

[shared/utility/vector.ts:315](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L315)

## Functions

### distance

::: tip Usage
AthenaShared.utility.vector.**distance**(`vector1`, `vector2`): `number`
:::

Get the distance between two positions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `vector1` | `IVector3` |
| `vector2` | `IVector3` |

#### Returns

`number`

#### Defined in

[shared/utility/vector.ts:11](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L11)

___

### distance2d

::: tip Usage
AthenaShared.utility.vector.**distance2d**(`vector1`, `vector2`): `number`
:::

Get the distance between two positions. Excludes z

#### Parameters

| Name | Type |
| :------ | :------ |
| `vector1` | `IVector2` |
| `vector2` | `IVector2` |

#### Returns

`number`

#### Defined in

[shared/utility/vector.ts:29](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L29)

___

### getClosestEntity

::: tip Usage
AthenaShared.utility.vector.**getClosestEntity**<`T`\>(`playerPosition`, `rot`, `entities`, `dist`, `checkBackwards?`): `T` \| ``null``
:::

Get the closest server entity type. Server only.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `playerPosition` | `IVector3` | `undefined` |  |
| `rot` | `IVector3` | `undefined` | player rotation |
| `entities` | { `pos`: `IVector3` ; `valid?`: `boolean`  }[] | `undefined` |  |
| `dist` | `number` | `undefined` | - |
| `checkBackwards` | `boolean` | `false` | - |

#### Returns

`T` \| ``null``

#### Defined in

[shared/utility/vector.ts:208](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L208)

___

### getClosestOfType

::: tip Usage
AthenaShared.utility.vector.**getClosestOfType**<`T`\>(`pos`, `elements`, `lastDistance?`): `T` \| `undefined`
:::

Get the closest of a specific type of object with a `pos` property.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | { `pos`: `IVector3`  } |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `elements` | readonly `T` & { `pos`: `IVector3`  }[] | `undefined` |  |
| `lastDistance` | `number` | `100` |  |

#### Returns

`T` \| `undefined`

#### Defined in

[shared/utility/vector.ts:297](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L297)

___

### getClosestTypes

::: tip Usage
AthenaShared.utility.vector.**getClosestTypes**<`T`\>(`pos`, `elements`, `maxDistance`, `mustHaveProperties?`, `positionName?`): `T`[]
:::

Gets an array of the closest types.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `elements` | `T`[] | `undefined` |  |
| `maxDistance` | `number` | `undefined` |  |
| `mustHaveProperties` | `string`[] | `[]` | - |
| `positionName` | `string` | `'pos'` | - |

#### Returns

`T`[]

#### Defined in

[shared/utility/vector.ts:80](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L80)

___

### getClosestVector

::: tip Usage
AthenaShared.utility.vector.**getClosestVector**(`pos`, `arrayOfPositions`): `IVector3`
:::

Get the closest vector given an array of positions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pos` | `IVector3` | A position in the world. |
| `arrayOfPositions` | `IVector3`[] |  |

#### Returns

`IVector3`

#### Defined in

[shared/utility/vector.ts:45](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L45)

___

### getClosestVectorByPos

::: tip Usage
AthenaShared.utility.vector.**getClosestVectorByPos**<`T`\>(`pos`, `arrayOfPositions`, `posVariable?`): `T`
:::

Get the closest Vector by position.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `arrayOfPositions` | `T`[] | `undefined` |  |
| `posVariable?` | `string` | `'pos'` |  |

#### Returns

`T`

#### Defined in

[shared/utility/vector.ts:63](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L63)

___

### getForwardVector

::: tip Usage
AthenaShared.utility.vector.**getForwardVector**(`rot`): `alt.IVector3`
:::

SERVER ONLY
Gets the direction the player is facing.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rot` | `IVector3` |

#### Returns

`alt.IVector3`

#### Defined in

[shared/utility/vector.ts:156](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L156)

___

### getVectorInFrontOfPlayer

::: tip Usage
AthenaShared.utility.vector.**getVectorInFrontOfPlayer**(`entity`, `distance`): `alt.Vector3`
:::

SERVER ONLY
Return a position in front of a player based on distance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `Object` |
| `entity.pos` | `IVector3` |
| `entity.rot` | `IVector3` |
| `distance` | `number` |

#### Returns

`alt.Vector3`

#### Defined in

[shared/utility/vector.ts:172](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L172)

___

### isBetweenVectors

::: tip Usage
AthenaShared.utility.vector.**isBetweenVectors**(`pos`, `vector1`, `vector2`): `boolean`
:::

Determine if a vector is between vectors.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pos` | `IVector3` | A position in the world. |
| `vector1` | `IVector3` |  |
| `vector2` | `IVector3` |  |

#### Returns

`boolean`

#### Defined in

[shared/utility/vector.ts:193](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L193)

___

### lerp

::: tip Usage
AthenaShared.utility.vector.**lerp**(`a`, `b`, `t`): `number`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number` |
| `b` | `number` |
| `t` | `number` |

#### Returns

`number`

#### Defined in

[shared/utility/vector.ts:118](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L118)

___

### vectorLerp

::: tip Usage
AthenaShared.utility.vector.**vectorLerp**(`start`, `end`, `l`, `clamp`): `alt.IVector3`
:::

Finds a position between two vectors to ease into.
Returns a new position.

#### Parameters

| Name | Type |
| :------ | :------ |
| `start` | `IVector3` |
| `end` | `IVector3` |
| `l` | `number` |
| `clamp` | `boolean` |

#### Returns

`alt.IVector3`

#### Defined in

[shared/utility/vector.ts:133](https://github.com/Stuyk/altv-athena/blob/bde990b/src/core/shared/utility/vector.ts#L133)
