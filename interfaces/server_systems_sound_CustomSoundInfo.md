---
title: Athena.systems.sound.CustomSoundInfo
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/systems/sound](../modules/server_systems_sound.md).CustomSoundInfo

## Properties

### audioName

• **audioName**: `string`

A custom `.ogg` file name for an audio clip.

#### Defined in

[server/systems/sound.ts:12](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/sound.ts#L12)

___

### pos

• `Optional` **pos**: `IVector3`

A positional Vector3 on where to play the sound from.

#### Defined in

[server/systems/sound.ts:20](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/sound.ts#L20)

___

### target

• `Optional` **target**: `Entity`

If you want the audio 3D specify a target to play this audio from.

#### Defined in

[server/systems/sound.ts:38](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/sound.ts#L38)

___

### volume

• `Optional` **volume**: `number`

The volume between `0.0` - `1.0`.

Recommended: `0.35`.

#### Defined in

[server/systems/sound.ts:30](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/sound.ts#L30)
