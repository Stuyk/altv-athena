---
title: AthenaShared.interfaces.iAccount.Account
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/iAccount](../modules/shared_interfaces_iAccount.md).Account

Used to store Discord Information, IPs, and User Data

**`Interface`**

Account

## Properties

### \_id

• **\_id**: `any`

A unique MongoDB identifier to identify the accoutn in the database.

#### Defined in

[shared/interfaces/iAccount.ts:12](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/shared/interfaces/iAccount.ts#L12)

___

### banned

• **banned**: `boolean`

Is this user banned?

#### Defined in

[shared/interfaces/iAccount.ts:69](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/shared/interfaces/iAccount.ts#L69)

___

### discord

• `Optional` **discord**: `string`

Discord user ID. The one you get from developer mode.

#### Defined in

[shared/interfaces/iAccount.ts:26](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/shared/interfaces/iAccount.ts#L26)

___

### email

• `Optional` **email**: `string`

Email bound to the discord account.

#### Defined in

[shared/interfaces/iAccount.ts:33](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/shared/interfaces/iAccount.ts#L33)

___

### hardware

• **hardware**: `string`[]

Hardware Identifiers associated with an account.

#### Defined in

[shared/interfaces/iAccount.ts:47](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/shared/interfaces/iAccount.ts#L47)

___

### id

• `Optional` **id**: `number`

A incremented ID for individual accounts.

#### Defined in

[shared/interfaces/iAccount.ts:19](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/shared/interfaces/iAccount.ts#L19)

___

### ips

• **ips**: `string`[]

Last 5 IPs that have logged into an account.

#### Defined in

[shared/interfaces/iAccount.ts:40](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/shared/interfaces/iAccount.ts#L40)

___

### lastLogin

• **lastLogin**: `number`

Time in milliseconds when they last logged in since epoch.

#### Defined in

[shared/interfaces/iAccount.ts:54](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/shared/interfaces/iAccount.ts#L54)

___

### permissions

• **permissions**: `string`[]

A list of permissions assigned to this account.

#### Defined in

[shared/interfaces/iAccount.ts:62](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/shared/interfaces/iAccount.ts#L62)

___

### reason

• **reason**: `string`

Why are they banned?

#### Defined in

[shared/interfaces/iAccount.ts:76](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/shared/interfaces/iAccount.ts#L76)
