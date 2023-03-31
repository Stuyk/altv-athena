---
title: AthenaClient.rmlui.question
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [QuestionInfo](../interfaces/client_rmlui_question_QuestionInfo.md)

## Functions

### cancel

::: tip Usage
AthenaClient.rmlui.question.**cancel**(): `Promise`<`void`\>
:::

#### Returns

`Promise`<`void`\>

#### Defined in

[client/rmlui/question/index.ts:140](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/client/rmlui/question/index.ts#L140)

___

### create

::: tip Usage
AthenaClient.rmlui.question.**create**(`info`): `Promise`<`boolean`\>
:::

Create a box that asks for a simple yes or no answer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `info` | [`QuestionInfo`](../interfaces/client_rmlui_question_QuestionInfo.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[client/rmlui/question/index.ts:117](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/client/rmlui/question/index.ts#L117)
