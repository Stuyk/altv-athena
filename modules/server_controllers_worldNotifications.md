---
title: Athena.controllers.worldNotifications
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addToPlayer

::: tip Usage
Athena.controllers.worldNotifications.**addToPlayer**(`player`, `notification`): `string`
:::

Add a world notification to a single local player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `notification` | [`IWorldNotification`](../interfaces/shared_interfaces_iWorldNotification_IWorldNotification.md) |  |

#### Returns

`string`

uid A unique string for notification

#### Defined in

[server/controllers/worldNotifications.ts:93](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/server/controllers/worldNotifications.ts#L93)

___

### append

::: tip Usage
Athena.controllers.worldNotifications.**append**(`notification`): `string`
:::

Adds a global world notification for all players.

#### Parameters

| Name | Type |
| :------ | :------ |
| `notification` | [`IWorldNotification`](../interfaces/shared_interfaces_iWorldNotification_IWorldNotification.md) |

#### Returns

`string`

uid A unique string for notification

#### Defined in

[server/controllers/worldNotifications.ts:35](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/server/controllers/worldNotifications.ts#L35)

___

### override

::: tip Usage
Athena.controllers.worldNotifications.**override**(`functionName`, `callback`): `any`
:::

Used to override any in-world streamer notifications

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"append"`` |
| `callback` | (`notification`: [`IWorldNotification`](../interfaces/shared_interfaces_iWorldNotification_IWorldNotification.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/worldNotifications.ts:131](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/server/controllers/worldNotifications.ts#L131)

::: tip Usage
Athena.controllers.worldNotifications.**override**(`functionName`, `callback`): `any`
:::

Used to override any in-world streamer notifications

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`uid`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/controllers/worldNotifications.ts:132](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/server/controllers/worldNotifications.ts#L132)

::: tip Usage
Athena.controllers.worldNotifications.**override**(`functionName`, `callback`): `any`
:::

Used to override any in-world streamer notifications

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addToPlayer"`` |
| `callback` | (`player`: `Player`, `notification`: [`IWorldNotification`](../interfaces/shared_interfaces_iWorldNotification_IWorldNotification.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/worldNotifications.ts:133](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/server/controllers/worldNotifications.ts#L133)

::: tip Usage
Athena.controllers.worldNotifications.**override**(`functionName`, `callback`): `any`
:::

Used to override any in-world streamer notifications

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeFromPlayer"`` |
| `callback` | (`player`: `Player`, `uid`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/worldNotifications.ts:134](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/server/controllers/worldNotifications.ts#L134)

::: tip Usage
Athena.controllers.worldNotifications.**override**(`functionName`, `callback`): `any`
:::

Used to override any in-world streamer notifications

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"update"`` |
| `callback` | (`player`: `Player`, `notifications`: [`IWorldNotification`](../interfaces/shared_interfaces_iWorldNotification_IWorldNotification.md)[]) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/worldNotifications.ts:135](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/server/controllers/worldNotifications.ts#L135)

___

### remove

::: tip Usage
Athena.controllers.worldNotifications.**remove**(`uid`): `boolean`
:::

Removes a global world notification from all players based on the global uid.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |

#### Returns

`boolean`

#### Defined in

[server/controllers/worldNotifications.ts:55](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/server/controllers/worldNotifications.ts#L55)

___

### removeFromPlayer

::: tip Usage
Athena.controllers.worldNotifications.**removeFromPlayer**(`player`, `uid`): `any`
:::

Remove a world notification from a single local player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/controllers/worldNotifications.ts:75](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/server/controllers/worldNotifications.ts#L75)

___

### update

::: tip Usage
Athena.controllers.worldNotifications.**update**(`player`, `notifications`): `any`
:::

Updates world notifications through the streamer service.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `notifications` | [`IWorldNotification`](../interfaces/shared_interfaces_iWorldNotification_IWorldNotification.md)[] |  |

#### Returns

`any`

#### Defined in

[server/controllers/worldNotifications.ts:111](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/server/controllers/worldNotifications.ts#L111)
