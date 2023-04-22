---
title: AthenaClient.webview.page.IPage
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/webview/page](../modules/client_webview_page.md).IPage

## Properties

### callbacks

• **callbacks**: `Object`

Events to call when the page is opened.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `onClose` | [`AnyCallback`](../modules/client_webview_page_Internal.md#AnyCallback) | Function to call when the View is closed. |
| `onReady` | [`AnyCallback`](../modules/client_webview_page_Internal.md#AnyCallback) | Function to call when the View is loaded. Usually used to pass data to the WebView after it's ready. |

#### Defined in

[client/webview/page.ts:22](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/webview/page.ts#L22)

___

### keybind

• `Optional` **keybind**: `any`

An optional hotkey to open / close the page.
Set `useSameKeyToClose` to true to force the same key to close the interface.

#### Defined in

[client/webview/page.ts:164](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/webview/page.ts#L164)

___

### name

• **name**: `string`

The full name of the Vue file you are trying to load.

#### Defined in

[client/webview/page.ts:15](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/webview/page.ts#L15)

___

### options

• `Optional` **options**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `disableEscapeKey?` | `boolean` | Disable the escape key auto-close bind. |
| `onClose?` | { `enableControls?`: `boolean` ; `enablePauseMenu?`: `boolean` ; `hideCursor?`: `boolean` ; `setIsMenuOpenToFalse?`: `boolean` ; `showHud?`: `boolean` ; `showOverlays?`: `boolean` ; `unblurBackground?`: `boolean` ; `unfocus?`: `boolean`  } | - |
| `onClose.enableControls?` | `boolean` | Enable game controls on close. |
| `onClose.enablePauseMenu?` | `boolean` | Enable the pause menu on close? |
| `onClose.hideCursor?` | `boolean` | Hide the cursor when the WebView is closed? |
| `onClose.setIsMenuOpenToFalse?` | `boolean` | Sets alt.Player.local.isMenuOpen to false if true. |
| `onClose.showHud?` | `boolean` | Show the HUD when the WebView is closed? |
| `onClose.showOverlays?` | `boolean` | Show overlays when the WebView is closed? |
| `onClose.unblurBackground?` | `boolean` | Unblur the game. |
| `onClose.unfocus?` | `boolean` | Unfocus the WebView when it is closed? |
| `onOpen?` | { `blurBackground?`: `boolean` ; `disableControls?`: ``"all"`` \| ``"camera"`` \| ``"none"`` ; `disablePauseMenu?`: `boolean` ; `focus?`: `boolean` ; `hideHud?`: `boolean` ; `hideOverlays?`: `boolean` ; `setIsMenuOpenToTrue?`: `boolean` ; `showCursor?`: `boolean`  } | - |
| `onOpen.blurBackground?` | `boolean` | Blur the game. |
| `onOpen.disableControls?` | ``"all"`` \| ``"camera"`` \| ``"none"`` | Disable game controls on open? |
| `onOpen.disablePauseMenu?` | `boolean` | Disable pause menu while this page is open? |
| `onOpen.focus?` | `boolean` | Focus the WebView when this page is opened. |
| `onOpen.hideHud?` | `boolean` | Hide the HUD when the WebView is opened. |
| `onOpen.hideOverlays?` | `boolean` | Hide overlays when the WebView is opened. |
| `onOpen.setIsMenuOpenToTrue?` | `boolean` | Sets alt.Player.local.isMenuOpen to false if false. |
| `onOpen.showCursor?` | `boolean` | Show the cursor when the WebView is focused? |

#### Defined in

[client/webview/page.ts:34](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/webview/page.ts#L34)
