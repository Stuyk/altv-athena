---
title: AthenaShared.interfaces.iAttachable.default
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/iAttachable](../modules/shared_interfaces_iAttachable.md).default

Used in the attachement system when attaching objects to a player.

**`Interface`**

IAttachable

## Hierarchy

- **`default`**

  ↳ [`JobAttachable`](shared_interfaces_iAttachable_JobAttachable.md)

## Properties

### bone

• **bone**: `PedBone`

Where to begin attaching the object.

If this is not defined it will be around center position of the player it is attached to.

This is a 'Bone ID' and not a 'Bone Index'

Use the PedBone enum provided in Athena for correct value

#### Defined in

[shared/interfaces/iAttachable.ts:51](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/shared/interfaces/iAttachable.ts#L51)

___

### entityID

• `Optional` **entityID**: `number`

Do not define this. Leave it alone.

#### Defined in

[shared/interfaces/iAttachable.ts:58](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/shared/interfaces/iAttachable.ts#L58)

___

### model

• **model**: `string`

The model or object of the attachable.

#### Defined in

[shared/interfaces/iAttachable.ts:23](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/shared/interfaces/iAttachable.ts#L23)

___

### pos

• **pos**: `IVector3`

The position where the object should be attached.

#### Defined in

[shared/interfaces/iAttachable.ts:30](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/shared/interfaces/iAttachable.ts#L30)

___

### rot

• **rot**: `IVector3`

The rotation where the object should be attached.

#### Defined in

[shared/interfaces/iAttachable.ts:37](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/shared/interfaces/iAttachable.ts#L37)

___

### uid

• `Optional` **uid**: `string`

The unique identifier for this attachable.

#### Defined in

[shared/interfaces/iAttachable.ts:16](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/shared/interfaces/iAttachable.ts#L16)
