---
title: Athena.utility.restrict.Restrictions
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/utility/restrict](../modules/server_utility_restrict.md).Restrictions

Used to build a restricted function.

**`Interface`**

Restrictions

## Properties

### kickOnBadPermission

• `Optional` **kickOnBadPermission**: `Object`

Kick the player if they do not have permission

**`Memberof`**

Restrictions

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `consoleMessage` | `string` | What to tell console when they are kicked. Player name is automatically appended to the beginning. |
| `kickMessage` | `string` | What do we tell them when they are kicked |

#### Defined in

[server/utility/restrict.ts:37](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/utility/restrict.ts#L37)

___

### notify

• `Optional` **notify**: `string`

What to tell the user if they are restricted

#### Defined in

[server/utility/restrict.ts:29](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/utility/restrict.ts#L29)

___

### permissions

• **permissions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `string`[] |
| `character` | `string`[] |

#### Defined in

[server/utility/restrict.ts:11](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/utility/restrict.ts#L11)

___

### strategy

• **strategy**: ``"hasOne"`` \| ``"hasAll"``

hasOne - Checks if character, or account has a given permission
hasAll - Expects all permissions to exist on character && account

#### Defined in

[server/utility/restrict.ts:22](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/utility/restrict.ts#L22)
