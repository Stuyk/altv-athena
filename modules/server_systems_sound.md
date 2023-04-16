---
title: Athena.systems.sound
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [CustomSoundInfo](../interfaces/server_systems_sound_CustomSoundInfo.md)

## Functions

### override

::: tip Usage
Athena.systems.sound.**override**(`functionName`, `callback`): `any`
:::

Used to override sound trigger functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"playSound"`` |
| `callback` | (`player`: `Player`, `soundInfo`: [`CustomSoundInfo`](../interfaces/server_systems_sound_CustomSoundInfo.md)) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/sound.ts:129](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/systems/sound.ts#L129)

::: tip Usage
Athena.systems.sound.**override**(`functionName`, `callback`): `any`
:::

Used to override sound trigger functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"playSoundInDimension"`` |
| `callback` | (`dimension`: `number`, `soundInfo`: [`Omit`](server_player_inventory_Internal.md#Omit)<[`CustomSoundInfo`](../interfaces/server_systems_sound_CustomSoundInfo.md), ``"pos"``\>) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/sound.ts:130](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/systems/sound.ts#L130)

::: tip Usage
Athena.systems.sound.**override**(`functionName`, `callback`): `any`
:::

Used to override sound trigger functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"playSoundInArea"`` |
| `callback` | (`soundInfo`: [`Required`](server_extensions_extColshape_Internal.md#Required)<[`Omit`](server_player_inventory_Internal.md#Omit)<[`CustomSoundInfo`](../interfaces/server_systems_sound_CustomSoundInfo.md), ``"volume"`` \| ``"target"``\>\>) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/sound.ts:131](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/systems/sound.ts#L131)

___

### playSound

::: tip Usage
Athena.systems.sound.**playSound**(`player`, `soundInfo`): `any`
:::

Play a single sound for a player.

**`Static`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `soundInfo` | [`CustomSoundInfo`](../interfaces/server_systems_sound_CustomSoundInfo.md) |  |

#### Returns

`any`

#### Defined in

[server/systems/sound.ts:51](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/systems/sound.ts#L51)

___

### playSoundInArea

::: tip Usage
Athena.systems.sound.**playSoundInArea**(`soundInfo`): `any`
:::

Play a custom sound in a 3D position for all players in the area.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `soundInfo` | [`Required`](server_extensions_extColshape_Internal.md#Required)<[`Omit`](server_player_inventory_Internal.md#Omit)<[`CustomSoundInfo`](../interfaces/server_systems_sound_CustomSoundInfo.md), ``"volume"`` \| ``"target"``\>\> |

#### Returns

`any`

#### Defined in

[server/systems/sound.ts:100](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/systems/sound.ts#L100)

___

### playSoundInDimension

::: tip Usage
Athena.systems.sound.**playSoundInDimension**(`dimension`, `soundInfo`): `any`
:::

Play a custom non-frontend sound in a dimension.
Specify an entity to make the sound play from that specific entity.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `dimension` | `number` |
| `soundInfo` | [`Omit`](server_player_inventory_Internal.md#Omit)<[`CustomSoundInfo`](../interfaces/server_systems_sound_CustomSoundInfo.md), ``"pos"``\> |

#### Returns

`any`

#### Defined in

[server/systems/sound.ts:73](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/systems/sound.ts#L73)
