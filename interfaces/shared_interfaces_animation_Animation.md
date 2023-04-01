---
title: AthenaShared.interfaces.animation.Animation
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/animation](../modules/shared_interfaces_animation.md).Animation

Used to pass animation information from server-side to client-side.

**`Interface`**

Animation

## Hierarchy

- **`Animation`**

  ↳ [`JobAnimation`](shared_interfaces_animation_JobAnimation.md)

## Properties

### dict

• **dict**: `string`

The animation dictionary for the animation.

#### Defined in

[shared/interfaces/animation.ts:16](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/animation.ts#L16)

___

### duration

• **duration**: `number`

How long should this animation play for.
Set this to -1 for infinite.

#### Defined in

[shared/interfaces/animation.ts:39](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/animation.ts#L39)

___

### flags

• **flags**: `ANIMATION_FLAGS`

A bitwise enum of values that determine how an animation looks / works.
Combine them with 'ANIMATION_FLAGS.X | ANIMATION_FLAGS.Y'

#### Defined in

[shared/interfaces/animation.ts:31](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/animation.ts#L31)

___

### name

• **name**: `string`

The name of the animation.

#### Defined in

[shared/interfaces/animation.ts:23](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/animation.ts#L23)
