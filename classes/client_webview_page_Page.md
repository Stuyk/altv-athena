---
title: AthenaClient.webview.page.Page
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/webview/page](../modules/client_webview_page.md).Page

## Constructors

### constructor

• **new Page**(`page`)

Creates a WebView Page Controller

**`Memberof`**

Page

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | [`IPage`](../interfaces/client_webview_page_IPage.md) |

#### Defined in

[client/webview/page.ts:175](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/webview/page.ts#L175)

## Properties

### info

• `Private` **info**: [`IPage`](../interfaces/client_webview_page_IPage.md)

#### Defined in

[client/webview/page.ts:168](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/webview/page.ts#L168)

## Methods

### close

▸ **close**(`isManuallyTriggered?`): `void`

If `isManuallyTriggered` is set to true.
This means that the close event is not coming from the 'Escape' key bind.
Useful for when you want your own exit functionality for your WebView.

**`Memberof`**

Page

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isManuallyTriggered?` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[client/webview/page.ts:283](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/webview/page.ts#L283)

___

### open

▸ **open**(): `Promise`<`boolean`\>

Open this WebView Page

**`Memberof`**

Page

#### Returns

`Promise`<`boolean`\>

#### Defined in

[client/webview/page.ts:209](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/webview/page.ts#L209)
