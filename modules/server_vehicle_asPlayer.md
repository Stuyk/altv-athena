---
title: Athena.vehicle.asPlayer
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### override

::: tip Usage
Athena.vehicle.asPlayer.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control as a player functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toggleLock"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/asPlayer.ts:129](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/server/vehicle/asPlayer.ts#L129)

::: tip Usage
Athena.vehicle.asPlayer.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control as a player functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toggleDoor"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`, `door`: ``0`` \| ``3`` \| ``2`` \| ``1`` \| ``4`` \| ``5``) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/asPlayer.ts:130](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/server/vehicle/asPlayer.ts#L130)

::: tip Usage
Athena.vehicle.asPlayer.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control as a player functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toggleEngine"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/asPlayer.ts:131](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/server/vehicle/asPlayer.ts#L131)

___

### toggleDoor

::: tip Usage
Athena.vehicle.asPlayer.**toggleDoor**(`player`, `vehicle`, `door`): `any`
:::

Toggles a door lock as if a player toggled it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `door` | ``0`` \| ``3`` \| ``2`` \| ``1`` \| ``4`` \| ``5`` |  |

#### Returns

`any`

#### Defined in

[server/vehicle/asPlayer.ts:91](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/server/vehicle/asPlayer.ts#L91)

___

### toggleEngine

::: tip Usage
Athena.vehicle.asPlayer.**toggleEngine**(`player`, `vehicle`): `any`
:::

Toggles an engine lock as if a player toggled it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`any`

#### Defined in

[server/vehicle/asPlayer.ts:66](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/server/vehicle/asPlayer.ts#L66)

___

### toggleLock

::: tip Usage
Athena.vehicle.asPlayer.**toggleLock**(`player`, `vehicle`): `any`
:::

Toggles a vehicle lock as if a player toggled it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`any`

#### Defined in

[server/vehicle/asPlayer.ts:37](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/server/vehicle/asPlayer.ts#L37)
