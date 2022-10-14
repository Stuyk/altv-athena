import { Page } from '@AthenaClient/systems/page';
import { WebViewController } from '@AthenaClient/extensions/view2';
import { isAnyMenuOpen } from '@AthenaClient/utility/menus';

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
    page: Page,
};
