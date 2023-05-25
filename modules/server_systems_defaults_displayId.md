---
title: Athena.systems.defaults.displayId
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### disable

::: tip Usage
Athena.systems.defaults.displayId.**disable**(): `void`
:::

Disable default id display on-screen for players.

#### Example
```ts
Athena.systems.defaults.displayId.disable();
```

#### Returns

`void`

#### Defined in

[server/systems/defaults/displayId.ts:47](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/defaults/displayId.ts#L47)

___

### setLocation

::: tip Usage
Athena.systems.defaults.displayId.**setLocation**(`x`, `y`): `void`
:::

Change the position of the on-screen id a player sees

X as 1 = Right of Screen
Y as 1 = Bottom of Screen

#### Example
```ts
// Place in the very center of the screen. I'm sure everyone would love it.
Athena.systems.defaults.displayId.setLocation(0.5, 0.5);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | 0 - 1.0 |
| `y` | `number` | 0 - 1.0 |

#### Returns

`void`

#### Defined in

[server/systems/defaults/displayId.ts:69](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/defaults/displayId.ts#L69)
