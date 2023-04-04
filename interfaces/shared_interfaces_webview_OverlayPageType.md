---
title: AthenaShared.interfaces.webview.OverlayPageType
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/webview](../modules/shared_interfaces_webview.md).OverlayPageType

Used to describe a webview page that can be overlayed.

**`Interface`**

OverlayPageType

## Properties

### callback

• **callback**: (`isVisible`: `boolean`) => `void`

#### Type declaration

::: tip Usage
AthenaShared.interfaces.webview.OverlayPageType.(`isVisible`): `void`
:::

Callback to re-toggle page visibility.

##### Parameters

| Name | Type |
| :------ | :------ |
| `isVisible` | `boolean` |

##### Returns

`void`

#### Defined in

[shared/interfaces/webview.ts:29](https://github.com/Stuyk/altv-athena/blob/6e181c5/src/core/shared/interfaces/webview.ts#L29)

___

### isHidden

• `Optional` **isHidden**: `boolean`

Is this overlay hidden?

#### Defined in

[shared/interfaces/webview.ts:22](https://github.com/Stuyk/altv-athena/blob/6e181c5/src/core/shared/interfaces/webview.ts#L22)

___

### name

• **name**: `string`

The name of the page.

#### Defined in

[shared/interfaces/webview.ts:14](https://github.com/Stuyk/altv-athena/blob/6e181c5/src/core/shared/interfaces/webview.ts#L14)
