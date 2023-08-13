---
title: Athena.systems.messenger.messaging
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### MessageCallback

Ƭ **MessageCallback**: (`player`: `alt.Player`, `msg`: `string`) => `void`

#### Type declaration

::: tip Usage
Athena.systems.messenger.messaging.(`player`, `msg`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `alt.Player` |
| `msg` | `string` |

##### Returns

`void`

#### Defined in

[server/systems/messenger/messaging.ts:8](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L8)

## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addCallback` | (`callback`: [`MessageCallback`](server_systems_messenger_messaging.md#MessageCallback)) => `any` |
| `cleanMessage` | (`msg`: `string`) => `string` |
| `emit` | (`player`: `Player`, `msg`: `string`) => `any` |
| `send` | (`player`: `Player`, `msg`: `string`) => `any` |
| `sendToPlayers` | (`players`: `Player`[], `msg`: `string`) => `any` |

#### Defined in

[server/systems/messenger/messaging.ts:134](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L134)

## Functions

### addCallback

::: tip Usage
Athena.systems.messenger.messaging.**addCallback**(`callback`): `any`
:::

Register a callback that handles messages.
The messages from other clients, and Athena itself will be pushed through all callbacks registered.
Useful for plugin creators.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`MessageCallback`](server_systems_messenger_messaging.md#MessageCallback) |

#### Returns

`any`

#### Defined in

[server/systems/messenger/messaging.ts:83](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L83)

___

### emit

::: tip Usage
Athena.systems.messenger.messaging.**emit**(`player`, `msg`): `any`
:::

Emits a message to all callbacks.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `msg` | `string` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/messaging.ts:96](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L96)

___

### override

::: tip Usage
Athena.systems.messenger.messaging.**override**(`functionName`, `callback`): `any`
:::

Used to override messaging functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addCallback"`` |
| `callback` | (`callback`: [`MessageCallback`](server_systems_messenger_messaging.md#MessageCallback)) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/messaging.ts:146](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L146)

::: tip Usage
Athena.systems.messenger.messaging.**override**(`functionName`, `callback`): `any`
:::

Used to override messaging functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"cleanMessage"`` |
| `callback` | (`msg`: `string`) => `string` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/messaging.ts:147](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L147)

::: tip Usage
Athena.systems.messenger.messaging.**override**(`functionName`, `callback`): `any`
:::

Used to override messaging functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"emit"`` |
| `callback` | (`player`: `Player`, `msg`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/messaging.ts:148](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L148)

::: tip Usage
Athena.systems.messenger.messaging.**override**(`functionName`, `callback`): `any`
:::

Used to override messaging functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"send"`` |
| `callback` | (`player`: `Player`, `msg`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/messaging.ts:149](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L149)

::: tip Usage
Athena.systems.messenger.messaging.**override**(`functionName`, `callback`): `any`
:::

Used to override messaging functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"sendToPlayers"`` |
| `callback` | (`players`: `Player`[], `msg`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/messaging.ts:150](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L150)

___

### send

::: tip Usage
Athena.systems.messenger.messaging.**send**(`player`, `msg`): `any`
:::

Send a message to an individual player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `msg` | `string` |  |

#### Returns

`any`

#### Defined in

[server/systems/messenger/messaging.ts:54](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L54)

___

### sendToPlayers

::: tip Usage
Athena.systems.messenger.messaging.**sendToPlayers**(`players`, `msg`): `any`
:::

Send a message to a group of players.

#### Parameters

| Name | Type |
| :------ | :------ |
| `players` | `Player`[] |
| `msg` | `string` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/messaging.ts:68](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/messenger/messaging.ts#L68)
