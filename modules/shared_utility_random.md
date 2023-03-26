---
title: AthenaShared.utility.random
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### getRandomElement

▸ **getRandomElement**<`T`\>(`elements`): `T`

Return a random value from an array of values

**`Export`**

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `elements` | `T`[] |

#### Returns

`T`

#### Defined in

[shared/utility/random.ts:79](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/shared/utility/random.ts#L79)

___

### getRandomRGB

▸ **getRandomRGB**(`alpha?`): `alt.RGBA`

Get a random color excluding alpha

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `alpha` | `number` | `255` |

#### Returns

`alt.RGBA`

#### Defined in

[shared/utility/random.ts:27](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/shared/utility/random.ts#L27)

___

### getRandomRGBA

▸ **getRandomRGBA**(): `alt.RGBA`

Get a random color including random alpha

#### Returns

`alt.RGBA`

#### Defined in

[shared/utility/random.ts:38](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/shared/utility/random.ts#L38)

___

### randomNumberBetween

▸ **randomNumberBetween**(`min`, `max`): `number`

Get a random number between min and max (max excluded)

#### Parameters

| Name | Type |
| :------ | :------ |
| `min` | `number` |
| `max` | `number` |

#### Returns

`number`

#### Defined in

[shared/utility/random.ts:9](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/shared/utility/random.ts#L9)

___

### randomNumberBetweenInclusive

▸ **randomNumberBetweenInclusive**(`min`, `max`): `number`

Get a random number between min and max (max included)

#### Parameters

| Name | Type |
| :------ | :------ |
| `min` | `number` |
| `max` | `number` |

#### Returns

`number`

#### Defined in

[shared/utility/random.ts:19](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/shared/utility/random.ts#L19)

___

### shuffle

▸ **shuffle**<`T`\>(`array`): `T`[]

Shuffle an array, and return randomized order.

**`Export`**

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `array` | `T`[] |

#### Returns

`T`[]

#### Defined in

[shared/utility/random.ts:54](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/shared/utility/random.ts#L54)
