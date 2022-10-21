import { Page } from '@AthenaClient/systems/page';
import { WebViewController } from '@AthenaClient/extensions/view2';
import { isAnyMenuOpen } from '@AthenaClient/utility/menus';

export const webViewConst = {
    close: WebViewController.closePages,
    emit: WebViewController.invoke,
    focus: WebViewController.focus,
    isAnyMenuOpen: isAnyMenuOpen,
    isPageOpen: WebViewController.isPageOpen,
    on: WebViewController.onInvoke,
    open: WebViewController.openPages,
    openAsOverlay: WebViewController.registerOverlay,
    openAsPersistent: WebViewController.registerPersistentPage,
    page: Page,
    ready: WebViewController.ready,
    showCursor: WebViewController.showCursor,
    showOverlays: WebViewController.setOverlaysVisible,
    unfocus: WebViewController.unfocus,
};
