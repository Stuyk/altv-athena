---
title: Athena.systems.inventory.slot
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### findOpen

::: tip Usage
Athena.systems.inventory.slot.**findOpen**(`slotSize`, `data`): `number` \| `undefined`
:::

Find an open slot that is available within a dataset.

#### Parameters

| Name | Type |
| :------ | :------ |
| `slotSize` | `any` |
| `data` | `StoredItem`[] |

#### Returns

`number` \| `undefined`

#### Defined in

[server/systems/inventory/slot.ts:14](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/systems/inventory/slot.ts#L14)

___

### getAt

::: tip Usage
Athena.systems.inventory.slot.**getAt**<`CustomData`\>(`slot`, `data`): [`player`](server_config.md#player)<`CustomData`\> \| `undefined`
:::

Get an item at a specific slot.
Returns undefined if an item is unavailable in a slot.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `slot` | `number` |
| `data` | `StoredItem`[] |

#### Returns

[`player`](server_config.md#player)<`CustomData`\> \| `undefined`

#### Defined in

[server/systems/inventory/slot.ts:47](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/systems/inventory/slot.ts#L47)

___

### override

::: tip Usage
Athena.systems.inventory.slot.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item slot functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"findOpen"`` |
| `callback` | (`slotSize`: `any`, `data`: `StoredItem`[]) => `number` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/slot.ts:90](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/systems/inventory/slot.ts#L90)

::: tip Usage
Athena.systems.inventory.slot.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item slot functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeAt"`` |
| `callback` | (`slot`: `number`, `data`: `StoredItem`[]) => [`player`](server_config.md#player)[] \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/slot.ts:91](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/systems/inventory/slot.ts#L91)

::: tip Usage
Athena.systems.inventory.slot.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item slot functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getAt"`` |
| `callback` | <CustomData\>(`slot`: `number`, `data`: `StoredItem`[]) => [`player`](server_config.md#player)<`CustomData`\> \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/slot.ts:92](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/systems/inventory/slot.ts#L92)

___

### removeAt

::: tip Usage
Athena.systems.inventory.slot.**removeAt**(`slot`, `data`): [`player`](server_config.md#player)[] \| `undefined`
:::

Remove a specific item from a specific slot.

#### Parameters

| Name | Type |
| :------ | :------ |
| `slot` | `number` |
| `data` | `StoredItem`[] |

#### Returns

[`player`](server_config.md#player)[] \| `undefined`

Returns undefined if the item was not found.

#### Defined in

[server/systems/inventory/slot.ts:67](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/systems/inventory/slot.ts#L67)
