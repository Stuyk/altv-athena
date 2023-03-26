---
title: Athena.player.currency
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### DefaultCurrency

Ƭ **DefaultCurrency**: ``"bank"`` \| ``"cash"``

#### Defined in

[server/player/currency.ts:5](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/player/currency.ts#L5)

## Functions

### add

▸ **add**<`CustomCurrency`\>(`player`, `type`, `amount`): `boolean`

Add currency type to the player.

**`Example`**

```ts
const didAddFullAmount = Athena.player.currency.add(somePlayer, 'cash', 25);
```

**`Memberof`**

Currency

#### Type parameters

| Name |
| :------ |
| `CustomCurrency` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `type` | `CustomCurrency` \| [`DefaultCurrency`](server_player_currency.md#DefaultCurrency) |
| `amount` | `number` |

#### Returns

`boolean`

#### Defined in

[server/player/currency.ts:20](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/player/currency.ts#L20)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal currency functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"add"`` |
| `callback` | <CustomCurrency\>(`player`: `Player`, `type`: `CustomCurrency` \| [`DefaultCurrency`](server_player_currency.md#DefaultCurrency), `amount`: `number`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/player/currency.ts:202](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/player/currency.ts#L202)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal currency functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"set"`` |
| `callback` | <CustomCurrency\>(`player`: `Player`, `type`: [`DefaultCurrency`](server_player_currency.md#DefaultCurrency) \| `CustomCurrency`, `amount`: `number`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/player/currency.ts:203](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/player/currency.ts#L203)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal currency functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"sub"`` |
| `callback` | <CustomCurrency\>(`player`: `Player`, `type`: [`DefaultCurrency`](server_player_currency.md#DefaultCurrency) \| `CustomCurrency`, `amount`: `number`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/player/currency.ts:204](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/player/currency.ts#L204)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal currency functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"subAllCurrencies"`` |
| `callback` | (`player`: `Player`, `amount`: `number`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/player/currency.ts:205](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/player/currency.ts#L205)

___

### set

▸ **set**<`CustomCurrency`\>(`player`, `type`, `amount`): `boolean`

Replace the current currency type value with this exact value.

**`Example`**

```ts
const didSetFullAmount = Athena.player.currency.set(somePlayer, 'bank', 25);
```

**`Memberof`**

CurrencyPrototype

#### Type parameters

| Name |
| :------ |
| `CustomCurrency` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | - |
| `type` | [`DefaultCurrency`](server_player_currency.md#DefaultCurrency) \| `CustomCurrency` | Type of currency we are modifying. |
| `amount` | `number` | The amount we want to set that type to. |

#### Returns

`boolean`

#### Defined in

[server/player/currency.ts:117](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/player/currency.ts#L117)

___

### sub

▸ **sub**<`CustomCurrency`\>(`player`, `type`, `amount`): `boolean`

Remove currency type from the player.

**`Example`**

```ts
const didSubFullAmount = Athena.player.currency.sub(somePlayer, 'cash', 25);
```

#### Type parameters

| Name |
| :------ |
| `CustomCurrency` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `type` | [`DefaultCurrency`](server_player_currency.md#DefaultCurrency) \| `CustomCurrency` |
| `amount` | `number` |

#### Returns

`boolean`

#### Defined in

[server/player/currency.ts:68](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/player/currency.ts#L68)

___

### subAllCurrencies

▸ **subAllCurrencies**(`player`, `amount`): `boolean`

Only subtracts 'bank' and 'cash' currency types.
Always takes from cash first.

**`Example`**

```ts
const didRemoveFullAmount = Athena.player.currency.subAllCurrencies(somePlayer, 25);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `amount` | `number` |  |

#### Returns

`boolean`

#### Defined in

[server/player/currency.ts:153](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/player/currency.ts#L153)
