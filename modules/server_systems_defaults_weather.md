---
title: Athena.systems.defaults.weather
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### disable

::: tip Usage
Athena.systems.defaults.weather.**disable**(): `void`
:::

Disable the default weather from updating players.

#### Example
```ts
Athena.systems.defaults.weather.disable();
```

#### Returns

`void`

#### Defined in

[server/systems/defaults/weather.ts:91](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/defaults/weather.ts#L91)

___

### getCurrentWeather

::: tip Usage
Athena.systems.defaults.weather.**getCurrentWeather**(`asString`): `number`
:::

Get the current weather as a string or number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `asString` | ``false`` |

#### Returns

`number`

#### Defined in

[server/systems/defaults/weather.ts:117](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/defaults/weather.ts#L117)

::: tip Usage
Athena.systems.defaults.weather.**getCurrentWeather**(`asString`): `string`
:::

Get the current weather as a string or number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `asString` | ``true`` |

#### Returns

`string`

#### Defined in

[server/systems/defaults/weather.ts:118](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/defaults/weather.ts#L118)

___

### setWeatherCycle

::: tip Usage
Athena.systems.defaults.weather.**setWeatherCycle**(`newWeatherCycle`): `void`
:::

Used to override the default weather cycle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `newWeatherCycle` | `WEATHER_KEY`[] |

#### Returns

`void`

#### Defined in

[server/systems/defaults/weather.ts:108](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/defaults/weather.ts#L108)

___

### updatePlayer

::: tip Usage
Athena.systems.defaults.weather.**updatePlayer**(`player`): `void`
:::

Updates the player weather to match current weather system.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`void`

#### Defined in

[server/systems/defaults/weather.ts:72](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/defaults/weather.ts#L72)
