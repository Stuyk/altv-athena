---
title: Athena.webview.utilities
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### closePages

::: tip Usage
Athena.webview.utilities.**closePages**(`player`, `pages?`): `void`
:::

Closes all pages if no pages are specified.
If pages are specified it only closes those specific pages.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `player` | `Player` | `undefined` |
| `pages?` | `string`[] | `[]` |

#### Returns

`void`

#### Defined in

[server/webview/utilities.ts:22](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/webview/utilities.ts#L22)

___

### emit

::: tip Usage
Athena.webview.utilities.**emit**(`player`, `eventName`, `...args`): `void`
:::

Emits an event directly to the client's WebView.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `eventName` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[server/webview/utilities.ts:12](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/webview/utilities.ts#L12)
