---
title: AthenaShared.utility.weather
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](shared_utility_weather_Internal.md)

## Type Aliases

### WEATHER\_KEY

Ƭ **WEATHER\_KEY**: keyof typeof [`WEATHER_TYPE`](shared_utility_weather_Internal.md#WEATHER_TYPE)

#### Defined in

[shared/utility/weather.ts:19](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/shared/utility/weather.ts#L19)

## Functions

### getWeatherFromString

::: tip Usage
AthenaShared.utility.weather.**getWeatherFromString**(`weatherName`): `number`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `weatherName` | ``"ExtraSunny"`` \| ``"Clear"`` \| ``"Clouds"`` \| ``"Smog"`` \| ``"Foggy"`` \| ``"Overcast"`` \| ``"Rain"`` \| ``"Thunder"`` \| ``"Clearing"`` \| ``"Neutral"`` \| ``"Snow"`` \| ``"Blizzard"`` \| ``"Snowlight"`` \| ``"Xmas"`` \| ``"Halloween"`` |

#### Returns

`number`

#### Defined in

[shared/utility/weather.ts:21](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/shared/utility/weather.ts#L21)
