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

[client/webview/index.ts:9](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L9)

## Functions

### closeOverlays

▸ **closeOverlays**(`pageNames`): `Promise`<`void`\>

Closes an overlay page or pages.

**`Static`**

**`Memberof`**

WebViewController

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageNames` | `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:503](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L503)

___

### closePages

▸ **closePages**(`pageNames`, `showOverlays?`): `Promise`<`void`\>

Close a group of pages that may or may not be open.

**`Static`**

**`Memberof`**

WebViewController

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pageNames` | `string`[] | `undefined` |
| `showOverlays` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:544](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L544)

___

### create

▸ **create**(`url`): `void`

Sets the URL to use based on current deployment.

**`Static`**

**`Memberof`**

WebViewController

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:231](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L231)

___

### disableEscapeKeyForPage

▸ **disableEscapeKeyForPage**(`pageName`): `void`

Register a page to ignore escape key presence.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:658](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L658)

___

### dispose

▸ **dispose**(): `void`

Destroy the WebView

**`Static`**

**`Memberof`**

WebViewController

#### Returns

`void`

#### Defined in

[client/webview/index.ts:384](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L384)

___

### emit

▸ **emit**<`EventNames`\>(`eventName`, `...args`): `Promise`<`void`\>

Emit through the WebViewEvents Helper
Ensures that there is a callback event on the other side.

**`Static`**

**`Memberof`**

WebViewController

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

[client/webview/index.ts:624](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L624)

___

### focus

▸ **focus**(): `Promise`<`void`\>

Focus the WebView Instance

**`Static`**

**`Memberof`**

WebViewController

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:457](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L457)

___

### get

▸ **get**(): `Promise`<`alt.WebView`\>

Get the current WebView instance.

**`Static`**

**`Memberof`**

WebViewController

#### Returns

`Promise`<`alt.WebView`\>

#### Defined in

[client/webview/index.ts:353](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L353)

___

### isAnyMenuOpen

▸ **isAnyMenuOpen**(`excludeDead?`): `boolean`

Checks if any menu is currently open

**`Export`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `excludeDead` | `boolean` | `false` |

#### Returns

`boolean`

#### Defined in

[client/webview/index.ts:673](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L673)

___

### isDoneUpdating

▸ **isDoneUpdating**(): `boolean`

Returns whether or not all pages are done closing / opening

#### Returns

`boolean`

#### Defined in

[client/webview/index.ts:648](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L648)

___

### isPageOpen

▸ **isPageOpen**(`pageName`): `boolean`

Returns if a page is currently open.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |

#### Returns

`boolean`

#### Defined in

[client/webview/index.ts:639](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L639)

___

### on

▸ **on**<`EventNames`\>(`eventName`, `callback`): `void`

Registers an event to call when a component is loaded.

**`Static`**

**`Memberof`**

WebViewController

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

[client/webview/index.ts:604](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L604)

___

### openPages

▸ **openPages**(`pageOrPages`, `hideOverlays?`, `closeOnEscapeCallback?`): `Promise`<`void`\>

Used to open a page or pages.
Use a single page if you have closing callbacks.

**`Static`**

**`Memberof`**

WebViewController

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pageOrPages` | `string` \| `string`[] | `undefined` | An array of pages, or a single page name. Case sensitive. |
| `hideOverlays` | `boolean` | `true` | - |
| `closeOnEscapeCallback?` | () => `void` | `undefined` | An event to call when the page is closed. |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:399](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L399)

___

### ready

▸ **ready**(`pageName`, `callback`): `void`

Registers an event to call when a component is loaded.

**`Static`**

**`Memberof`**

WebViewController

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |
| `callback` | [`AnyCallback`](client_webview.md#AnyCallback) |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:592](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L592)

___

### registerOverlay

▸ **registerOverlay**(`pageName`, `callback?`): `void`

Register a Page Overlay such as HUD elements.

**`Static`**

**`Memberof`**

WebViewController

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pageName` | `string` | `undefined` |
| `callback` | (`isVisible`: `boolean`) => `void` | `undefined` |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:314](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L314)

___

### registerPersistentPage

▸ **registerPersistentPage**(`pageName`): `void`

Registers a page that never, ever closes. Ever.

**`Static`**

**`Memberof`**

WebViewController

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:296](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L296)

___

### setOverlayVisible

▸ **setOverlayVisible**(`pageName`, `state`): `void`

Trigger this to hide/show a specific overlay

**`Static`**

**`Memberof`**

WebViewController

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |
| `state` | `boolean` |

#### Returns

`void`

#### Defined in

[client/webview/index.ts:333](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L333)

___

### setOverlaysVisible

▸ **setOverlaysVisible**(`value`, `doNotUpdate?`): `Promise`<`void`\>

Trigger this to hide/show all overlays like Chat, HUD, etc.

**`Static`**

**`Memberof`**

WebViewController

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `boolean` | `undefined` |
| `doNotUpdate` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:266](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L266)

___

### showCursor

▸ **showCursor**(`state`): `Promise`<`void`\>

Show or hide the cursor.

**`Static`**

**`Memberof`**

WebViewController

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:478](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L478)

___

### unfocus

▸ **unfocus**(): `Promise`<`void`\>

Focus the WebView Instance

**`Static`**

**`Memberof`**

WebViewController

#### Returns

`Promise`<`void`\>

#### Defined in

[client/webview/index.ts:467](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/webview/index.ts#L467)
