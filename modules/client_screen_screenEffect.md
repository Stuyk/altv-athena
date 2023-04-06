---
title: AthenaClient.screen.screenEffect
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### isEffectActive

::: tip Usage
AthenaClient.screen.screenEffect.**isEffectActive**(`screenEffect`): `any`
:::

Check whether the specific screen effect is running.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `screenEffect` | `SCREEN_EFFECTS` | The ScreenEffect to check. |

#### Returns

`any`

true if the screen effect is active; otherwise false

#### Defined in

[client/screen/screenEffect.ts:9](https://github.com/Stuyk/altv-athena/blob/e51302d/src/core/client/screen/screenEffect.ts#L9)

___

### startEffect

::: tip Usage
AthenaClient.screen.screenEffect.**startEffect**(`screenEffect`, `duration?`, `looped?`): `void`
:::

Starts applying the specified effect to the screen.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `screenEffect` | `SCREEN_EFFECTS` | `undefined` | The ScreenEffect to start playing. |
| `duration` | `number` | `0` | The duration of the effect in milliseconds or zero to use the default length. |
| `looped` | `boolean` | `false` | If true the effect won't stop until stopEffect(ScreenEffect) is called. |

#### Returns

`void`

#### Defined in

[client/screen/screenEffect.ts:19](https://github.com/Stuyk/altv-athena/blob/e51302d/src/core/client/screen/screenEffect.ts#L19)

___

### stopAllEffects

::: tip Usage
AthenaClient.screen.screenEffect.**stopAllEffects**(): `void`
:::

Stops all currently running effects.

#### Returns

`void`

#### Defined in

[client/screen/screenEffect.ts:34](https://github.com/Stuyk/altv-athena/blob/e51302d/src/core/client/screen/screenEffect.ts#L34)

___

### stopEffect

::: tip Usage
AthenaClient.screen.screenEffect.**stopEffect**(`screenEffect`): `void`
:::

Stops applying the specified effect to the screen.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `screenEffect` | `SCREEN_EFFECTS` | The ScreenEffect to stop playing. |

#### Returns

`void`

#### Defined in

[client/screen/screenEffect.ts:27](https://github.com/Stuyk/altv-athena/blob/e51302d/src/core/client/screen/screenEffect.ts#L27)
