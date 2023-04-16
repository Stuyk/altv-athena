---
title: Athena.systems.inventory.config
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](server_systems_inventory_config_Internal.md)

## Functions

### disableWeight

::: tip Usage
Athena.systems.inventory.config.**disableWeight**(): `void`
:::

Use this function to disable weight restrictions on inventories.

#### Returns

`void`

#### Defined in

[server/systems/inventory/config.ts:49](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/server/systems/inventory/config.ts#L49)

___

### get

::: tip Usage
Athena.systems.inventory.config.**get**(): typeof [`DEFAULT_CONFIG`](server_systems_inventory_config_Internal.md#DEFAULT_CONFIG)
:::

Returns the current inventory configurations.

#### Returns

typeof [`DEFAULT_CONFIG`](server_systems_inventory_config_Internal.md#DEFAULT_CONFIG)

#### Defined in

[server/systems/inventory/config.ts:42](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/server/systems/inventory/config.ts#L42)

___

### set

::: tip Usage
Athena.systems.inventory.config.**set**(`config`): `void`
:::

Modify the existing inventory configurations.
Values set may not work with interfaces designed for default values above.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `config` | `Object` | `undefined` |
| `config.custom` | `Object` | `undefined` |
| `config.custom.size` | `number` | `256` |
| `config.inventory` | `Object` | `undefined` |
| `config.inventory.size` | `number` | `30` |
| `config.toolbar` | `Object` | `undefined` |
| `config.toolbar.size` | `number` | `4` |
| `config.weight` | `Object` | `undefined` |
| `config.weight.enabled` | `boolean` | `true` |
| `config.weight.player` | `number` | `64` |

#### Returns

`void`

#### Defined in

[server/systems/inventory/config.ts:32](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/server/systems/inventory/config.ts#L32)
