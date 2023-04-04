---
title: AthenaShared.utility.complete
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### Complete

Ƭ **Complete**<`T`\>: { [P in keyof Required<T\>]: Pick<T, P\> extends Required<Pick<T, P\>\> ? T[P] : T[P] \| undefined }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[shared/utility/complete.ts:1](https://github.com/Stuyk/altv-athena/blob/9e819c0/src/core/shared/utility/complete.ts#L1)
