---
title: Athena.systems.storage
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [StorageInstance](../interfaces/server_systems_storage_StorageInstance.md)

## Functions

### closeOnDisconnect

::: tip Usage
Athena.systems.storage.**closeOnDisconnect**(`player`, `id`): `boolean`
:::

Marks the storage instance as closed if the player disconnects.

Automatically removes the player when `removeAsOpen` is called.

Returns false if a player binding is already present.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `id` | `string` |  |

#### Returns

`boolean`

#### Defined in

[server/systems/storage.ts:178](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L178)

___

### create

::: tip Usage
Athena.systems.storage.**create**(`items`): `Promise`<`string`\>
:::

Creates a new storage, and returns the '_id' of the storage from the database.

Use the ID returned to fetch the data with the other storage functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | `StoredItem`[] |

#### Returns

`Promise`<`string`\>

#### Defined in

[server/systems/storage.ts:42](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L42)

___

### get

::: tip Usage
Athena.systems.storage.**get**<`CustomData`\>(`id`): `Promise`<[`player`](server_config.md#player)<`CustomData`\>[]\>
:::

Fetches stored items from a storage array.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<[`player`](server_config.md#player)<`CustomData`\>[]\>

#### Defined in

[server/systems/storage.ts:80](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L80)

___

### isOpen

::: tip Usage
Athena.systems.storage.**isOpen**(`id`): `boolean`
:::

Checks if a storage identifier is currently in use.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`boolean`

#### Defined in

[server/systems/storage.ts:124](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L124)

___

### override

::: tip Usage
Athena.systems.storage.**override**(`functionName`, `callback`): `any`
:::

Used to override storage functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"create"`` |
| `callback` | (`items`: `StoredItem`[]) => `Promise`<`string`\> |

#### Returns

`any`

#### Defined in

[server/systems/storage.ts:215](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L215)

::: tip Usage
Athena.systems.storage.**override**(`functionName`, `callback`): `any`
:::

Used to override storage functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"set"`` |
| `callback` | (`id`: `string`, `items`: `StoredItem`[]) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/systems/storage.ts:216](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L216)

::: tip Usage
Athena.systems.storage.**override**(`functionName`, `callback`): `any`
:::

Used to override storage functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | <CustomData\>(`id`: `string`) => `Promise`<[`player`](server_config.md#player)<`CustomData`\>[]\> |

#### Returns

`any`

#### Defined in

[server/systems/storage.ts:217](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L217)

::: tip Usage
Athena.systems.storage.**override**(`functionName`, `callback`): `any`
:::

Used to override storage functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setAsOpen"`` |
| `callback` | (`id`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/storage.ts:218](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L218)

::: tip Usage
Athena.systems.storage.**override**(`functionName`, `callback`): `any`
:::

Used to override storage functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isOpen"`` |
| `callback` | (`id`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/storage.ts:219](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L219)

::: tip Usage
Athena.systems.storage.**override**(`functionName`, `callback`): `any`
:::

Used to override storage functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeAsOpen"`` |
| `callback` | (`id`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/storage.ts:220](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L220)

::: tip Usage
Athena.systems.storage.**override**(`functionName`, `callback`): `any`
:::

Used to override storage functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"closeOnDisconnect"`` |
| `callback` | (`player`: `Player`, `id`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/storage.ts:221](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L221)

___

### removeAsOpen

::: tip Usage
Athena.systems.storage.**removeAsOpen**(`id`): `boolean`
:::

Removes the storage identifier from in-use status.

Returns true if the value was successfully removed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`boolean`

#### Defined in

[server/systems/storage.ts:141](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L141)

___

### set

::: tip Usage
Athena.systems.storage.**set**(`id`, `items`): `Promise`<`boolean`\>
:::

Stores items into a database instance by providing the storage identifier, and the modified items array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `items` | `StoredItem`[] |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/storage.ts:64](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L64)

___

### setAsOpen

::: tip Usage
Athena.systems.storage.**setAsOpen**(`id`): `boolean`
:::

Sets a storage identifier as in use.

Returns true if the value was set to in-use, and didn't already exist.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`boolean`

#### Defined in

[server/systems/storage.ts:103](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/systems/storage.ts#L103)
