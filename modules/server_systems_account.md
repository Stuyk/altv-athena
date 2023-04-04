---
title: Athena.systems.account
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### create

::: tip Usage
Athena.systems.account.**create**(`player`, `dataToAppend`): `Promise`<[`Account`](../interfaces/shared_interfaces_iAccount_Account.md)\>
:::

Create an account with default data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `dataToAppend` | `Object` | Any additional data / identifiers to add to an account. |

#### Returns

`Promise`<[`Account`](../interfaces/shared_interfaces_iAccount_Account.md)\>

#### Defined in

[server/systems/account.ts:66](https://github.com/Stuyk/altv-athena/blob/a06179b/src/core/server/systems/account.ts#L66)

___

### getAccount

::: tip Usage
Athena.systems.account.**getAccount**(`key`, `value`): `Promise`<[`Account`](../interfaces/shared_interfaces_iAccount_Account.md) \| `undefined`\>
:::

Fetch account for a player based on key / value pair.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `any` |

#### Returns

`Promise`<[`Account`](../interfaces/shared_interfaces_iAccount_Account.md) \| `undefined`\>

#### Defined in

[server/systems/account.ts:36](https://github.com/Stuyk/altv-athena/blob/a06179b/src/core/server/systems/account.ts#L36)

___

### override

::: tip Usage
Athena.systems.account.**override**(`functionName`, `callback`): `any`
:::

Used to override any account system functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"create"`` |
| `callback` | (`player`: `Player`, `dataToAppend`: { `[key: string]`: `any`;  }) => `Promise`<[`Account`](../interfaces/shared_interfaces_iAccount_Account.md)\> |

#### Returns

`any`

#### Defined in

[server/systems/account.ts:109](https://github.com/Stuyk/altv-athena/blob/a06179b/src/core/server/systems/account.ts#L109)

::: tip Usage
Athena.systems.account.**override**(`functionName`, `callback`): `any`
:::

Used to override any account system functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getAccount"`` |
| `callback` | (`key`: `string`, `value`: `any`) => `Promise`<[`Account`](../interfaces/shared_interfaces_iAccount_Account.md) \| `undefined`\> |

#### Returns

`any`

#### Defined in

[server/systems/account.ts:110](https://github.com/Stuyk/altv-athena/blob/a06179b/src/core/server/systems/account.ts#L110)
