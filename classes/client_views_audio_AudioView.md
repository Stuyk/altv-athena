---
title: AthenaClient.views.audio.AudioView
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/views/audio](../modules/client_views_audio.md).AudioView

## Constructors

### constructor

• **new AudioView**()

## Methods

### init

::: tip Usage
AthenaClient.views.audio.AudioView.`Static` **init**(): `void`
:::

#### Returns

`void`

#### Defined in

[client/views/audio.ts:71](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/client/views/audio.ts#L71)

___

### play3DAudio

::: tip Usage
AthenaClient.views.audio.AudioView.`Static` **play3DAudio**(`soundName`, `pan`, `volume`, `soundInstantID?`): `void`
:::

Play an audio from the WebView.
Requires a specific name for a file.
Do not add '.ogg'.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `soundName` | `string` |
| `pan` | `number` |
| `volume` | `number` |
| `soundInstantID?` | `string` |

#### Returns

`void`

#### Defined in

[client/views/audio.ts:86](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/client/views/audio.ts#L86)

___

### stop3DAudio

::: tip Usage
AthenaClient.views.audio.AudioView.`Static` **stop3DAudio**(`soundInstantID?`): `void`
:::

Stop current audio

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `soundInstantID?` | `string` |

#### Returns

`void`

#### Defined in

[client/views/audio.ts:99](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/client/views/audio.ts#L99)
