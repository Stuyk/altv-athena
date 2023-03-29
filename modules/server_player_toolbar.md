---
title: Athena.player.toolbar
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### add

::: tip Usage
Athena.player.toolbar.**add**(`player`, `item`): `Promise`<`boolean`\>
:::

Add a new stored item to a user, must specify a quantity of greater than zero.
Toolbar only.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `item` | [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`, ``"slot"``\> |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/player/toolbar.ts:16](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L16)

___

### getAt

::: tip Usage
Athena.player.toolbar.**getAt**<`CustomData`\>(`player`, `slot`): [`player`](server_config.md#player) \| `undefined`
:::

Returns an item from a specific slot.

This item is cloned, and not attached to the toolbar.

Never modify the item directly; this is only to get item information.

#### Example
```ts
const someData = Athena.player.toolbar.getAt<{ myCustomStuff: string }>(somePlayer, someSlot);
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

[`player`](server_config.md#player) \| `undefined`

#### Defined in

[server/player/toolbar.ts:240](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L240)

___

### getItemData

::: tip Usage
Athena.player.toolbar.**getItemData**<`CustomData`\>(`player`, `slot`): `CustomData` \| `undefined`
:::

Returns the custom item data assigned to a specific item.

Will return undefined if the custom data is not available.

Only checks the toolbar.

#### Example
```ts
const someData = Athena.player.toolbar.getItemData<{ myCustomStuff: string }>(somePlayer, someSlot);
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

[server/player/toolbar.ts:147](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L147)

___

### has

::: tip Usage
Athena.player.toolbar.**has**(`player`, `dbName`, `quantity`, `version?`): `any`
:::

Verify that the player has at least 'x' of an item in their toolbar

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

[server/player/toolbar.ts:112](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L112)

___

### modifyItemData

::: tip Usage
Athena.player.toolbar.**modifyItemData**<`CustomData`\>(`player`, `slot`, `customData`): `Promise`<`boolean`\>
:::

Find an item at a specific slot, and changes its entire custom data section.

Think of this like an easy to use 'setter' for item data.

Only checks the toolbar.

#### Example
```ts
const someData = Athena.player.toolbar.getItemData<{ myCustomStuff: string }>(somePlayer, someSlot);

someData.myCustomStuff = 'Hello World!';

await Athena.player.toolbar.modifyItemData<typeof someData>(player, someSlot, someData);
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

[server/player/toolbar.ts:192](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L192)

___

### override

::: tip Usage
Athena.player.toolbar.**override**(`functionName`, `callback`): `any`
:::

Used to override any toolbar functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"add"`` |
| `callback` | (`player`: `Player`, `item`: [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`, ``"slot"``\>) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/player/toolbar.ts:274](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L274)

::: tip Usage
Athena.player.toolbar.**override**(`functionName`, `callback`): `any`
:::

Used to override any toolbar functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"has"`` |
| `callback` | (`player`: `Player`, `dbName`: `string`, `quantity`: `number`, `version`: `any`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/toolbar.ts:275](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L275)

::: tip Usage
Athena.player.toolbar.**override**(`functionName`, `callback`): `any`
:::

Used to override any toolbar functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getAt"`` |
| `callback` | <CustomData\>(`player`: `Player`, `slot`: `number`) => [`player`](server_config.md#player) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/player/toolbar.ts:276](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L276)

::: tip Usage
Athena.player.toolbar.**override**(`functionName`, `callback`): `any`
:::

Used to override any toolbar functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`player`: `Player`, `slot`: `number`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/player/toolbar.ts:277](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L277)

::: tip Usage
Athena.player.toolbar.**override**(`functionName`, `callback`): `any`
:::

Used to override any toolbar functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"sub"`` |
| `callback` | (`player`: `Player`, `item`: [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`, ``"slot"``\>) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/player/toolbar.ts:278](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L278)

::: tip Usage
Athena.player.toolbar.**override**(`functionName`, `callback`): `any`
:::

Used to override any toolbar functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"modifyItemData"`` |
| `callback` | <CustomData\>(`player`: `Player`, `slot`: `number`, `customData`: `CustomData`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/player/toolbar.ts:279](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L279)

::: tip Usage
Athena.player.toolbar.**override**(`functionName`, `callback`): `any`
:::

Used to override any toolbar functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getItemData"`` |
| `callback` | <CustomData\>(`player`: `Player`, `slot`: `number`) => `CustomData` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/player/toolbar.ts:280](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L280)

___

### remove

::: tip Usage
Athena.player.toolbar.**remove**(`player`, `slot`): `Promise`<`boolean`\>
:::

Delete an item in a specific slot in an toolbar data set.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `slot` | `number` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/player/toolbar.ts:81](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L81)

___

### sub

::: tip Usage
Athena.player.toolbar.**sub**(`player`, `item`): `Promise`<`boolean`\>
:::

Subtract a quantity of an item from a player's toolbar.
Toolbar only.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `item` | [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`, ``"slot"``\> |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/player/toolbar.ts:51](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/toolbar.ts#L51)
