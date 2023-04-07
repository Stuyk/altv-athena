---
title: Athena.systems.defaults.time
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### disable

::: tip Usage
Athena.systems.defaults.time.**disable**(): `void`
:::

Disable the default time synchronization on server-side.

#### Example
```ts
Athena.systems.default.time.disable();
```

#### Returns

`void`

#### Defined in

[server/systems/defaults/time.ts:85](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/systems/defaults/time.ts#L85)

___

### getHour

::: tip Usage
Athena.systems.defaults.time.**getHour**(): `number`
:::

Get the current hour.

#### Returns

`number`

#### Defined in

[server/systems/defaults/time.ts:102](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/systems/defaults/time.ts#L102)

___

### getMinute

::: tip Usage
Athena.systems.defaults.time.**getMinute**(): `number`
:::

Get the current minute.

#### Returns

`number`

#### Defined in

[server/systems/defaults/time.ts:112](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/systems/defaults/time.ts#L112)

___

### updatePlayer

::: tip Usage
Athena.systems.defaults.time.**updatePlayer**(`player`): `void`
:::

Updates the player time to match the current server time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`void`

#### Defined in

[server/systems/defaults/time.ts:60](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/systems/defaults/time.ts#L60)
