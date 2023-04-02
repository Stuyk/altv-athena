---
title: AthenaClient.webview
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## References

### Page

Re-exports [Page](../classes/client_webview_page_Page.md)

## Type Aliases

### AnyCallback

Ƭ **AnyCallback**: (...`args`: `any`[]) => `void` \| (...`args`: `any`[]) => `Promise`<`void`\> \| `Function`

#### Defined in

[client/webview/index.ts:10](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L10)

## Functions

### closeOverlays

::: tip Usage
AthenaClient.webview.**closeOverlays**(`pageNames`): `Promise`<`void`\>
:::

Closes an overlay page or pages.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageNames` | `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:505](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L505)

___

### closePages

::: tip Usage
AthenaClient.webview.**closePages**(`pageNames`, `showOverlays?`): `Promise`<`void`\>
:::

Close a group of pages that may or may not be open.

**`Static`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pageNames` | `string`[] | `undefined` |
| `showOverlays` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:546](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L546)

___

### create

::: tip Usage
AthenaClient.webview.**create**(`url`): `void`
:::

Sets the URL to use based on current deployment.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:232](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L232)

___

### disableEscapeKeyForPage

::: tip Usage
AthenaClient.webview.**disableEscapeKeyForPage**(`pageName`): `void`
:::

Register a page to ignore escape key presence.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:660](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L660)

___

### dispose

::: tip Usage
AthenaClient.webview.**dispose**(): `void`
:::

Destroy the WebView

**`Static`**

#### Returns

`void`

#### Defined in

[client/webview/index.ts:386](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L386)

___

### emit

::: tip Usage
AthenaClient.webview.**emit**<`EventNames`\>(`eventName`, `...args`): `Promise`<`void`\>
:::

Emit through the WebViewEvents Helper
Ensures that there is a callback event on the other side.

**`Static`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `EventNames` | `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `EventNames` |
| `...args` | `any`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:626](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L626)

___

### focus

::: tip Usage
AthenaClient.webview.**focus**(): `Promise`<`void`\>
:::

Focus the WebView Instance

**`Static`**

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:459](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L459)

___

### get

::: tip Usage
AthenaClient.webview.**get**(): `Promise`<`alt.WebView`\>
:::

Get the current WebView instance.

**`Static`**

#### Returns

`Promise`<`alt.WebView`\>

#### Defined in

[client/webview/index.ts:355](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L355)

___

### isAnyMenuOpen

::: tip Usage
AthenaClient.webview.**isAnyMenuOpen**(`excludeDead?`): `boolean`
:::

Checks if any menu is currently open

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `excludeDead` | `boolean` | `false` |

#### Returns

`boolean`

#### Defined in

[client/webview/index.ts:675](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L675)

___

### isDoneUpdating

::: tip Usage
AthenaClient.webview.**isDoneUpdating**(): `boolean`
:::

Returns whether or not all pages are done closing / opening

#### Returns

`boolean`

#### Defined in

[client/webview/index.ts:650](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L650)

___

### isPageOpen

::: tip Usage
AthenaClient.webview.**isPageOpen**(`pageName`): `boolean`
:::

Returns if a page is currently open.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |

#### Returns

`boolean`

#### Defined in

[client/webview/index.ts:641](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L641)

___

### on

::: tip Usage
AthenaClient.webview.**on**<`EventNames`\>(`eventName`, `callback`): `void`
:::

Registers an event to call when a component is loaded.

**`Static`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `EventNames` | `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `EventNames` |
| `callback` | [`AnyCallback`](client_webview.md#AnyCallback) |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:606](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L606)

___

### openPages

::: tip Usage
AthenaClient.webview.**openPages**(`pageOrPages`, `hideOverlays?`, `closeOnEscapeCallback?`): `Promise`<`void`\>
:::

Used to open a page or pages.
Use a single page if you have closing callbacks.

**`Static`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pageOrPages` | `string` \| `string`[] | `undefined` | An array of pages, or a single page name. Case sensitive. |
| `hideOverlays` | `boolean` | `true` | - |
| `closeOnEscapeCallback?` | () => `void` | `undefined` | An event to call when the page is closed. |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:401](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L401)

___

### ready

::: tip Usage
AthenaClient.webview.**ready**(`pageName`, `callback`): `void`
:::

Registers an event to call when a component is loaded.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |
| `callback` | [`AnyCallback`](client_webview.md#AnyCallback) |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:594](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L594)

___

### registerOverlay

::: tip Usage
AthenaClient.webview.**registerOverlay**(`pageName`, `callback?`): `void`
:::

Register a Page Overlay such as HUD elements.

**`Static`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pageName` | `string` | `undefined` |
| `callback` | (`isVisible`: `boolean`) => `void` | `undefined` |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:316](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L316)

___

### registerPersistentPage

::: tip Usage
AthenaClient.webview.**registerPersistentPage**(`pageName`): `void`
:::

Registers a page that never, ever closes. Ever.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:298](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L298)

___

### setOverlayVisible

::: tip Usage
AthenaClient.webview.**setOverlayVisible**(`pageName`, `state`): `void`
:::

Trigger this to hide/show a specific overlay

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |
| `state` | `boolean` |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:335](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L335)

___

### setOverlaysVisible

::: tip Usage
AthenaClient.webview.**setOverlaysVisible**(`value`, `doNotUpdate?`): `Promise`<`void`\>
:::

Trigger this to hide/show all overlays like Chat, HUD, etc.

**`Static`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `boolean` | `undefined` |
| `doNotUpdate` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:268](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L268)

___

### showCursor

::: tip Usage
AthenaClient.webview.**showCursor**(`state`): `Promise`<`void`\>
:::

Show or hide the cursor.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:480](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L480)

___

### unfocus

::: tip Usage
AthenaClient.webview.**unfocus**(): `Promise`<`void`\>
:::

Focus the WebView Instance

**`Static`**

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:469](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/webview/index.ts#L469)
