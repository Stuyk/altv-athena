---
title: AthenaShared.utility.deepCopy
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### deepCloneArray

▸ **deepCloneArray**<`T`\>(`data`): `T`[]

Makes a complete copy of an array and all objects.

**`Export`**

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | (`object` \| `T`)[] |

#### Returns

`T`[]

#### Defined in

[shared/utility/deepCopy.ts:29](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/shared/utility/deepCopy.ts#L29)

___

### deepCloneObject

▸ **deepCloneObject**<`T`\>(`data`): `T`

Used to deep clone an object and detach all references.
Does not work with functions.
This is required to prevent data from being modified in other items.

**`Export`**

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `object` |

#### Returns

`T`

#### Defined in

[shared/utility/deepCopy.ts:9](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/shared/utility/deepCopy.ts#L9)
