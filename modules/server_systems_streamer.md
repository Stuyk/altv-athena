---
title: Athena.systems.streamer
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### registerCallback

::: tip Usage
Athena.systems.streamer.**registerCallback**<`T`\>(`key`, `callback`, `range?`): `Promise`<`void`\>
:::

Register a custom callback function.
When the key is updated with data it will come back through the callback.

**`Static`**

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `string` | `undefined` | A unique key for this stream data. |
| `callback` | (`player`: `Player`, `streamedData`: `T`[]) => `void` | `undefined` |  |
| `range` | `number` | `100` | How far away should we look from the player's position. |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/streamer.ts:145](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/streamer.ts#L145)

___

### updateData

::: tip Usage
Athena.systems.streamer.**updateData**<`T`\>(`key`, `array`): `Promise`<`void`\>
:::

Populates Stream Data for External Process

**`Static`**

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `array` | `T`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/streamer.ts:190](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/streamer.ts#L190)
