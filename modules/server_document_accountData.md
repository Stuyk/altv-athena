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

[server/document/accountData.ts:8](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L8)

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

[server/document/accountData.ts:22](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L22)

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

[server/document/accountData.ts:59](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L59)

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

[server/document/accountData.ts:76](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L76)

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

[server/document/accountData.ts:182](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L182)

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

[server/document/accountData.ts:216](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L216)

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

[server/document/accountData.ts:217](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L217)

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

[server/document/accountData.ts:218](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L218)

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

[server/document/accountData.ts:219](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L219)

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

[server/document/accountData.ts:220](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L220)

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

[server/document/accountData.ts:221](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L221)

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

[server/document/accountData.ts:222](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L222)

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

[server/document/accountData.ts:101](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L101)

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

[server/document/accountData.ts:150](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L150)

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

[server/document/accountData.ts:44](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/document/accountData.ts#L44)
