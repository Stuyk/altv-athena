---
title: Athena.utility.closest
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getClosestPlayer` | (`pos`: `IVector3`, `ignoredIds`: `number`[]) => `alt.Player` \| `undefined` |
| `getClosestVehicle` | (`pos`: `IVector3`) => `alt.Vehicle` \| `undefined` |

#### Defined in

[server/utility/closest.ts:43](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/utility/closest.ts#L43)

## Functions

### getClosestPlayer

::: tip Usage
Athena.utility.closest.**getClosestPlayer**(`pos`, `ignoredIds?`): `alt.Player` \| `undefined`
:::

Gets the closest player to a position.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `ignoredIds` | `number`[] | `[]` | - |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/utility/closest.ts:23](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/utility/closest.ts#L23)

___

### getClosestVehicle

::: tip Usage
Athena.utility.closest.**getClosestVehicle**(`pos`): `alt.Vehicle` \| `undefined`
:::

Gets the closest vehicle to a position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pos` | `IVector3` | A position in the world. |

#### Returns

`alt.Vehicle` \| `undefined`

#### Defined in

[server/utility/closest.ts:11](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/utility/closest.ts#L11)
