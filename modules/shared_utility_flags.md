---
title: AthenaShared.utility.flags
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](shared_utility_flags_Internal.md)

## Functions

### isFlagEnabled

::: tip Usage
AthenaShared.utility.flags.**isFlagEnabled**(`flags`, `flagToCheck`): `boolean`
:::

Verify if a bitwise flag is enabled.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `flags` | `number` \| [`Permissions`](shared_utility_flags_Internal.md#Permissions) |
| `flagToCheck` | `number` \| [`Permissions`](shared_utility_flags_Internal.md#Permissions) |

#### Returns

`boolean`

#### Defined in

[shared/utility/flags.ts:10](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/shared/utility/flags.ts#L10)
