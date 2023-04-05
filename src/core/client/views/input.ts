import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api';

// import { InputMenu, InputResult } from '@AthenaShared/interfaces/inputMenus';
// import { View_Events_Input_Menu } from '@AthenaShared/enums/views';
// import ViewModel from '@AthenaClient/models/viewModel';

// const PAGE_NAME = 'InputBox';
// let inputMenu: InputMenu;

// /**
//  * Do Not Export Internal Only
//  */
// class InternalFunctions implements ViewModel {
//     static async show(_inputMenu: InputMenu): Promise<void> {
//         inputMenu = _inputMenu;

//         if (AthenaClient.webview.isAnyMenuOpen()) {
//             return;
//         }

//         // Need to add a sleep here because wheel menu inputs can be be too quick.
//         await alt.Utils.wait(150);

//         const view = await AthenaClient.webview.get();
//         view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
//         view.on(`${PAGE_NAME}:Submit`, InternalFunctions.submit);

//         AthenaClient.webview.openPages(PAGE_NAME, true, InternalFunctions.close);
//         AthenaClient.webview.focus();
//         AthenaClient.webview.showCursor(true);

//         alt.toggleGameControls(false);
//         alt.Player.local.isMenuOpen = true;
//     }

//     static async close(isNotCancel = false, shouldClosePage = false) {
//         alt.toggleGameControls(true);

//         const view = await AthenaClient.webview.get();
//         view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
//         view.off(`${PAGE_NAME}:Submit`, InternalFunctions.submit);

//         AthenaClient.webview.unfocus();
//         AthenaClient.webview.showCursor(false);

//         alt.Player.local.isMenuOpen = false;

//         if (shouldClosePage) {
//             AthenaClient.webview.closePages([PAGE_NAME], true);
//         }

//         if (isNotCancel) {
//             return;
//         }

//         if (inputMenu.callback) {
//             inputMenu.callback(null);
//         }

//         if (inputMenu.serverEvent) {
//             alt.emitServer(inputMenu.serverEvent, null);
//         }
//     }

//     static submit(results: InputResult[]) {
//         if (inputMenu.callback) {
//             inputMenu.callback(results);
//         }

//         if (inputMenu.serverEvent) {
//             alt.emitServer(inputMenu.serverEvent, results);
//         }

//         InternalFunctions.close(true, true);
//     }

//     static async ready() {
//         const view = await AthenaClient.webview.get();
//         view.emit(`${PAGE_NAME}:SetMenu`, inputMenu.title, inputMenu.options, inputMenu.generalOptions);
//     }
// }

// export class InputView {
//     /**
//      * Show an input menu from client-side.
//      * @static
//      * @param {InputMenu} _inputMenu
//      *
//      */
//     static setMenu(_inputMenu: InputMenu) {
//         InternalFunctions.show(_inputMenu);
//     }
// }

// alt.onServer(View_Events_Input_Menu.SetMenu, InternalFunctions.show);
