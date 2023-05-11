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
AthenaClient.rmlui.commands.**cancel**(): `any`
:::

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:318](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L318)

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

[client/rmlui/commands/index.ts:284](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L284)

___

### isOpen

::: tip Usage
AthenaClient.rmlui.commands.**isOpen**(): `boolean`
:::

Returns whether or not this interface is open.

#### Returns

`boolean`

#### Defined in

[client/rmlui/commands/index.ts:353](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L353)

___

### override

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"autoFillCommand"`` |
| `callback` | () => `any` |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:386](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L386)

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"browseHistory"`` |
| `callback` | (`shouldIncrease`: `boolean`) => `any` |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:387](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L387)

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"cancel"`` |
| `callback` | () => `any` |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:388](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L388)

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"create"`` |
| `callback` | (`inputInfo`: [`CommandInput`](../interfaces/client_rmlui_commands_Internal_CommandInput.md), `skipMenuCheck`: `boolean`) => `Promise`<`string` \| `undefined`\> |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:389](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L389)

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"focus"`` |
| `callback` | (`inputInfo`: [`CommandInput`](../interfaces/client_rmlui_commands_Internal_CommandInput.md)) => `any` |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:390](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L390)

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getCurrentMessage"`` |
| `callback` | () => `string` |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:391](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L391)

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"handleKeyUp"`` |
| `callback` | (`keycode`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:392](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L392)

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"handleMessageUpdate"`` |
| `callback` | () => `any` |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:393](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L393)

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isOpen"`` |
| `callback` | () => `boolean` |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:394](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L394)

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"submit"`` |
| `callback` | () => `any` |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:395](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L395)

::: tip Usage
AthenaClient.rmlui.commands.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"updateSuggestions"`` |
| `callback` | (`suggestions`: [`Omit`](server_player_inventory_Internal.md#Omit)<`MessageCommand`<`Player`\>, ``"callback"``\>[]) => `any` |

#### Returns

`any`

#### Defined in

[client/rmlui/commands/index.ts:396](https://github.com/Stuyk/altv-athena/blob/b7faa35/src/core/client/rmlui/commands/index.ts#L396)
