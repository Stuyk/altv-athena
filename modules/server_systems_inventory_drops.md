---
title: Athena.systems.inventory.drops
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### add

::: tip Usage
Athena.systems.inventory.drops.**add**(`item`, `pos`, `player?`): `Promise`<`string`\>
:::

Add a dropped item.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `item` | `StoredItem` | `undefined` |  |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `player` | `Player` | `undefined` | - |

#### Returns

`Promise`<`string`\>

#### Defined in

[server/systems/inventory/drops.ts:62](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/systems/inventory/drops.ts#L62)

___

### get

::: tip Usage
Athena.systems.inventory.drops.**get**(`id`): [`player`](server_config.md#player) \| `undefined`
:::

Get the current item drop.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

[`player`](server_config.md#player) \| `undefined`

#### Defined in

[server/systems/inventory/drops.ts:105](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/systems/inventory/drops.ts#L105)

___

### isItemAvailable

::: tip Usage
Athena.systems.inventory.drops.**isItemAvailable**(`_id`): `any`
:::

Check if an item is available by database id

#### Parameters

| Name | Type |
| :------ | :------ |
| `_id` | `string` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/drops.ts:159](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/systems/inventory/drops.ts#L159)

___

### markForTaken

::: tip Usage
Athena.systems.inventory.drops.**markForTaken**(`_id`, `value`): `void`
:::

Mark an item as being taken

#### Parameters

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[server/systems/inventory/drops.ts:174](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/systems/inventory/drops.ts#L174)

___

### override

::: tip Usage
Athena.systems.inventory.drops.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory drop item functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"add"`` |
| `callback` | (`item`: `StoredItem`, `pos`: `IVector3`, `player`: `Player`) => `Promise`<`string`\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/drops.ts:188](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/systems/inventory/drops.ts#L188)

::: tip Usage
Athena.systems.inventory.drops.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory drop item functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | (`id`: `string`) => [`player`](server_config.md#player) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/drops.ts:189](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/systems/inventory/drops.ts#L189)

::: tip Usage
Athena.systems.inventory.drops.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory drop item functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"sub"`` |
| `callback` | (`id`: `string`) => `Promise`<[`player`](server_config.md#player) \| `undefined`\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/drops.ts:190](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/systems/inventory/drops.ts#L190)

::: tip Usage
Athena.systems.inventory.drops.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory drop item functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isItemAvailable"`` |
| `callback` | (`_id`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/drops.ts:191](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/systems/inventory/drops.ts#L191)

::: tip Usage
Athena.systems.inventory.drops.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory drop item functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"markForTaken"`` |
| `callback` | (`_id`: `string`, `value`: `boolean`) => `void` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/drops.ts:192](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/systems/inventory/drops.ts#L192)

___

### sub

::: tip Usage
Athena.systems.inventory.drops.**sub**(`id`): `Promise`<[`player`](server_config.md#player) \| `undefined`\>
:::

Remove the dropped item based on identifier.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<[`player`](server_config.md#player) \| `undefined`\>

#### Defined in

[server/systems/inventory/drops.ts:118](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/systems/inventory/drops.ts#L118)
