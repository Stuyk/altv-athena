---
title: AthenaShared.interfaces.messageCommand.DetailedCommand
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/messageCommand](../modules/shared_interfaces_messageCommand.md).DetailedCommand

Construct a type with the properties of T except for those in type K.

## Hierarchy

- [`Omit`](../modules/server_player_inventory_Internal.md#Omit)<[`MessageCommand`](shared_interfaces_messageCommand_MessageCommand.md)<``null``\>, ``"callback"``\>

  ↳ **`DetailedCommand`**

## Properties

### description

• **description**: `string`

A description of this command.

#### Inherited from

Omit.description

#### Defined in

[shared/interfaces/messageCommand.ts:25](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/shared/interfaces/messageCommand.ts#L25)

___

### isCharacterPermission

• `Optional` **isCharacterPermission**: `boolean`

Should this command use character permissions instead of account?

#### Inherited from

Omit.isCharacterPermission

#### Defined in

[shared/interfaces/messageCommand.ts:41](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/shared/interfaces/messageCommand.ts#L41)

___

### name

• **name**: `string`

The plain text iteration of this command.

#### Inherited from

Omit.name

#### Defined in

[shared/interfaces/messageCommand.ts:17](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/shared/interfaces/messageCommand.ts#L17)

___

### params

• **params**: `string`[]

An array of parameters that belong to this command

#### Defined in

[shared/interfaces/messageCommand.ts:58](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/shared/interfaces/messageCommand.ts#L58)

___

### permissions

• **permissions**: `string`[]

An array of individual permission strings required to run this command.

#### Inherited from

Omit.permissions

#### Defined in

[shared/interfaces/messageCommand.ts:33](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/shared/interfaces/messageCommand.ts#L33)
