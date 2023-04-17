---
title: AthenaClient.systems.messenger
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### HistoryCallback

Ƭ **HistoryCallback**: (`msgs`: [`MessageInfo`](client_systems_messenger.md#MessageInfo)[]) => `void`

#### Type declaration

::: tip Usage
AthenaClient.systems.messenger.(`msgs`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `msgs` | [`MessageInfo`](client_systems_messenger.md#MessageInfo)[] |

##### Returns

`void`

#### Defined in

[client/systems/messenger.ts:9](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/systems/messenger.ts#L9)

___

### MessageCallback

Ƭ **MessageCallback**: (`msg`: `string`) => `void`

#### Type declaration

::: tip Usage
AthenaClient.systems.messenger.(`msg`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |

##### Returns

`void`

#### Defined in

[client/systems/messenger.ts:8](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/systems/messenger.ts#L8)

___

### MessageInfo

Ƭ **MessageInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `msg` | `string` |
| `timestamp` | `number` |

#### Defined in

[client/systems/messenger.ts:7](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/systems/messenger.ts#L7)

## Functions

### emit

::: tip Usage
AthenaClient.systems.messenger.**emit**(`msg`): `void`
:::

Emits a message to all callbacks.

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |

#### Returns

`void`

#### Defined in

[client/systems/messenger.ts:43](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/systems/messenger.ts#L43)

___

### getCommands

::: tip Usage
AthenaClient.systems.messenger.**getCommands**(): [`Omit`](server_player_inventory_Internal.md#Omit)<[`player`](server_config.md#player)<`alt.Player`\>, ``"callback"``\>[]
:::

Get the commands that this client has permission for.

#### Returns

[`Omit`](server_player_inventory_Internal.md#Omit)<[`player`](server_config.md#player)<`alt.Player`\>, ``"callback"``\>[]

#### Defined in

[client/systems/messenger.ts:101](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/systems/messenger.ts#L101)

___

### getHistory

::: tip Usage
AthenaClient.systems.messenger.**getHistory**(): { `msg`: `string` ; `timestamp`: `number`  }[]
:::

Return current chat history.
Newest message is always first element in array.

#### Returns

{ `msg`: `string` ; `timestamp`: `number`  }[]

#### Defined in

[client/systems/messenger.ts:71](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/systems/messenger.ts#L71)

___

### registerHistoryCallback

::: tip Usage
AthenaClient.systems.messenger.**registerHistoryCallback**(`callback`): `void`
:::

Register a callback that handles messages.
The messages from other clients, and Athena itself will be pushed through all callbacks registered.
Useful for plugin creators.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`HistoryCallback`](client_systems_messenger.md#HistoryCallback) |

#### Returns

`void`

#### Defined in

[client/systems/messenger.ts:34](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/systems/messenger.ts#L34)

___

### registerMessageCallback

::: tip Usage
AthenaClient.systems.messenger.**registerMessageCallback**(`callback`): `void`
:::

Register a callback that handles messages.
The messages from other clients, and Athena itself will be pushed through all callbacks registered.
Useful for plugin creators.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`MessageCallback`](client_systems_messenger.md#MessageCallback) |

#### Returns

`void`

#### Defined in

[client/systems/messenger.ts:23](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/systems/messenger.ts#L23)

___

### send

::: tip Usage
AthenaClient.systems.messenger.**send**(`msg`): `void`
:::

Takes a message, or command and processes it from an input.
Commands must start with a forward slash. Such as '/'.

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |

#### Returns

`void`

#### Defined in

[client/systems/messenger.ts:81](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/systems/messenger.ts#L81)

___

### setCommands

::: tip Usage
AthenaClient.systems.messenger.**setCommands**(`_commands`): `void`
:::

Populates the local command list for the client.
Which can be used to

#### Parameters

| Name | Type |
| :------ | :------ |
| `_commands` | [`Omit`](server_player_inventory_Internal.md#Omit)<`MessageCommand`<`Player`\>, ``"callback"``\>[] |

#### Returns

`void`

#### Defined in

[client/systems/messenger.ts:91](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/systems/messenger.ts#L91)
