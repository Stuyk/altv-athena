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

### play3DAudio

::: tip Usage
AthenaClient.views.audio.AudioView.`Static` **play3DAudio**(`soundName`, `pan`, `volume`, `soundInstantID?`): `void`
:::

Play an audio from the WebView.
Requires a specific name for a file.
Do not add '.ogg'.

**`Static`**

**`Memberof`**

AudioView

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

[client/views/audio.ts:83](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/views/audio.ts#L83)

___

### stop3DAudio

::: tip Usage
AthenaClient.views.audio.AudioView.`Static` **stop3DAudio**(`soundInstantID?`): `void`
:::

Stop current audio

**`Static`**

**`Memberof`**

AudioView

#### Parameters

| Name | Type |
| :------ | :------ |
| `soundInstantID?` | `string` |

#### Returns

`void`

#### Defined in

[client/views/audio.ts:96](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/client/views/audio.ts#L96)
