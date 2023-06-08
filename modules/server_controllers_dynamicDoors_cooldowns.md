---
title: Athena.controllers.dynamicDoors.cooldowns
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### clearCooldown

::: tip Usage
Athena.controllers.dynamicDoors.cooldowns.**clearCooldown**(`player`): `void`
:::

Clear cooldown for triggering the door event.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/controllers/dynamicDoors/cooldowns.ts:45](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/server/controllers/dynamicDoors/cooldowns.ts#L45)

___

### getExpiration

::: tip Usage
Athena.controllers.dynamicDoors.cooldowns.**getExpiration**(`player`): `any`
:::

Get expiration time of a cooldown

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`any`

#### Defined in

[server/controllers/dynamicDoors/cooldowns.ts:56](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/server/controllers/dynamicDoors/cooldowns.ts#L56)

___

### isCooldownDone

::: tip Usage
Athena.controllers.dynamicDoors.cooldowns.**isCooldownDone**(`player`): `boolean`
:::

Check if a cooldown is completed.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`boolean`

#### Defined in

[server/controllers/dynamicDoors/cooldowns.ts:31](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/server/controllers/dynamicDoors/cooldowns.ts#L31)

___

### updateCooldown

::: tip Usage
Athena.controllers.dynamicDoors.cooldowns.**updateCooldown**(`player`): `void`
:::

Register a cooldown, with predetermiend

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/controllers/dynamicDoors/cooldowns.ts:20](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/server/controllers/dynamicDoors/cooldowns.ts#L20)
