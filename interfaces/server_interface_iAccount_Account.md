---
title: Athena.interface.iAccount.Account
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/interface/iAccount](../modules/server_interface_iAccount.md).Account

Used to store Discord Information, IPs, and User Data

**`Export`**

**`Interface`**

Account

## Properties

### \_id

• **\_id**: `any`

A unique MongoDB identifier to identify the accoutn in the database.

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:14](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L14)

___

### banned

• **banned**: `boolean`

Is this user banned?

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:79](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L79)

___

### discord

• `Optional` **discord**: `string`

Discord user ID. The one you get from developer mode.

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:28](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L28)

___

### email

• `Optional` **email**: `string`

Email bound to the discord account.

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:35](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L35)

___

### hardware

• **hardware**: `string`[]

Hardware Identifiers associated with an account.

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:49](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L49)

___

### id

• `Optional` **id**: `number`

A incremented ID for individual accounts.

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:21](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L21)

___

### ips

• **ips**: `string`[]

Last 5 IPs that have logged into an account.

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:42](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L42)

___

### lastLogin

• **lastLogin**: `number`

Time in milliseconds when they last logged in since epoch.

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:56](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L56)

___

### permissionLevel

• **permissionLevel**: `PERMISSIONS`

What administrative permissions does this account have.
Default: 0

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:64](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L64)

___

### permissions

• **permissions**: `string`[]

A list of permissions assigned to this account.

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:72](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L72)

___

### reason

• **reason**: `string`

Why are they banned?

**`Memberof`**

Account

#### Defined in

[server/interface/iAccount.ts:86](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/interface/iAccount.ts#L86)
