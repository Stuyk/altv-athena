---
title: Athena.database.connection
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getCollections` | () => `string`[] |
| `getName` | (`config`: [`IConfig`](../interfaces/server_interface_iConfig_IConfig.md)) => `string` |
| `getURL` | (`config`: [`IConfig`](../interfaces/server_interface_iConfig_IConfig.md)) => `string` |
| `throwConnectionError` | () => `void` |

#### Defined in

[server/database/connection.ts:42](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/server/database/connection.ts#L42)

## Functions

### getCollections

::: tip Usage
Athena.database.connection.**getCollections**(): `string`[]
:::

#### Returns

`string`[]

#### Defined in

[server/database/connection.ts:23](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/server/database/connection.ts#L23)

___

### getName

::: tip Usage
Athena.database.connection.**getName**(`config`): `string`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`IConfig`](../interfaces/server_interface_iConfig_IConfig.md) |

#### Returns

`string`

#### Defined in

[server/database/connection.ts:27](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/server/database/connection.ts#L27)

___

### getURL

::: tip Usage
Athena.database.connection.**getURL**(`config`): `string`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`IConfig`](../interfaces/server_interface_iConfig_IConfig.md) |

#### Returns

`string`

#### Defined in

[server/database/connection.ts:15](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/server/database/connection.ts#L15)

___

### throwConnectionError

::: tip Usage
Athena.database.connection.**throwConnectionError**(): `void`
:::

#### Returns

`void`

#### Defined in

[server/database/connection.ts:34](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/server/database/connection.ts#L34)
