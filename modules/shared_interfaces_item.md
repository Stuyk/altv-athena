---
title: AthenaShared.interfaces.item
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [BaseItem](../interfaces/shared_interfaces_item_BaseItem.md)
- [ClothingComponent](../interfaces/shared_interfaces_item_ClothingComponent.md)
- [CustomContextAction](../interfaces/shared_interfaces_item_CustomContextAction.md)
- [DefaultItemBehavior](../interfaces/shared_interfaces_item_DefaultItemBehavior.md)
- [SharedItem](../interfaces/shared_interfaces_item_SharedItem.md)
- [StoredItem](../interfaces/shared_interfaces_item_StoredItem.md)

## Type Aliases

### ClothingInfo

Ƭ **ClothingInfo**: `Object`

Default Clothing Information

#### Type declaration

| Name | Type |
| :------ | :------ |
| `components` | [`ClothingComponent`](../interfaces/shared_interfaces_item_ClothingComponent.md)[] |
| `sex` | `number` |

#### Defined in

[shared/interfaces/item.ts:22](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L22)

___

### Item

Ƭ **Item**<`Behavior`, `CustomData`\>: [`BaseItem`](../interfaces/shared_interfaces_item_BaseItem.md)<`Behavior`, `CustomData`\> & [`StoredItem`](../interfaces/shared_interfaces_item_StoredItem.md)<`CustomData`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Behavior` | [`DefaultItemBehavior`](../interfaces/shared_interfaces_item_DefaultItemBehavior.md) |
| `CustomData` | {} |

#### Defined in

[shared/interfaces/item.ts:370](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L370)

___

### ItemDrop

Ƭ **ItemDrop**: { `_id`: `unknown` ; `expiration`: `number` ; `model?`: `string` ; `name`: `string` ; `pos`: `alt.IVector3`  } & [`StoredItem`](../interfaces/shared_interfaces_item_StoredItem.md)

An Item Drop that is represented on server s ide and client side.

#### Defined in

[shared/interfaces/item.ts:11](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L11)

___

### WeaponInfo

Ƭ **WeaponInfo**: `Object`

Default Weapon Data Information

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ammo` | `number` |
| `components?` | (`string` \| `number`)[] |
| `hash` | `number` |

#### Defined in

[shared/interfaces/item.ts:6](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L6)
