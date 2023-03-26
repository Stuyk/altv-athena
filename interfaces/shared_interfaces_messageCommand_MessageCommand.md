---
title: AthenaShared.interfaces.messageCommand.MessageCommand
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/messageCommand](../modules/shared_interfaces_messageCommand.md).MessageCommand

Used to describe a command.

**`Export`**

**`Interface`**

MessageCommand

## Type parameters

| Name |
| :------ |
| `T` |

## Properties

### callback

• **callback**: [`CommandCallback`](../modules/shared_interfaces_messageCommand.md#CommandCallback)<`T`\>

The function to call when this command is executed by a player, or internal function.

**`Memberof`**

MessageCommand

#### Defined in

[shared/interfaces/messageCommand.ts:48](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/shared/interfaces/messageCommand.ts#L48)

___

### description

• **description**: `string`

A description of this command.

**`Memberof`**

MessageCommand

#### Defined in

[shared/interfaces/messageCommand.ts:25](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/shared/interfaces/messageCommand.ts#L25)

___

### isCharacterPermission

• `Optional` **isCharacterPermission**: `boolean`

Should this command use character permissions instead of account?

**`Memberof`**

MessageCommand

#### Defined in

[shared/interfaces/messageCommand.ts:41](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/shared/interfaces/messageCommand.ts#L41)

___

### name

• **name**: `string`

The plain text iteration of this command.

**`Memberof`**

MessageCommand

#### Defined in

[shared/interfaces/messageCommand.ts:17](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/shared/interfaces/messageCommand.ts#L17)

___

### permissions

• **permissions**: `string`[]

An array of individual permission strings required to run this command.

**`Memberof`**

MessageCommand

#### Defined in

[shared/interfaces/messageCommand.ts:33](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/shared/interfaces/messageCommand.ts#L33)
