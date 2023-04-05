---
title: AthenaShared.interfaces.item.DefaultItemBehavior
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/item](../modules/shared_interfaces_item.md).DefaultItemBehavior

Item behavior associated with an item

**`Interface`**

DefaultItemBehavior

## Properties

### canDrop

• `Optional` **canDrop**: `boolean`

Can this item be dropped.

#### Defined in

[shared/interfaces/item.ts:93](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/item.ts#L93)

___

### canStack

• `Optional` **canStack**: `boolean`

Can the item be stacked

#### Defined in

[shared/interfaces/item.ts:101](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/item.ts#L101)

___

### canTrade

• `Optional` **canTrade**: `boolean`

Can the item be traded

#### Defined in

[shared/interfaces/item.ts:109](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/item.ts#L109)

___

### destroyOnDrop

• `Optional` **destroyOnDrop**: `boolean`

Destroy this item on drop.

#### Defined in

[shared/interfaces/item.ts:155](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/item.ts#L155)

___

### isClothing

• `Optional` **isClothing**: `boolean`

Used to state that an item is clothing.

DO NOT specify isEquippable with this; leave it as false.

#### Defined in

[shared/interfaces/item.ts:119](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/item.ts#L119)

___

### isCustomIcon

• `Optional` **isCustomIcon**: `boolean`

Override default icon behavior for items such as clothing.
Allows for specifying a custom icon instead.

#### Defined in

[shared/interfaces/item.ts:164](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/item.ts#L164)

___

### isEquippable

• `Optional` **isEquippable**: `boolean`

Do not specify clothing, and weapon with this.

Just only specify this one if doing custom equips.

#### Defined in

[shared/interfaces/item.ts:147](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/item.ts#L147)

___

### isToolbar

• `Optional` **isToolbar**: `boolean`

Can this item be added to the toolbar.

#### Defined in

[shared/interfaces/item.ts:127](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/item.ts#L127)

___

### isWeapon

• `Optional` **isWeapon**: `boolean`

Is this item a weapon?

DO NOT specify isEquippable with this; leave it as false.

#### Defined in

[shared/interfaces/item.ts:137](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/item.ts#L137)
