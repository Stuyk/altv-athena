---
title: AthenaShared.utility.extractStringKeys
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](shared_utility_extractStringKeys_Internal.md)

## Type Aliases

### ExtractStringKeys

Ƭ **ExtractStringKeys**<`TInterface`\>: keyof { [K in keyof TInterface as Extract<K, string\>]: TInterface[K] }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TInterface` | extends [`Record`](shared_utility_extractStringKeys_Internal.md#Record)<`any`, `any`\> |

#### Defined in

[shared/utility/extractStringKeys.ts:1](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/shared/utility/extractStringKeys.ts#L1)
