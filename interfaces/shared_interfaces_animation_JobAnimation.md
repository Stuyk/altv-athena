---
title: AthenaShared.interfaces.animation.JobAnimation
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/animation](../modules/shared_interfaces_animation.md).JobAnimation

Used to pass animation information from server-side to client-side.

**`Interface`**

Animation

## Hierarchy

- [`Animation`](shared_interfaces_animation_Animation.md)

  ↳ **`JobAnimation`**

## Properties

### atObjectiveStart

• `Optional` **atObjectiveStart**: `boolean`

Play the animation when the objective is loaded?

#### Defined in

[shared/interfaces/animation.ts:55](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/shared/interfaces/animation.ts#L55)

___

### delay

• `Optional` **delay**: `number`

When to play this animation after a certain amount of ms.

#### Defined in

[shared/interfaces/animation.ts:48](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/shared/interfaces/animation.ts#L48)

___

### dict

• **dict**: `string`

The animation dictionary for the animation.

#### Inherited from

[Animation](shared_interfaces_animation_Animation.md).[dict](shared_interfaces_animation_Animation.md#dict)

#### Defined in

[shared/interfaces/animation.ts:16](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/shared/interfaces/animation.ts#L16)

___

### duration

• **duration**: `number`

How long should this animation play for.
Set this to -1 for infinite.

#### Inherited from

[Animation](shared_interfaces_animation_Animation.md).[duration](shared_interfaces_animation_Animation.md#duration)

#### Defined in

[shared/interfaces/animation.ts:39](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/shared/interfaces/animation.ts#L39)

___

### flags

• **flags**: `ANIMATION_FLAGS`

A bitwise enum of values that determine how an animation looks / works.
Combine them with 'ANIMATION_FLAGS.X | ANIMATION_FLAGS.Y'

#### Inherited from

[Animation](shared_interfaces_animation_Animation.md).[flags](shared_interfaces_animation_Animation.md#flags)

#### Defined in

[shared/interfaces/animation.ts:31](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/shared/interfaces/animation.ts#L31)

___

### name

• **name**: `string`

The name of the animation.

#### Inherited from

[Animation](shared_interfaces_animation_Animation.md).[name](shared_interfaces_animation_Animation.md#name)

#### Defined in

[shared/interfaces/animation.ts:23](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/shared/interfaces/animation.ts#L23)

___

### rotation

• `Optional` **rotation**: `IVector3`

What direction to face when playing the animation.

#### Defined in

[shared/interfaces/animation.ts:62](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/shared/interfaces/animation.ts#L62)
