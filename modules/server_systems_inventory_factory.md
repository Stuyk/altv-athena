---
title: Athena.systems.inventory.factory
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### fromBaseToStored

::: tip Usage
Athena.systems.inventory.factory.**fromBaseToStored**<`CustomData`\>(`baseItem`, `quantity`): `any`
:::

Converts a base item into a stored item for reference.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseItem` | `BaseItem`<`DefaultItemBehavior`, `CustomData`\> |
| `quantity` | `number` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:391](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L391)

___

### fromBaseToStoredAsync

::: tip Usage
Athena.systems.inventory.factory.**fromBaseToStoredAsync**<`CustomData`\>(`baseItem`, `quantity`): `Promise`<[`player`](server_config.md#player)<`CustomData`\>\>
:::

Converts a base item to a stored item asynchronously.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseItem` | `BaseItem`<`DefaultItemBehavior`, `CustomData`\> |
| `quantity` | `number` |

#### Returns

`Promise`<[`player`](server_config.md#player)<`CustomData`\>\>

#### Defined in

[server/systems/inventory/factory.ts:243](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L243)

___

### fromStoredItem

::: tip Usage
Athena.systems.inventory.factory.**fromStoredItem**<`CustomData`, `CustomBehavior`\>(`item`): [`player`](server_config.md#player)<`CustomBehavior` & [`player`](server_config.md#player), `CustomData`\> \| `undefined`
:::

Converts an item from a player inventory, or toolbar to a full item set.

Also performs weight calculations.

Use when usage is not at server-start.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |
| `CustomBehavior` | `DefaultItemBehavior` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `StoredItem`<`CustomData`\> |

#### Returns

[`player`](server_config.md#player)<`CustomBehavior` & [`player`](server_config.md#player), `CustomData`\> \| `undefined`

#### Defined in

[server/systems/inventory/factory.ts:327](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L327)

___

### fromStoredItemAsync

::: tip Usage
Athena.systems.inventory.factory.**fromStoredItemAsync**<`CustomData`, `CustomBehavior`\>(`item`): `Promise`<[`player`](server_config.md#player)<`CustomBehavior` & [`player`](server_config.md#player), `CustomData`\> \| `undefined`\>
:::

Converts an item from a player inventory, equipment, or toolbar to a full item set.

Also performs weight calculations.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |
| `CustomBehavior` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `StoredItem`<`CustomData`\> |

#### Returns

`Promise`<[`player`](server_config.md#player)<`CustomBehavior` & [`player`](server_config.md#player), `CustomData`\> \| `undefined`\>

#### Defined in

[server/systems/inventory/factory.ts:175](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L175)

___

### getBaseItem

::: tip Usage
Athena.systems.inventory.factory.**getBaseItem**<`CustomData`, `CustomBehavior`\>(`dbName`, `version?`): [`player`](server_config.md#player)<[`player`](server_config.md#player) & `CustomBehavior`, `CustomData`\>
:::

Get a base item based on dbName, and version if supplied.

Does not wait for database of items to load first.

Use when usage is not at server-start.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |
| `CustomBehavior` | {} |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dbName` | `string` | `undefined` |
| `version?` | `number` | `undefined` |

#### Returns

[`player`](server_config.md#player)<[`player`](server_config.md#player) & `CustomBehavior`, `CustomData`\>

#### Defined in

[server/systems/inventory/factory.ts:284](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L284)

___

### getBaseItemAsync

::: tip Usage
Athena.systems.inventory.factory.**getBaseItemAsync**<`CustomData`, `CustomBehavior`\>(`dbName`, `version?`): `Promise`<[`player`](server_config.md#player)<[`player`](server_config.md#player) & `CustomBehavior`, `CustomData`\>\>
:::

Get a base item based on dbName, and version if supplied.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |
| `CustomBehavior` | {} |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dbName` | `string` | `undefined` |
| `version?` | `number` | `undefined` |

#### Returns

`Promise`<[`player`](server_config.md#player)<[`player`](server_config.md#player) & `CustomBehavior`, `CustomData`\>\>

#### Defined in

[server/systems/inventory/factory.ts:51](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L51)

___

### getBaseItems

::: tip Usage
Athena.systems.inventory.factory.**getBaseItems**(): [`player`](server_config.md#player)[]
:::

Does not wait for items to load, returns what base items are in the array.

Use this only during runtime; and not during startup.

**`Export`**

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[server/systems/inventory/factory.ts:440](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L440)

___

### getBaseItemsAsync

::: tip Usage
Athena.systems.inventory.factory.**getBaseItemsAsync**(): `Promise`<[`player`](server_config.md#player)[]\>
:::

Waits for the database items to finish loading before returning data.

**`Export`**

#### Returns

`Promise`<[`player`](server_config.md#player)[]\>

#### Defined in

[server/systems/inventory/factory.ts:423](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L423)

___

### isDoneLoadingAsync

::: tip Usage
Athena.systems.inventory.factory.**isDoneLoadingAsync**(): `Promise`<`void`\>
:::

Wait until the `isDoneLoading` variable is set to `true` before continuing.

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/inventory/factory.ts:29](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L29)

___

### override

::: tip Usage
Athena.systems.inventory.factory.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item factory functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getBaseItemAsync"`` |
| `callback` | <CustomData, CustomBehavior\>(`dbName`: `string`, `version?`: `number`) => `Promise`<[`player`](server_config.md#player)<[`player`](server_config.md#player) & `CustomBehavior`, `CustomData`\>\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:463](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L463)

::: tip Usage
Athena.systems.inventory.factory.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item factory functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"upsertAsync"`` |
| `callback` | (`baseItem`: `BaseItem`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:464](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L464)

::: tip Usage
Athena.systems.inventory.factory.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item factory functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"fromStoredItemAsync"`` |
| `callback` | <CustomData, CustomBehavior\>(`item`: `StoredItem`<`CustomData`\>) => `Promise`<[`player`](server_config.md#player)<`CustomBehavior` & [`player`](server_config.md#player), `CustomData`\> \| `undefined`\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:465](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L465)

::: tip Usage
Athena.systems.inventory.factory.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item factory functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"fromBaseToStoredAsync"`` |
| `callback` | <CustomData\>(`baseItem`: `BaseItem`<`DefaultItemBehavior`, `CustomData`\>, `quantity`: `number`) => `Promise`<[`player`](server_config.md#player)<`CustomData`\>\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:466](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L466)

::: tip Usage
Athena.systems.inventory.factory.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item factory functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getBaseItem"`` |
| `callback` | <CustomData, CustomBehavior\>(`dbName`: `string`, `version?`: `number`) => [`player`](server_config.md#player)<[`player`](server_config.md#player) & `CustomBehavior`, `CustomData`\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:467](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L467)

::: tip Usage
Athena.systems.inventory.factory.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item factory functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"fromStoredItem"`` |
| `callback` | <CustomData, CustomBehavior\>(`item`: `StoredItem`<`CustomData`\>) => [`player`](server_config.md#player)<`CustomBehavior` & [`player`](server_config.md#player), `CustomData`\> \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:468](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L468)

::: tip Usage
Athena.systems.inventory.factory.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item factory functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toStoredItem"`` |
| `callback` | <CustomData\>(`item`: `Item`<`DefaultItemBehavior`, `CustomData`\>) => [`player`](server_config.md#player)<`CustomData`\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:469](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L469)

::: tip Usage
Athena.systems.inventory.factory.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item factory functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"fromBaseToStored"`` |
| `callback` | <CustomData\>(`baseItem`: `BaseItem`<`DefaultItemBehavior`, `CustomData`\>, `quantity`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:470](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L470)

::: tip Usage
Athena.systems.inventory.factory.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item factory functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getBaseItems"`` |
| `callback` | () => [`player`](server_config.md#player)[] |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:471](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L471)

::: tip Usage
Athena.systems.inventory.factory.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item factory functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getBaseItemsAsync"`` |
| `callback` | () => `Promise`<[`player`](server_config.md#player)[]\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:472](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L472)

___

### toStoredItem

::: tip Usage
Athena.systems.inventory.factory.**toStoredItem**<`CustomData`\>(`item`): [`player`](server_config.md#player)<`CustomData`\>
:::

Converts a full item, into a storeable version of the item.

Only certain parts of the item will be stored.

Use when usage is not at server-start.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `Item`<`DefaultItemBehavior`, `CustomData`\> |

#### Returns

[`player`](server_config.md#player)<`CustomData`\>

#### Defined in

[server/systems/inventory/factory.ts:359](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L359)

___

### toStoredItemAsync

::: tip Usage
Athena.systems.inventory.factory.**toStoredItemAsync**<`CustomData`\>(`item`): `Promise`<[`player`](server_config.md#player)<`CustomData`\>\>
:::

Converts a full item, into a storeable version of the item.

Only certain parts of the item will be stored.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `Item`<`DefaultItemBehavior`, `CustomData`\> |

#### Returns

`Promise`<[`player`](server_config.md#player)<`CustomData`\>\>

#### Defined in

[server/systems/inventory/factory.ts:207](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L207)

___

### upsertAsync

::: tip Usage
Athena.systems.inventory.factory.**upsertAsync**(`baseItem`): `any`
:::

Updates or inserts a new database item into the database.

If a verison is specified and it does not find a matching version it will add a new item.

If a version is not specified; it will find a non-versioned item to replace.

#### Example
```ts
Athena.systems.inventory.factory.upsertAsync({
    dbName: 'burger',
    data: { health: 5 },
    icon: 'burger',
    name: 'Burger',
    maxStack: 8,
    weight: 25,
    behavior: {
        canDrop: true,
        canStack: true,
        canTrade: true,
        destroyOnDrop: false,
        isToolbar: true
    },
    consumableEventToCall: 'edible',
    customEventsToCall: [
         {
             name: 'Desconstruct',
             eventToCall: 'deconstruct-item-ingredients'
         }
   ]
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseItem` | `BaseItem` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/factory.ts:119](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/server/systems/inventory/factory.ts#L119)
