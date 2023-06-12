---
title: AthenaClient.rmlui.input
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [InputBoxInfo](../interfaces/client_rmlui_input_InputBoxInfo.md)

## Functions

### cancel

::: tip Usage
AthenaClient.rmlui.input.**cancel**(): `Promise`<`void`\>
:::

#### Returns

`Promise`<`void`\>

#### Defined in

[client/rmlui/input/index.ts:132](https://github.com/Stuyk/altv-athena/blob/fc54439/src/core/client/rmlui/input/index.ts#L132)

___

### create

::: tip Usage
AthenaClient.rmlui.input.**create**(`inputInfo`, `skipMenuCheck?`): `Promise`<`string` \| `undefined`\>
:::

Create an input box.

Retruns a string or undefined based on user input.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `inputInfo` | [`InputBoxInfo`](../interfaces/client_rmlui_input_InputBoxInfo.md) | `undefined` |
| `skipMenuCheck?` | `boolean` | `false` |

#### Returns

`Promise`<`string` \| `undefined`\>

#### Defined in

[client/rmlui/input/index.ts:104](https://github.com/Stuyk/altv-athena/blob/fc54439/src/core/client/rmlui/input/index.ts#L104)
