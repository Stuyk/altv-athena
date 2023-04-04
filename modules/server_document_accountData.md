---
title: Athena.document.accountData
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### KeyChangeCallback

Ƭ **KeyChangeCallback**: (`player`: `alt.Player`, `newValue`: `any`, `oldValue`: `any`) => `void`

#### Type declaration

::: tip Usage
Athena.document.accountData.(`player`, `newValue`, `oldValue`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `alt.Player` |
| `newValue` | `any` |
| `oldValue` | `any` |

##### Returns

`void`

#### Defined in

[server/document/accountData.ts:10](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L10)

## Functions

### bind

::: tip Usage
Athena.document.accountData.**bind**(`player`, `document`): `any`
:::

Binds a player identifier to a Account document.
This document is cleared on disconnected automatically.
This should be the first thing you do after having a user authenticate.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `document` | `Account` |  |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:40](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L40)

___

### get

::: tip Usage
Athena.document.accountData.**get**<`T`\>(`player`): `T` \| `undefined`
:::

Return current player data and their associated account object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `Account` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`T` \| `undefined`

#### Defined in

[server/document/accountData.ts:81](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L81)

___

### getField

::: tip Usage
Athena.document.accountData.**getField**<`T`, `ReturnType`\>(`player`, `fieldName`): `ReturnType` \| `undefined`
:::

Get the current value of a specific field inside of the player data object.
Can be extended to obtain any value easily.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |
| `ReturnType` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `fieldName` | `string` \| `number` \| `symbol` |  |

#### Returns

`ReturnType` \| `undefined`

#### Defined in

[server/document/accountData.ts:98](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L98)

___

### onChange

::: tip Usage
Athena.document.accountData.**onChange**<`T`\>(`fieldName`, `callback`): `any`
:::

Listen for individual player document changes.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldName` | `string` \| `number` \| `symbol` |
| `callback` | [`KeyChangeCallback`](server_document_accountData.md#KeyChangeCallback) |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:214](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L214)

___

### override

::: tip Usage
Athena.document.accountData.**override**(`functionName`, `callback`): `any`
:::

Used to override any account data document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"bind"`` |
| `callback` | (`player`: `Player`, `document`: `Account`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:248](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L248)

::: tip Usage
Athena.document.accountData.**override**(`functionName`, `callback`): `any`
:::

Used to override any account data document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"unbind"`` |
| `callback` | (`id`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:249](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L249)

::: tip Usage
Athena.document.accountData.**override**(`functionName`, `callback`): `any`
:::

Used to override any account data document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | <T\>(`player`: `Player`) => `T` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:250](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L250)

::: tip Usage
Athena.document.accountData.**override**(`functionName`, `callback`): `any`
:::

Used to override any account data document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getField"`` |
| `callback` | <T, ReturnType\>(`player`: `Player`, `fieldName`: `string` \| `number` \| `symbol`) => `ReturnType` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:251](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L251)

::: tip Usage
Athena.document.accountData.**override**(`functionName`, `callback`): `any`
:::

Used to override any account data document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"set"`` |
| `callback` | <T, Keys\>(`player`: `Player`, `fieldName`: `Keys`, `value`: `any`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:252](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L252)

::: tip Usage
Athena.document.accountData.**override**(`functionName`, `callback`): `any`
:::

Used to override any account data document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setBulk"`` |
| `callback` | <T, Keys\>(`player`: `Player`, `fields`: `Keys`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:253](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L253)

::: tip Usage
Athena.document.accountData.**override**(`functionName`, `callback`): `any`
:::

Used to override any account data document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"onChange"`` |
| `callback` | <T\>(`fieldName`: `string` \| `number` \| `symbol`, `callback`: [`KeyChangeCallback`](server_document_accountData.md#KeyChangeCallback)) => `any` |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:254](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L254)

___

### set

::: tip Usage
Athena.document.accountData.**set**<`T`, `Keys`\>(`player`, `fieldName`, `value`): `any`
:::

Sets a player document value, and saves it automatically to the selected account database.
Automatically calls all callbacks associated with the field name.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |
| `Keys` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `fieldName` | `Keys` |  |
| `value` | `any` |  |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:123](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L123)

___

### setBulk

::: tip Usage
Athena.document.accountData.**setBulk**<`T`, `Keys`\>(`player`, `fields`): `any`
:::

Sets player document values, and saves it automatically to the selected Account's database.
Automatically calls all callbacks associated with the field name.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |
| `Keys` | [`Partial`](server_controllers_textlabel_Internal.md#Partial)<`any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `fields` | `Keys` |  |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:177](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L177)

___

### unbind

::: tip Usage
Athena.document.accountData.**unbind**(`id`): `any`
:::

Unbind stored player character cache data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`any`

#### Defined in

[server/document/accountData.ts:66](https://github.com/Stuyk/altv-athena/blob/1862056/src/core/server/document/accountData.ts#L66)
