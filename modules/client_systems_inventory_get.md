---
title: AthenaClient.systems.inventory.get
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### ItemChangeCallback

Ƭ **ItemChangeCallback**: (`items`: [`player`](server_config.md#player)[]) => `void`

#### Type declaration

::: tip Usage
AthenaClient.systems.inventory.get.(`items`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `items` | [`player`](server_config.md#player)[] |

##### Returns

`void`

#### Defined in

[client/systems/inventory/get.ts:4](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/inventory/get.ts#L4)

___

### WeightChangeCallback

Ƭ **WeightChangeCallback**: (`weight`: `number`) => `void`

#### Type declaration

::: tip Usage
AthenaClient.systems.inventory.get.(`weight`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `weight` | `number` |

##### Returns

`void`

#### Defined in

[client/systems/inventory/get.ts:5](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/inventory/get.ts#L5)

## Functions

### inventory

::: tip Usage
AthenaClient.systems.inventory.get.**inventory**(): [`player`](server_config.md#player)[]
:::

A list of the current items in the inventory.

**`Export`**

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[client/systems/inventory/get.ts:31](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/inventory/get.ts#L31)

___

### onInventoryChange

::: tip Usage
AthenaClient.systems.inventory.get.**onInventoryChange**(`callback`): `void`
:::

Invoke the callback whenever inventory changes.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`ItemChangeCallback`](client_systems_inventory_get.md#ItemChangeCallback) |

#### Returns

`void`

#### Defined in

[client/systems/inventory/get.ts:51](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/inventory/get.ts#L51)

___

### onToolbarChange

::: tip Usage
AthenaClient.systems.inventory.get.**onToolbarChange**(`callback`): `void`
:::

Invoke the callback whenever the toolbar changes.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`ItemChangeCallback`](client_systems_inventory_get.md#ItemChangeCallback) |

#### Returns

`void`

#### Defined in

[client/systems/inventory/get.ts:61](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/inventory/get.ts#L61)

___

### onTotalWeightChange

::: tip Usage
AthenaClient.systems.inventory.get.**onTotalWeightChange**(`callback`): `void`
:::

Invoke the weight change whenever the total weight changes.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`WeightChangeCallback`](client_systems_inventory_get.md#WeightChangeCallback) |

#### Returns

`void`

#### Defined in

[client/systems/inventory/get.ts:71](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/inventory/get.ts#L71)

___

### toolbar

::: tip Usage
AthenaClient.systems.inventory.get.**toolbar**(): [`player`](server_config.md#player)[]
:::

A list of the current items in the toolbar.

**`Export`**

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[client/systems/inventory/get.ts:21](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/inventory/get.ts#L21)

___

### totalWeight

::: tip Usage
AthenaClient.systems.inventory.get.**totalWeight**(): `number`
:::

A list of the current total weight of inventory and toolbar.

**`Export`**

#### Returns

`number`

#### Defined in

[client/systems/inventory/get.ts:41](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/client/systems/inventory/get.ts#L41)
