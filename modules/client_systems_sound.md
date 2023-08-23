---
title: AthenaClient.systems.sound
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### frontend

::: tip Usage
AthenaClient.systems.sound.**frontend**(`audioName`, `ref`): `void`
:::

Play a sound in the frontend.

https://altv.stuyk.com/docs/articles/tables/frontend-sounds.html

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audioName` | `string` | The name of the audio file to play. |
| `ref` | `string` | The name of the sound you want to play. |

#### Returns

`void`

None

#### Defined in

[client/systems/sound.ts:21](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/systems/sound.ts#L21)

___

### handlePlayAudioPositional

::: tip Usage
AthenaClient.systems.sound.**handlePlayAudioPositional**(`pos`, `soundName`, `soundInstantID?`): `void`
:::

Handle play audio positional

#### Parameters

| Name | Type |
| :------ | :------ |
| `pos` | `Vector3` |
| `soundName` | `string` |
| `soundInstantID?` | `string` |

#### Returns

`void`

#### Defined in

[client/systems/sound.ts:31](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/systems/sound.ts#L31)

___

### play2d

::: tip Usage
AthenaClient.systems.sound.**play2d**(`soundName`, `volume?`, `soundInstantID?`): `void`
:::

Play a 2D sound.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `soundName` | `string` | `undefined` | The name of the sound to play. |
| `volume` | `number` | `0.35` | The volume of the sound. |
| `soundInstantID?` | `string` | `undefined` | - |

#### Returns

`void`

None

#### Defined in

[client/systems/sound.ts:110](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/systems/sound.ts#L110)

___

### play3d

::: tip Usage
AthenaClient.systems.sound.**play3d**(`entity`, `soundName`, `soundInstantID?`): `void`
:::

Really basic 3D audio. Does not update after first play.
Simply plays the audio based on your position.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `Entity` |
| `soundName` | `string` |
| `soundInstantID?` | `string` |

#### Returns

`void`

#### Defined in

[client/systems/sound.ts:66](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/systems/sound.ts#L66)

___

### stopAudio

::: tip Usage
AthenaClient.systems.sound.**stopAudio**(`soundInstantID?`): `void`
:::

Stop audio.

#### Parameters

| Name | Type |
| :------ | :------ |
| `soundInstantID?` | `string` |

#### Returns

`void`

None

#### Defined in

[client/systems/sound.ts:120](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/systems/sound.ts#L120)
