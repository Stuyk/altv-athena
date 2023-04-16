---
title: AthenaShared.interfaces.iAttachable.JobAttachable
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/iAttachable](../modules/shared_interfaces_iAttachable.md).JobAttachable

Used in the attachement system when attaching objects to a player.

**`Interface`**

IAttachable

## Hierarchy

- [`IAttachable`](shared_interfaces_iAttachable_IAttachable.md)

  ↳ **`JobAttachable`**

## Properties

### atObjectiveStart

• `Optional` **atObjectiveStart**: `boolean`

Attach the object when the objective is loaded?

#### Defined in

[shared/interfaces/iAttachable.ts:77](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/shared/interfaces/iAttachable.ts#L77)

___

### bone

• **bone**: `PedBone`

Where to begin attaching the object.

If this is not defined it will be around center position of the player it is attached to.

This is a 'Bone ID' and not a 'Bone Index'

Use the PedBone enum provided in Athena for correct value

#### Inherited from

[IAttachable](shared_interfaces_iAttachable_IAttachable.md).[bone](shared_interfaces_iAttachable_IAttachable.md#bone)

#### Defined in

[shared/interfaces/iAttachable.ts:51](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/shared/interfaces/iAttachable.ts#L51)

___

### duration

• `Optional` **duration**: `number`

How long should this object be attached.
Set this to -1 for infinite.

#### Defined in

[shared/interfaces/iAttachable.ts:70](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/shared/interfaces/iAttachable.ts#L70)

___

### entityID

• `Optional` **entityID**: `number`

Do not define this. Leave it alone.

#### Inherited from

[IAttachable](shared_interfaces_iAttachable_IAttachable.md).[entityID](shared_interfaces_iAttachable_IAttachable.md#entityID)

#### Defined in

[shared/interfaces/iAttachable.ts:58](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/shared/interfaces/iAttachable.ts#L58)

___

### model

• **model**: `string`

The model or object of the attachable.

#### Inherited from

[IAttachable](shared_interfaces_iAttachable_IAttachable.md).[model](shared_interfaces_iAttachable_IAttachable.md#model)

#### Defined in

[shared/interfaces/iAttachable.ts:23](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/shared/interfaces/iAttachable.ts#L23)

___

### pos

• **pos**: `IVector3`

The position where the object should be attached.

#### Inherited from

[IAttachable](shared_interfaces_iAttachable_IAttachable.md).[pos](shared_interfaces_iAttachable_IAttachable.md#pos)

#### Defined in

[shared/interfaces/iAttachable.ts:30](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/shared/interfaces/iAttachable.ts#L30)

___

### rot

• **rot**: `IVector3`

The rotation where the object should be attached.

#### Inherited from

[IAttachable](shared_interfaces_iAttachable_IAttachable.md).[rot](shared_interfaces_iAttachable_IAttachable.md#rot)

#### Defined in

[shared/interfaces/iAttachable.ts:37](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/shared/interfaces/iAttachable.ts#L37)

___

### uid

• `Optional` **uid**: `string`

The unique identifier for this attachable.

#### Inherited from

[IAttachable](shared_interfaces_iAttachable_IAttachable.md).[uid](shared_interfaces_iAttachable_IAttachable.md#uid)

#### Defined in

[shared/interfaces/iAttachable.ts:16](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/shared/interfaces/iAttachable.ts#L16)
