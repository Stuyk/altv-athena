import { WebViewController } from '../../extensions/view2';
import { isAnyMenuOpen } from '../../utility/menus';

export const webViewConst = {
    ready: WebViewController.ready,
    emit: WebViewController.invoke,
    open: WebViewController.openPages,
    openAsOverlay: WebViewController.registerOverlay,
    openAsPersistent: WebViewController.registerPersistentPage,
    close: WebViewController.closePages,
    on: WebViewController.onInvoke,
    focus: WebViewController.focus,
    unfocus: WebViewController.unfocus,
    showCursor: WebViewController.showCursor,
    isAnyMenuOpen: isAnyMenuOpen,
    showOverlays: WebViewController.setOverlaysVisible,
};
