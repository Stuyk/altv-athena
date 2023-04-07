---
title: AthenaShared.utility.hashLookup.ped
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

[shared/utility/hashLookup/ped.ts:43](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/shared/utility/hashLookup/ped.ts#L43)

## Functions

### hexHash

::: tip Usage
AthenaShared.utility.hashLookup.ped.**hexHash**(`hash`): [`player`](server_config.md#player)
:::

Get the PedInfo corresponding to a hex hash.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `string` |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[shared/utility/hashLookup/ped.ts:37](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/shared/utility/hashLookup/ped.ts#L37)

___

### signedHash

::: tip Usage
AthenaShared.utility.hashLookup.ped.**signedHash**(`hash`): [`player`](server_config.md#player)
:::

Get the PedInfo corresponding to a signed hash.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `number` |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[shared/utility/hashLookup/ped.ts:24](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/shared/utility/hashLookup/ped.ts#L24)
