---
title: AthenaShared.locale.locale.LocaleController
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/locale/locale](../modules/shared_locale_locale.md).LocaleController

## Constructors

### constructor

• **new LocaleController**()

## Methods

### get

::: Tip
AthenaShared.locale.locale.LocaleController.`Static` **get**(`key`, `...args`): `string`
:::

Get a locale based on its key value.

**`Static`**

**`Memberof`**

LocaleController

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `...args` | `any`[] |

#### Returns

`string`

#### Defined in

[shared/locale/locale.ts:46](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/shared/locale/locale.ts#L46)

___

### getWebviewLocale

::: Tip
AthenaShared.locale.locale.LocaleController.`Static` **getWebviewLocale**(`key`): [`Object`](../modules/server_systems_inventory_crafting_Internal.md#Object)
:::

Returns an object of strings with labels for WebViews.

**`Static`**

**`Memberof`**

LocaleController

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

[`Object`](../modules/server_systems_inventory_crafting_Internal.md#Object)

#### Defined in

[shared/locale/locale.ts:67](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/shared/locale/locale.ts#L67)

___

### setLanguage

::: Tip
AthenaShared.locale.locale.LocaleController.`Static` **setLanguage**(`iso639?`): `void`
:::

The ISO-639-1 Code to Utilize for Language

**`Static`**

**`Memberof`**

LocaleController

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `iso639?` | `string` | `'en'` |

#### Returns

`void`

#### Defined in

[shared/locale/locale.ts:34](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/shared/locale/locale.ts#L34)
