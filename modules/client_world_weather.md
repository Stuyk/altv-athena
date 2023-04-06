---
title: AthenaClient.world.weather
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### changeTo

::: tip Usage
AthenaClient.world.weather.**changeTo**(`nextWeather`, `timeInSeconds`): `Promise`<`void`\>
:::

Change the weather gracefully.

#### Parameters

| Name | Type |
| :------ | :------ |
| `nextWeather` | `string` |
| `timeInSeconds` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/world/weather.ts:40](https://github.com/Stuyk/altv-athena/blob/128b8a7/src/core/client/world/weather.ts#L40)

___

### freeze

::: tip Usage
AthenaClient.world.weather.**freeze**(): `void`
:::

Used to freeze the weather to a specific value.

Call this function after using the `changeTo` function.

#### Returns

`void`

#### Defined in

[client/world/weather.ts:20](https://github.com/Stuyk/altv-athena/blob/128b8a7/src/core/client/world/weather.ts#L20)

___

### isChanging

::: tip Usage
AthenaClient.world.weather.**isChanging**(): `boolean`
:::

#### Returns

`boolean`

#### Defined in

[client/world/weather.ts:9](https://github.com/Stuyk/altv-athena/blob/128b8a7/src/core/client/world/weather.ts#L9)

___

### unfreeze

::: tip Usage
AthenaClient.world.weather.**unfreeze**(): `void`
:::

Unfreeze the weather function.

#### Returns

`void`

#### Defined in

[client/world/weather.ts:29](https://github.com/Stuyk/altv-athena/blob/128b8a7/src/core/client/world/weather.ts#L29)
