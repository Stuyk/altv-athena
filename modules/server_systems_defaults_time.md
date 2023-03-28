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

[server/systems/defaults/time.ts:83](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/defaults/time.ts#L83)

___

### getHour

::: tip Usage
Athena.systems.defaults.time.**getHour**(): `number`
:::

Get the current hour.

#### Returns

`number`

#### Defined in

[server/systems/defaults/time.ts:100](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/defaults/time.ts#L100)

___

### getMinute

::: tip Usage
Athena.systems.defaults.time.**getMinute**(): `number`
:::

Get the current minute.

#### Returns

`number`

#### Defined in

[server/systems/defaults/time.ts:110](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/defaults/time.ts#L110)

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

[server/systems/defaults/time.ts:59](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/systems/defaults/time.ts#L59)
