import * as alt from 'alt-client';

const fontsToLoad = [
    {
        path: '/client/rmlui/fonts/arialbd.ttf', // Only supports TTF
        name: 'arial',
        italic: false,
        bold: false,
    },
];

for (let i = 0; i < fontsToLoad.length; i++) {
    if (!fontsToLoad[i].path.includes('ttf')) {
        console.warn(`Could not load Font: ${fontsToLoad[i].path}. TTF only fonts.`);
        continue;
    }

    try {
        alt.loadRmlFont(fontsToLoad[i].path, fontsToLoad[i].name, fontsToLoad[i].italic, fontsToLoad[i].bold);
    } catch (err) {}
}
