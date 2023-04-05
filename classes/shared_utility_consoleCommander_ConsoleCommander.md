---
title: AthenaShared.utility.consoleCommander.ConsoleCommander
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/utility/consoleCommander](../modules/shared_utility_consoleCommander.md).ConsoleCommander

## Constructors

### constructor

• **new ConsoleCommander**()

## Methods

### getCommands

::: tip Usage
AthenaShared.utility.consoleCommander.ConsoleCommander.`Static` **getCommands**(): `string`[]
:::

Return a list of commands...

**`Static`**

#### Returns

`string`[]

#### Defined in

[shared/utility/consoleCommander.ts:61](https://github.com/Stuyk/altv-athena/blob/94d0bf7/src/core/shared/utility/consoleCommander.ts#L61)

___

### init

::: tip Usage
AthenaShared.utility.consoleCommander.ConsoleCommander.`Static` **init**(`alt`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `alt` | `Object` |
| `alt.on` | (`event`: `string`, `handler`: `Function`) => `any` |

#### Returns

`void`

#### Defined in

[shared/utility/consoleCommander.ts:25](https://github.com/Stuyk/altv-athena/blob/94d0bf7/src/core/shared/utility/consoleCommander.ts#L25)

___

### invokeCommand

::: tip Usage
AthenaShared.utility.consoleCommander.ConsoleCommander.`Static` **invokeCommand**(`cmdName`, `...args`): `void`
:::

Allows a console command to be invoked through other means.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `cmdName` | `string` |
| `...args` | `string`[] |

#### Returns

`void`

#### Defined in

[shared/utility/consoleCommander.ts:37](https://github.com/Stuyk/altv-athena/blob/94d0bf7/src/core/shared/utility/consoleCommander.ts#L37)

___

### registerConsoleCommand

::: tip Usage
AthenaShared.utility.consoleCommander.ConsoleCommander.`Static` **registerConsoleCommand**(`cmdName`, `callback`): `void`
:::

Register a Server-Side or Client-Side Console Command
Depends on the folder you are writing inside of.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `cmdName` | `string` |
| `callback` | (...`args`: `string`[]) => `void` |

#### Returns

`void`

#### Defined in

[shared/utility/consoleCommander.ts:50](https://github.com/Stuyk/altv-athena/blob/94d0bf7/src/core/shared/utility/consoleCommander.ts#L50)
