import * as alt from 'alt-server';
import { CurrencyTypes } from '../../../shared/enums/currency';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import emit from './emit';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';
import { Appearance } from '../../../shared/interfaces/appearance';
import { Athena } from '@AthenaServer/api/athena';

const Sync = {
    /**
     * Synchronize currency data like bank, cash, etc.
     * @memberof SyncPrototype
     */
    currencyData(player: alt.Player): void {
        const keys: (keyof typeof CurrencyTypes)[] = <(keyof typeof CurrencyTypes)[]>Object.keys(CurrencyTypes);
        const data = Athena.document.character.get(player);

        for (const key of keys) {
            const currencyName: string = CurrencyTypes[key];
            emit.meta(player, currencyName, data[currencyName]);
        }
    },
    appearance(player: alt.Player, appearance: Appearance) {
        if (appearance.sex === 0) {
            player.model = 'mp_f_freemode_01';
        } else {
            player.model = 'mp_m_freemode_01';
        }

        // Set Face
        player.clearBloodDamage();
        player.setHeadBlendData(
            appearance.faceMother,
            appearance.faceFather,
            0,
            appearance.skinMother,
            appearance.skinFather,
            0,
            parseFloat(appearance.faceMix.toString()),
            parseFloat(appearance.skinMix.toString()),
            0,
        );

        // Facial Features
        for (let i = 0; i < appearance.structure.length; i++) {
            const value = appearance.structure[i];
            player.setFaceFeature(i, value);
        }

        // Overlay Features - NO COLORS
        for (let i = 0; i < appearance.opacityOverlays.length; i++) {
            const overlay = appearance.opacityOverlays[i];
            player.setHeadOverlay(overlay.id, overlay.value, parseFloat(overlay.opacity.toString()));
        }

        // Hair - Tattoo
        const decorationsToSync = [];
        if (appearance.hairOverlay) {
            decorationsToSync.push(appearance.hairOverlay);
        }

        if (decorationsToSync.length >= 1) {
            alt.emitClient(player, SYSTEM_EVENTS.SET_PLAYER_DECORATIONS, decorationsToSync);
        }

        // Hair - Supports DLC
        if (typeof appearance.hairDlc === 'undefined' || appearance.hairDlc === 0) {
            player.setClothes(2, appearance.hair, 0, 0);
        } else {
            player.setDlcClothes(appearance.hairDlc, 2, appearance.hair, 0, 0);
        }

        player.setHairColor(appearance.hairColor1);
        player.setHairHighlightColor(appearance.hairColor2);

        // Facial Hair
        player.setHeadOverlay(1, appearance.facialHair, appearance.facialHairOpacity);
        player.setHeadOverlayColor(1, 1, appearance.facialHairColor1, appearance.facialHairColor1);

        // Chest Hair
        if (appearance.chestHair !== null && appearance.chestHair !== undefined) {
            player.setHeadOverlay(10, appearance.chestHair, appearance.chestHairOpacity);
            player.setHeadOverlayColor(10, 1, appearance.chestHairColor1, appearance.chestHairColor1);
        }

        // Eyebrows
        player.setHeadOverlay(2, appearance.eyebrows, appearance.eyebrowsOpacity);
        player.setHeadOverlayColor(2, 1, appearance.eyebrowsColor1, appearance.eyebrowsColor1);

        // Decor
        for (let i = 0; i < appearance.colorOverlays.length; i++) {
            const overlay = appearance.colorOverlays[i];
            const color2 = overlay.color2 ? overlay.color2 : overlay.color1;

            player.setHeadOverlay(overlay.id, overlay.value, parseFloat(overlay.opacity.toString()));
            player.setHeadOverlayColor(overlay.id, 1, overlay.color1, color2);
        }

        // Eyes
        player.setEyeColor(appearance.eyes);
    },
    /**
     * Updates synced meta for the current player.
     * Basically updates data that may not be fully accessible everywhere.
     * @memberof SyncPrototype
     */
    syncedMeta(player: alt.Player): void {
        player.setSyncedMeta(PLAYER_SYNCED_META.PING, player.ping);
        player.setSyncedMeta(PLAYER_SYNCED_META.POSITION, player.pos);
        player.setSyncedMeta(PLAYER_SYNCED_META.WANTED_LEVEL, player.wanted);
    },
    playTime(player: alt.Player): void {
        const data = Athena.document.character.get(player);
        const newHours = (data?.hours ?? 0) + 0.0166666666666667;
        Athena.document.character.set(player, 'hours', newHours);
        Athena.events.player.trigger('increased-play-time', player, newHours);
    },
};

function override<Key extends keyof typeof Sync>(functionName: Key, callback: typeof Sync[Key]): void {
    if (typeof funcs[functionName] === 'undefined') {
        alt.logError(`Athena.player.sync does not provide an export named ${functionName}`);
    }

    funcs[functionName] = callback;
}

const funcs: typeof Sync & { override?: typeof override } = {
    ...Sync,
    override,
};

export default funcs;
