const PAGE_NAME = 'CharacterSelect';

export const CHARACTER_SELECT_EVENTS = {
    SHOW: `${PAGE_NAME}:Show`,
    SELECT: `${PAGE_NAME}:Select`,
    NEW: `${PAGE_NAME}:New`,
    DELETE: `${PAGE_NAME}:Delete`,
    DONE: `${PAGE_NAME}:Done`,
    EXIT: `${PAGE_NAME}:Exit`,
};

export const CHARACTER_SELECT_WEBVIEW_EVENTS = {
    PAGE_NAME: PAGE_NAME,
    READY: `${PAGE_NAME}:Ready`,
    SELECT: `${PAGE_NAME}:Select`,
    UPDATE: `${PAGE_NAME}:Update`,
    DELETE: `${PAGE_NAME}:Delete`,
    NEW: `${PAGE_NAME}:New`,
    SET_CHARACTERS: `${PAGE_NAME}:SetCharacters`,
    EXIT: `${PAGE_NAME}:Exit`,
};
