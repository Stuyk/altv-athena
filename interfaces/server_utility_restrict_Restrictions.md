---
title: Athena.utility.restrict.Restrictions
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/utility/restrict](../modules/server_utility_restrict.md).Restrictions

Used to build a restricted function.

**`Export`**

**`Interface`**

Restrictions

## Properties

### notify

• `Optional` **notify**: `string`

What to tell the user if they are restricted

**`Memberof`**

Restrictions

#### Defined in

[server/utility/restrict.ts:29](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/utility/restrict.ts#L29)

___

### permissions

• **permissions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `string`[] |
| `character` | `string`[] |

#### Defined in

[server/utility/restrict.ts:11](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/utility/restrict.ts#L11)

___

### strategy

• **strategy**: ``"hasOne"`` \| ``"hasAll"``

hasOne - Checks if character, or account has a given permission
hasAll - Expects all permissions to exist on character && account

**`Memberof`**

Restrictions

#### Defined in

[server/utility/restrict.ts:22](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/utility/restrict.ts#L22)
