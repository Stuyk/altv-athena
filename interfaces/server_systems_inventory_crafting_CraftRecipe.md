---
title: Athena.systems.inventory.crafting.CraftRecipe
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/systems/inventory/crafting](../modules/server_systems_inventory_crafting.md).CraftRecipe

## Properties

### combo

• **combo**: [`ItemCombo`](../modules/server_systems_inventory_crafting.md#ItemCombo)

Two items that can be combined.

#### Defined in

[server/systems/inventory/crafting.ts:28](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/inventory/crafting.ts#L28)

___

### dataMigration

• `Optional` **dataMigration**: [`ItemCombo`](../modules/server_systems_inventory_crafting.md#ItemCombo)

What items to take the data from.
ORDER MATTERS. What item is specified first will get data appended first.
Second item overwrites matching property names.

#### Defined in

[server/systems/inventory/crafting.ts:83](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/inventory/crafting.ts#L83)

___

### quantities

• **quantities**: [`Quantities`](../modules/server_systems_inventory_crafting.md#Quantities)

The amount required to combine.

#### Defined in

[server/systems/inventory/crafting.ts:36](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/inventory/crafting.ts#L36)

___

### result

• `Optional` **result**: `Object`

The crafting result.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | [`Object`](../modules/server_systems_plugins_Internal.md#Object) \| (`item1`: `StoredItem`, `item2`: `StoredItem`) => [`Object`](../modules/server_systems_plugins_Internal.md#Object) | The custom data to start with on this item. If data migration is specified; the data will be stacked on top of this data object. |
| `dbName` | `string` | Name of the item. |
| `quantity` | `number` | The amount of this item. |
| `version?` | `number` | What version of this item to use. |

#### Defined in

[server/systems/inventory/crafting.ts:44](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/inventory/crafting.ts#L44)

___

### sound

• `Optional` **sound**: `string`

The custom sound associated with this crafting recipe.

#### Defined in

[server/systems/inventory/crafting.ts:91](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/inventory/crafting.ts#L91)

___

### uid

• **uid**: `string`

A unique identifier for this recipe.

#### Defined in

[server/systems/inventory/crafting.ts:20](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/inventory/crafting.ts#L20)
