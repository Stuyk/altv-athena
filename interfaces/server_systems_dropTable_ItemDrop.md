---
title: Athena.systems.dropTable.ItemDrop
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/systems/dropTable](../modules/server_systems_dropTable.md).ItemDrop

## Properties

### amountMax

• **amountMax**: `number`

The maximum amount of items this can give.

Set to `1` if you only ever want to give `1`.

**`Memberof`**

ItemDrop

#### Defined in

[server/systems/dropTable.ts:54](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/server/systems/dropTable.ts#L54)

___

### amountMin

• **amountMin**: `number`

The minimum amount of items this will give.

Always set to at least 1.

**`Memberof`**

ItemDrop

#### Defined in

[server/systems/dropTable.ts:44](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/server/systems/dropTable.ts#L44)

___

### dbName

• **dbName**: `string`

The dbName of the item to be obtained

**`Memberof`**

ItemDropRatio

#### Defined in

[server/systems/dropTable.ts:10](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/server/systems/dropTable.ts#L10)

___

### frequency

• **frequency**: `Object`

How often this item will pull in a drop

**`Memberof`**

ItemDrop

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `denominator` | `number` | Usually the higher number. Think like 18, 32, 64, etc. Set to `1` if you want to include it in every drop. |
| `numerator` | `number` | Usually '1' |

#### Defined in

[server/systems/dropTable.ts:18](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/server/systems/dropTable.ts#L18)
