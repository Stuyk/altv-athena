---
title: Athena.vehicle.damage
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### apply

::: tip Usage
Athena.vehicle.damage.**apply**(`vehicle`, `damage`): `void`
:::

Apply vehicle damage to a vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `damage` | `VehicleDamage` |  |

#### Returns

`void`

#### Defined in

[server/vehicle/damage.ts:147](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/vehicle/damage.ts#L147)

___

### get

::: tip Usage
Athena.vehicle.damage.**get**(`vehicle`): [`player`](server_config.md#player) \| `undefined`
:::

Returns vehicle damage for individual parts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

[`player`](server_config.md#player) \| `undefined`

#### Defined in

[server/vehicle/damage.ts:66](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/vehicle/damage.ts#L66)

___

### repair

::: tip Usage
Athena.vehicle.damage.**repair**(`vehicle`): `Promise`<`void`\>
:::

Used to repair all vehicle damage, and save changes to the Database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/vehicle/damage.ts:187](https://github.com/Stuyk/altv-athena/blob/c82c34f/src/core/server/vehicle/damage.ts#L187)
