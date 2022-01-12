import * as alt from 'alt-client';

const PAGE_NAME = 'ShopUI';

alt.onServer(`${PAGE_NAME}:Client:OpenShop`, (shopItems: {}[], type: string, shopImg: string) => {
    alt.emit(`${PAGE_NAME}:Vue:Open`, shopItems, type, shopImg);
    return;
});
