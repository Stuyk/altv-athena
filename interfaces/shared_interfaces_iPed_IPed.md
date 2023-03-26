---
title: AthenaShared.interfaces.iPed.IPed
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/iPed](../modules/shared_interfaces_iPed.md).IPed

Used to pass static ped information from server to client.

**`Interface`**

IPed

## Properties

### animations

• `Optional` **animations**: [`Animation`](shared_interfaces_animation_Animation.md)[]

A list of random animations to play on this pedestrian.

#### Defined in

[shared/interfaces/iPed.ts:51](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/iPed.ts#L51)

___

### dimension

• `Optional` **dimension**: `number`

Will show across all dimensions.

#### Defined in

[shared/interfaces/iPed.ts:81](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/iPed.ts#L81)

___

### heading

• `Optional` **heading**: `number`

The rotation of this Ped. 0 - 360

#### Defined in

[shared/interfaces/iPed.ts:30](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/iPed.ts#L30)

___

### isBeingCreated

• `Optional` **isBeingCreated**: `boolean`

Local Ped Info
Do not automatically fill this out.

#### Defined in

[shared/interfaces/iPed.ts:74](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/iPed.ts#L74)

___

### local

• `Optional` **local**: `number`

Local Ped ID.
Do not actually fill this out.

#### Defined in

[shared/interfaces/iPed.ts:66](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/iPed.ts#L66)

___

### maxDistance

• `Optional` **maxDistance**: `number`

The max distance this Ped should render at.

#### Defined in

[shared/interfaces/iPed.ts:37](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/iPed.ts#L37)

___

### model

• **model**: `string`

The model name this Ped.

#### Defined in

[shared/interfaces/iPed.ts:23](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/iPed.ts#L23)

___

### pos

• **pos**: `IVector3`

Position of the Ped in a 3D space.

#### Defined in

[shared/interfaces/iPed.ts:16](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/iPed.ts#L16)

___

### randomizeAppearance

• `Optional` **randomizeAppearance**: `boolean`

Should the appearance of this ped be randomized when spawned?

#### Defined in

[shared/interfaces/iPed.ts:58](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/iPed.ts#L58)

___

### uid

• `Optional` **uid**: `string`

A unique identifier for this Ped.

#### Defined in

[shared/interfaces/iPed.ts:44](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/iPed.ts#L44)
