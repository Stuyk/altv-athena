---
title: AthenaShared.utility.clothing
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### ClothingInfo

Ƭ **ClothingInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `components` | [`player`](server_config.md#player)[] |
| `sex` | `number` |

#### Defined in

[shared/utility/clothing.ts:6](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/shared/utility/clothing.ts#L6)

## Functions

### clothingComponentToIconName

▸ **clothingComponentToIconName**(`sex`, `components`): `string`

Converts a clothing component to the corresponding icon name that should be used.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `sex` | `number` |
| `components` | `ClothingComponent`[] |

#### Returns

`string`

#### Defined in

[shared/utility/clothing.ts:43](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/shared/utility/clothing.ts#L43)

___

### clothingItemToIconName

▸ **clothingItemToIconName**(`item`): `string`

Converts clothing information to an icon name that can be used
componentIdentifier-dlcHash-isProp?-isNotShared?-drawableID

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `Item`<`DefaultItemBehavior`, [`ClothingInfo`](shared_utility_clothing.md#ClothingInfo)\> |

#### Returns

`string`

#### Defined in

[shared/utility/clothing.ts:16](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/shared/utility/clothing.ts#L16)
