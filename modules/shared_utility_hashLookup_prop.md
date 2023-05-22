---
title: AthenaShared.utility.hashLookup.prop
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
| `hash` | (`hash`: `number`) => [`player`](server_config.md#player) |
| `hexHash` | (`hash`: `string`) => [`player`](server_config.md#player) |
| `signedHash` | (`hash`: `number`) => [`player`](server_config.md#player) |

#### Defined in

[shared/utility/hashLookup/prop.ts:43](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/shared/utility/hashLookup/prop.ts#L43)

## Functions

### hexHash

::: tip Usage
AthenaShared.utility.hashLookup.prop.**hexHash**(`hash`): [`player`](server_config.md#player)
:::

Get the PropInfo corresponding to a hex hash.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `string` |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[shared/utility/hashLookup/prop.ts:37](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/shared/utility/hashLookup/prop.ts#L37)

___

### signedHash

::: tip Usage
AthenaShared.utility.hashLookup.prop.**signedHash**(`hash`): [`player`](server_config.md#player)
:::

Get the PropInfo corresponding to a signed hash.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `number` |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[shared/utility/hashLookup/prop.ts:24](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/shared/utility/hashLookup/prop.ts#L24)
