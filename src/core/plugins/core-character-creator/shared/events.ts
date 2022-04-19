const PAGE_NAME = 'CharacterCreator';

export const CHARACTER_CREATOR_EVENTS = {
    SHOW: `${PAGE_NAME}:Show`,
    DONE: `${PAGE_NAME}:Done`,
    EXIT: `${PAGE_NAME}:Exit`,
    VERIFY_NAME: `${PAGE_NAME}:VerifyName`,
};

export const CHARACTER_CREATOR_WEBVIEW_EVENTS = {
    PAGE_NAME: PAGE_NAME,
    READY: `${PAGE_NAME}:Ready`,
    SET_DATA: `${PAGE_NAME}:SetData`,
    EXIT: `${PAGE_NAME}:Exit`,
    VERIFY_NAME: `${PAGE_NAME}:VerifyName`,
    SYNC: `${PAGE_NAME}:Sync`,
    READY_SETUP_COMPLETE: `${PAGE_NAME}:ReadySetupComplete`,
    DONE: `${PAGE_NAME}:Done`,
    DISABLE_CONTROLS: `${PAGE_NAME}:DisableControls`,
};
