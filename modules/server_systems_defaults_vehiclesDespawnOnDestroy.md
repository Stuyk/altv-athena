---
title: Athena.systems.defaults.vehiclesDespawnOnDestroy
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### disable

::: Tip
Athena.systems.defaults.vehiclesDespawnOnDestroy.**disable**(): `void`
:::

Disable vehicles despawning when a player leaves.

**`Example`**

```ts
Athena.systems.default.vehiclesDespawnOnDestroy.disable();
```

**`Export`**

#### Returns

`void`

#### Defined in

[server/systems/defaults/vehiclesDespawnOnDestroy.ts:55](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/systems/defaults/vehiclesDespawnOnDestroy.ts#L55)

___

### setTimeBeforeRemove

::: Tip
Athena.systems.defaults.vehiclesDespawnOnDestroy.**setTimeBeforeRemove**(`milliseconds`): `void`
:::

Set the time before a vehicle is removed after it is destroyed.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `milliseconds` | `number` |

#### Returns

`void`

#### Defined in

[server/systems/defaults/vehiclesDespawnOnDestroy.ts:66](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/systems/defaults/vehiclesDespawnOnDestroy.ts#L66)
