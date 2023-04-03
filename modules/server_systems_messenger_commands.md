---
title: Athena.systems.messenger.commands
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
| `execute` | (`player`: `Player`, `commandName`: `string`, `args`: `any`[]) => `any` |
| `get` | (`commandName`: `string`) => `any` |
| `getCommands` | (`player`: `Player`) => [`player`](server_config.md#player)[] |
| `populateCommands` | (`player`: `Player`) => `any` |
| `register` | (`name`: `string`, `desc`: `string`, `perms`: `string`[], `callback`: `CommandCallback`<`Player`\>, `isCharacterPermission`: `boolean`) => `any` |

#### Defined in

[server/systems/messenger/commands.ts:176](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L176)

## Functions

### execute

::: tip Usage
Athena.systems.messenger.commands.**execute**(`player`, `commandName`, `args`): `any`
:::

Used to execute a command by name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `commandName` | `string` |  |
| `args` | `any`[] |  |

#### Returns

`any`

#### Defined in

[server/systems/messenger/commands.ts:19](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L19)

___

### get

::: tip Usage
Athena.systems.messenger.commands.**get**(`commandName`): `any`
:::

Get command information by command name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandName` | `string` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/commands.ts:46](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L46)

___

### getCommands

::: tip Usage
Athena.systems.messenger.commands.**getCommands**(`player`): [`player`](server_config.md#player)[]
:::

Get all commands the player has access to.
Includes names of individual parameters for each callback function as well.
Excludes callbacks.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[server/systems/messenger/commands.ts:135](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L135)

___

### override

::: tip Usage
Athena.systems.messenger.commands.**override**(`functionName`, `callback`): `any`
:::

Used to override command functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"execute"`` |
| `callback` | (`player`: `Player`, `commandName`: `string`, `args`: `any`[]) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/commands.ts:188](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L188)

::: tip Usage
Athena.systems.messenger.commands.**override**(`functionName`, `callback`): `any`
:::

Used to override command functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | (`commandName`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/commands.ts:189](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L189)

::: tip Usage
Athena.systems.messenger.commands.**override**(`functionName`, `callback`): `any`
:::

Used to override command functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getCommands"`` |
| `callback` | (`player`: `Player`) => [`player`](server_config.md#player)[] |

#### Returns

`any`

#### Defined in

[server/systems/messenger/commands.ts:190](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L190)

::: tip Usage
Athena.systems.messenger.commands.**override**(`functionName`, `callback`): `any`
:::

Used to override command functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"populateCommands"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/commands.ts:191](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L191)

::: tip Usage
Athena.systems.messenger.commands.**override**(`functionName`, `callback`): `any`
:::

Used to override command functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"register"`` |
| `callback` | (`name`: `string`, `desc`: `string`, `perms`: `string`[], `callback`: `CommandCallback`<`Player`\>, `isCharacterPermission`: `boolean`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/commands.ts:192](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L192)

___

### populateCommands

::: tip Usage
Athena.systems.messenger.commands.**populateCommands**(`player`): `any`
:::

Get all commands that are associated with a player's current permission level.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/systems/messenger/commands.ts:94](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L94)

___

### register

::: tip Usage
Athena.systems.messenger.commands.**register**(`name`, `desc`, `perms`, `callback`, `isCharacterPermission?`): `any`
:::

Register a new command that can be called.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `desc` | `string` | `undefined` |
| `perms` | `string`[] | `undefined` |
| `callback` | `CommandCallback`<`Player`\> | `undefined` |
| `isCharacterPermission` | `boolean` | `false` |

#### Returns

`any`

#### Defined in

[server/systems/messenger/commands.ts:59](https://github.com/Stuyk/altv-athena/blob/fd05e62/src/core/server/systems/messenger/commands.ts#L59)
