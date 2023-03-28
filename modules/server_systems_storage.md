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

[server/systems/storage.ts:154](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/storage.ts#L154)

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

[server/systems/storage.ts:42](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/storage.ts#L42)

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

[server/systems/storage.ts:72](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/storage.ts#L72)

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

[server/systems/storage.ts:108](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/storage.ts#L108)

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

[server/systems/storage.ts:121](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/storage.ts#L121)

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

[server/systems/storage.ts:60](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/storage.ts#L60)

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

[server/systems/storage.ts:91](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/storage.ts#L91)
