---
title: AthenaShared.utility.extractStringKeys.Internal
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### Extract

Ƭ **Extract**<`T`, `U`\>: `T` extends `U` ? `T` : `never`

Extract from T those types that are assignable to U

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Defined in

../../node_modules/typescript/lib/lib.es5.d.ts:1571

___

### Record

Ƭ **Record**<`K`, `T`\>: { [P in K]: T }

Construct a type with a set of properties K of type T

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `any` |
| `T` | `T` |

#### Defined in

../../node_modules/typescript/lib/lib.es5.d.ts:1559
