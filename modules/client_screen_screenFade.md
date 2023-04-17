---
title: AthenaClient.screen.screenFade
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### fromBlack

::: tip Usage
AthenaClient.screen.screenFade.**fromBlack**(`timeInMs`): `Promise`<`void`\>
:::

Removes the black filter on a screen over time.

#### Parameters

| Name | Type |
| :------ | :------ |
| `timeInMs` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/screen/screenFade.ts:11](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/screen/screenFade.ts#L11)

___

### toBlack

::: tip Usage
AthenaClient.screen.screenFade.**toBlack**(`timeInMs`): `Promise`<`void`\>
:::

Turns a screen black over time.

#### Parameters

| Name | Type |
| :------ | :------ |
| `timeInMs` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/screen/screenFade.ts:22](https://github.com/Stuyk/altv-athena/blob/d68aa20/src/core/client/screen/screenFade.ts#L22)
