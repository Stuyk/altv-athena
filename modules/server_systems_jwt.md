---
title: Athena.systems.jwt
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### create

::: tip Usage
Athena.systems.jwt.**create**(`account`): `Promise`<`undefined` \| `string`\>
:::

Creates a JWT token with basic account id inside of it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | [`Account`](../interfaces/shared_interfaces_iAccount_Account.md) |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[server/systems/jwt.ts:60](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/systems/jwt.ts#L60)

___

### fetch

::: tip Usage
Athena.systems.jwt.**fetch**(`player`): `Promise`<`string` \| ``null``\>
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`Promise`<`string` \| ``null``\>

#### Defined in

[server/systems/jwt.ts:103](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/systems/jwt.ts#L103)

___

### override

::: tip Usage
Athena.systems.jwt.**override**(`functionName`, `callback`): `any`
:::

Used to override jwt functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"create"`` |
| `callback` | (`account`: [`Account`](../interfaces/shared_interfaces_iAccount_Account.md)) => `Promise`<`undefined` \| `string`\> |

#### Returns

`any`

#### Defined in

[server/systems/jwt.ts:159](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/systems/jwt.ts#L159)

::: tip Usage
Athena.systems.jwt.**override**(`functionName`, `callback`): `any`
:::

Used to override jwt functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"verify"`` |
| `callback` | (`data`: `string`) => `Promise`<`string` \| `undefined`\> |

#### Returns

`any`

#### Defined in

[server/systems/jwt.ts:160](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/systems/jwt.ts#L160)

::: tip Usage
Athena.systems.jwt.**override**(`functionName`, `callback`): `any`
:::

Used to override jwt functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"fetch"`` |
| `callback` | (`player`: `Player`) => `Promise`<`string` \| ``null``\> |

#### Returns

`any`

#### Defined in

[server/systems/jwt.ts:161](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/systems/jwt.ts#L161)

___

### verify

::: tip Usage
Athena.systems.jwt.**verify**(`data`): `Promise`<`string` \| `undefined`\>
:::

Verifies a compact JWT string is valid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |

#### Returns

`Promise`<`string` \| `undefined`\>

#### Defined in

[server/systems/jwt.ts:85](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/systems/jwt.ts#L85)
