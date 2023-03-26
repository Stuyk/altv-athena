---
title: Athena.player.inventory.Internal
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### Exclude

Ƭ **Exclude**<`T`, `U`\>: `T` extends `U` ? `never` : `T`

Exclude from T those types that are assignable to U

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Defined in

../../node_modules/typescript/lib/lib.es5.d.ts:1566

___

### Omit

Ƭ **Omit**<`T`, `K`\>: [`Pick`](server_player_inventory_Internal.md#Pick)<`T`, [`Exclude`](server_player_inventory_Internal.md#Exclude)<keyof `T`, `K`\>\>

Construct a type with the properties of T except for those in type K.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends keyof `any` |

#### Defined in

../../node_modules/typescript/lib/lib.es5.d.ts:1576

___

### Pick

Ƭ **Pick**<`T`, `K`\>: { [P in K]: T[P] }

From T, pick a set of properties whose keys are in the union K

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends keyof `T` |

#### Defined in

../../node_modules/typescript/lib/lib.es5.d.ts:1552
