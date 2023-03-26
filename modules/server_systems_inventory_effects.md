---
title: Athena.systems.inventory.effects
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### EffectCallback

Ƭ **EffectCallback**: (`player`: `alt.Player`, `slot`: `number`, `type`: ``"inventory"`` \| ``"toolbar"``) => `void`

#### Type declaration

::: tip Usage
Athena.systems.inventory.effects.(`player`, `slot`, `type`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `alt.Player` |
| `slot` | `number` |
| `type` | ``"inventory"`` \| ``"toolbar"`` |

##### Returns

`void`

#### Defined in

[server/systems/inventory/effects.ts:5](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/systems/inventory/effects.ts#L5)

___

### InventoryType

Ƭ **InventoryType**: ``"inventory"`` \| ``"toolbar"``

#### Defined in

[server/systems/inventory/effects.ts:4](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/systems/inventory/effects.ts#L4)

## Functions

### add

::: tip Usage
Athena.systems.inventory.effects.**add**(`effectNameFromItem`, `callback`): `any`
:::

Register an item effect to invoke a callback on consumption.

**`Static`**

**`Memberof`**

ItemEffects

#### Parameters

| Name | Type |
| :------ | :------ |
| `effectNameFromItem` | `string` |
| `callback` | [`EffectCallback`](server_systems_inventory_effects.md#EffectCallback) |

#### Returns

`any`

#### Defined in

[server/systems/inventory/effects.ts:17](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/systems/inventory/effects.ts#L17)

___

### invoke

::: tip Usage
Athena.systems.inventory.effects.**invoke**(`player`, `slot`, `type`, `eventToCall?`): `boolean`
:::

Invokes a callback for an item effect

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | The player who is using the item. |
| `slot` | `number` | `undefined` | - |
| `type` | [`InventoryType`](server_systems_inventory_effects.md#InventoryType) | `undefined` | INVENTORY_TYPE |
| `eventToCall` | `string` \| `string`[] | `undefined` | - |

#### Returns

`boolean`

The callback function.

#### Defined in

[server/systems/inventory/effects.ts:51](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/systems/inventory/effects.ts#L51)

___

### override

::: tip Usage
Athena.systems.inventory.effects.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item effects functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"add"`` |
| `callback` | (`effectNameFromItem`: `string`, `callback`: [`EffectCallback`](server_systems_inventory_effects.md#EffectCallback)) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/effects.ts:139](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/systems/inventory/effects.ts#L139)

::: tip Usage
Athena.systems.inventory.effects.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item effects functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`effectName`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/effects.ts:140](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/systems/inventory/effects.ts#L140)

::: tip Usage
Athena.systems.inventory.effects.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item effects functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"invoke"`` |
| `callback` | (`player`: `Player`, `slot`: `number`, `type`: [`InventoryType`](server_systems_inventory_effects.md#InventoryType), `eventToCall`: `string` \| `string`[]) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/effects.ts:141](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/systems/inventory/effects.ts#L141)

___

### remove

::: tip Usage
Athena.systems.inventory.effects.**remove**(`effectName`): `boolean`
:::

Remove an effect from the effects map.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `effectName` | `string` | The name of the effect to remove. |

#### Returns

`boolean`

The value of the effect.

#### Defined in

[server/systems/inventory/effects.ts:35](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/systems/inventory/effects.ts#L35)
