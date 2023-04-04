---
title: AthenaClient.rmlui.commands
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](client_rmlui_commands_Internal.md)

## Functions

### cancel

::: tip Usage
AthenaClient.rmlui.commands.**cancel**(): `Promise`<`void`\>
:::

#### Returns

`Promise`<`void`\>

#### Defined in

[client/rmlui/commands/index.ts:277](https://github.com/Stuyk/altv-athena/blob/10fa575/src/core/client/rmlui/commands/index.ts#L277)

___

### create

::: tip Usage
AthenaClient.rmlui.commands.**create**(`inputInfo`, `skipMenuCheck?`): `Promise`<`string` \| `undefined`\>
:::

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `inputInfo` | [`CommandInput`](../interfaces/client_rmlui_commands_Internal_CommandInput.md) | `undefined` |
| `skipMenuCheck` | `boolean` | `false` |

#### Returns

`Promise`<`string` \| `undefined`\>

#### Defined in

[client/rmlui/commands/index.ts:247](https://github.com/Stuyk/altv-athena/blob/10fa575/src/core/client/rmlui/commands/index.ts#L247)

___

### isOpen

::: tip Usage
AthenaClient.rmlui.commands.**isOpen**(): `boolean`
:::

Returns whether or not this interface is open.

#### Returns

`boolean`

#### Defined in

[client/rmlui/commands/index.ts:308](https://github.com/Stuyk/altv-athena/blob/10fa575/src/core/client/rmlui/commands/index.ts#L308)
