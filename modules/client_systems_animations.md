---
title: AthenaClient.systems.animations
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### loadAnimation

::: tip Usage
AthenaClient.systems.animations.**loadAnimation**(`dict`, `count?`): `Promise`<`boolean`\>
:::

Attempts to load an animation dictionary multiple times before returning false.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `dict` | `string` | `undefined` | The name of the animation dictionary. |
| `count?` | `number` | `0` | Do not modify this. Leave it as zero. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[client/systems/animations.ts:16](https://github.com/Stuyk/altv-athena/blob/8499342/src/core/client/systems/animations.ts#L16)

___

### playAnimation

::: tip Usage
AthenaClient.systems.animations.**playAnimation**(`dict`, `name`, `flags?`, `duration?`): `Promise`<`void`\>
:::

Play an animation for the local player.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `dict` | `string` | `undefined` | The dictionary of the animation. |
| `name` | `string` | `undefined` | The name of the animation. |
| `flags?` | `ANIMATION_FLAGS` | `ANIMATION_FLAGS.CANCELABLE` | A combination of flags. ie. (ANIMATION_FLAGS.CANCELABLE \| ANIMATION_FLAGS.UPPERBODY_ONLY) |
| `duration` | `number` | `-1` | - |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/systems/animations.ts:51](https://github.com/Stuyk/altv-athena/blob/8499342/src/core/client/systems/animations.ts#L51)

___

### playPedAnimation

::: tip Usage
AthenaClient.systems.animations.**playPedAnimation**(`scriptID`, `dict`, `name`, `flags?`, `duration?`): `Promise`<`void`\>
:::

Play an animation on a Pedestrian

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `scriptID` | `number` | `undefined` |
| `dict` | `string` | `undefined` |
| `name` | `string` | `undefined` |
| `flags?` | `ANIMATION_FLAGS` | `ANIMATION_FLAGS.CANCELABLE` |
| `duration?` | `number` | `-1` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/systems/animations.ts:87](https://github.com/Stuyk/altv-athena/blob/8499342/src/core/client/systems/animations.ts#L87)
