---
title: Athena.player.inventory
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](server_player_inventory_Internal.md)

## Functions

### add

::: tip Usage
Athena.player.inventory.**add**(`player`, `item`): `Promise`<`boolean`\>
:::

Add a new stored item to a user, must specify a quantity of greater than zero.

Automatically checks weight upon new item additions. Exceeding the weight; cancels the add.

Does not look into toolbar.

#### Example
```ts
const didAdd = await Athena.player.inventory.add(somePlayer, { dbName: 'burger', quantity: 1, data: {} })
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `item` | [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`, ``"slot"``\> |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/player/inventory.ts:24](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L24)

___

### getAt

::: tip Usage
Athena.player.inventory.**getAt**<`CustomData`\>(`player`, `slot`): [`player`](server_config.md#player)<`CustomData`\> \| `undefined`
:::

Returns an item from a specific slot.

This item is cloned, and not attached to the inventory.

Never modify the item directly; this is only to get item information.

#### Example
```ts
const someData = Athena.player.inventory.getAt<{ myCustomStuff: string }>(somePlayer, someSlot);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `slot` | `number` |  |

#### Returns

[`player`](server_config.md#player)<`CustomData`\> \| `undefined`

#### Defined in

[server/player/inventory.ts:219](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L219)

___

### getItemData

::: tip Usage
Athena.player.inventory.**getItemData**<`CustomData`\>(`player`, `slot`): `CustomData` \| `undefined`
:::

Returns the custom item data assigned to a specific item.

Will return undefined if the custom data is not available.

Only checks the inventory.

#### Example
```ts
const someData = Athena.player.inventory.getItemData<{ myCustomStuff: string }>(somePlayer, someSlot);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `slot` | `number` |  |

#### Returns

`CustomData` \| `undefined`

#### Defined in

[server/player/inventory.ts:178](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L178)

___

### has

::: tip Usage
Athena.player.inventory.**has**(`player`, `dbName`, `quantity`, `version?`): `any`
:::

Verify that the player has at least 'x' of an item in their inventory

#### Example
```ts
const hasItem = await Athena.player.inventory.has(somePlayer, 'burger', 1);
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `dbName` | `string` | `undefined` | - |
| `quantity` | `number` | `undefined` | - |
| `version` | `any` | `undefined` | - |

#### Returns

`any`

#### Defined in

[server/player/inventory.ts:143](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L143)

___

### modifyItemData

::: tip Usage
Athena.player.inventory.**modifyItemData**<`CustomData`\>(`player`, `slot`, `customData`): `Promise`<`boolean`\>
:::

Find an item at a specific slot, and changes its entire custom data section.

Think of this like an easy to use 'setter' for item data.

Only checks the inventory.

#### Example
```ts
const someData = Athena.player.inventory.getItemData<{ myCustomStuff: string }>(somePlayer, someSlot);

someData.myCustomStuff = 'Hello World!';

await Athena.player.inventory.modifyItemData<typeof someData>(player, someSlot, someData);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `slot` | `number` |  |
| `customData` | `CustomData` | - |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/player/inventory.ts:264](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L264)

___

### override

::: tip Usage
Athena.player.inventory.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal inventory functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"add"`` |
| `callback` | (`player`: `Player`, `item`: [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`, ``"slot"``\>) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/player/inventory.ts:305](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L305)

::: tip Usage
Athena.player.inventory.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal inventory functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getAt"`` |
| `callback` | <CustomData\>(`player`: `Player`, `slot`: `number`) => [`player`](server_config.md#player)<`CustomData`\> \| `undefined` |

#### Returns

`any`

#### Defined in

[server/player/inventory.ts:306](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L306)

::: tip Usage
Athena.player.inventory.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal inventory functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"has"`` |
| `callback` | (`player`: `Player`, `dbName`: `string`, `quantity`: `number`, `version`: `any`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/inventory.ts:307](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L307)

::: tip Usage
Athena.player.inventory.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal inventory functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"sub"`` |
| `callback` | (`player`: `Player`, `item`: [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`, ``"slot"`` \| ``"data"``\>) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/player/inventory.ts:308](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L308)

::: tip Usage
Athena.player.inventory.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal inventory functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`player`: `Player`, `slot`: `number`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/player/inventory.ts:309](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L309)

::: tip Usage
Athena.player.inventory.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal inventory functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"modifyItemData"`` |
| `callback` | <CustomData\>(`player`: `Player`, `slot`: `number`, `customData`: `CustomData`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/player/inventory.ts:310](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L310)

::: tip Usage
Athena.player.inventory.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal inventory functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getItemData"`` |
| `callback` | <CustomData\>(`player`: `Player`, `slot`: `number`) => `CustomData` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/player/inventory.ts:311](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L311)

___

### remove

::: tip Usage
Athena.player.inventory.**remove**(`player`, `slot`): `Promise`<`boolean`\>
:::

Delete an item in a specific slot in an inventory data set.

Does not look into toolbar.

#### Example
```ts
const didRemove = await Athena.player.inventory.remove(somePlayer, someSlot);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `slot` | `number` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/player/inventory.ts:107](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L107)

___

### sub

::: tip Usage
Athena.player.inventory.**sub**(`player`, `item`): `Promise`<`boolean`\>
:::

Subtract a quantity of an item from a player's inventory.
Does not look into toolbar.

#### Example
```ts
const didRemove = await Athena.player.inventory.sub(somePlayer, { dbName: 'burger', quantity: 1 });
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `item` | [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`, ``"slot"`` \| ``"data"``\> |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/player/inventory.ts:70](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/player/inventory.ts#L70)
