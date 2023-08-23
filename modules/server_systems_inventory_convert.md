---
title: Athena.systems.inventory.convert
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### toBaseItem

::: tip Usage
Athena.systems.inventory.convert.**toBaseItem**<`CustomData`\>(`storedItem`): [`player`](server_config.md#player)<`CustomData`\>
:::

Convert a stored Item to a base item

Does not perform any inventory changes.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `storedItem` | `StoredItemEx`<`CustomData`\> |

#### Returns

[`player`](server_config.md#player)<`CustomData`\>

#### Defined in

[server/systems/inventory/convert.ts:35](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/systems/inventory/convert.ts#L35)

___

### toItem

::: tip Usage
Athena.systems.inventory.convert.**toItem**<`CustomData`\>(`storedItem`): [`player`](server_config.md#player)<`CustomData`\> \| `undefined`
:::

Converts a stored item into a full item.

Does not perform any inventory changes.

Returns undefined if base item was not found.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `storedItem` | `StoredItemEx`<`CustomData`\> |

#### Returns

[`player`](server_config.md#player)<`CustomData`\> \| `undefined`

#### Defined in

[server/systems/inventory/convert.ts:15](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/systems/inventory/convert.ts#L15)

___

### toStoredItem

::: tip Usage
Athena.systems.inventory.convert.**toStoredItem**<`CustomData`\>(`baseItem`, `quantity`): `any`
:::

Convert a Base Item to a stored item

Does not perform any inventory changes.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseItem` | `BaseItemEx`<`CustomData`\> |
| `quantity` | `number` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/convert.ts:50](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/systems/inventory/convert.ts#L50)
