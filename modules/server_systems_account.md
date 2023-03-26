---
title: Athena.systems.account
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### create

▸ **create**(`player`, `dataToAppend`): `Promise`<[`Account`](../interfaces/server_interface_iAccount_Account.md)\>

Create an account with default data.

**`Memberof`**

AccountSystemRef

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `dataToAppend` | `Object` | Any additional data / identifiers to add to an account. |

#### Returns

`Promise`<[`Account`](../interfaces/server_interface_iAccount_Account.md)\>

#### Defined in

[server/systems/account.ts:66](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/account.ts#L66)

___

### getAccount

▸ **getAccount**(`key`, `value`): `Promise`<[`Account`](../interfaces/server_interface_iAccount_Account.md) \| `undefined`\>

Fetch account for a player based on key / value pair.

**`Memberof`**

AccountSystemRef

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `any` |

#### Returns

`Promise`<[`Account`](../interfaces/server_interface_iAccount_Account.md) \| `undefined`\>

#### Defined in

[server/systems/account.ts:36](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/account.ts#L36)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override any account system functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"create"`` |
| `callback` | (`player`: `Player`, `dataToAppend`: { `[key: string]`: `any`;  }) => `Promise`<[`Account`](../interfaces/server_interface_iAccount_Account.md)\> |

#### Returns

`any`

#### Defined in

[server/systems/account.ts:109](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/account.ts#L109)

▸ **override**(`functionName`, `callback`): `any`

Used to override any account system functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getAccount"`` |
| `callback` | (`key`: `string`, `value`: `any`) => `Promise`<[`Account`](../interfaces/server_interface_iAccount_Account.md) \| `undefined`\> |

#### Returns

`any`

#### Defined in

[server/systems/account.ts:110](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/systems/account.ts#L110)
