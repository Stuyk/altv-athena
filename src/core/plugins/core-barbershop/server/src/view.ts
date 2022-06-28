import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { EQUIPMENT_TYPE } from '../../../../shared/enums/equipmentType';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { BarbershopEvents } from '../../shared/events';
import { BarbershopData } from '../../shared/interfaces';
import { hairOverlayInfo } from '../../shared/overlays';

/**
 * Offer to cut hair for other players.
 * Key is the Hair Dresser's ID
 * Value is the Hair Dresser's Customer
 * @type {*} */
const offers: { [from: string]: number } = {};

/**
 * Key is the Hair Dresser's ID
 * Value is the Hair Dresser's Customer
 * Can also be same user.
 * @type {*} */
const sessions: { [from: string]: number } = {};

export class InternalFunctions {
    /**
     * Initialize events and functions for handling sessions.
     *
     * @static
     * @memberof InternalFunctions
     */
    static init() {
        alt.on('playerDisconnect', InternalFunctions.handleDisconnect);
    }

    /**
     * Automatically ends the hairstyle session if present.
     *
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof InternalFunctions
     */
    static handleDisconnect(hairDresser: alt.Player) {
        const hairDresserID = Athena.systems.identifier.getIdByStrategy(hairDresser);

        if (!sessions[hairDresserID]) {
            return;
        }

        const customer = alt.Player.all.find((x) => x.id.toString() === sessions[hairDresserID].toString());
        delete sessions[hairDresserID];

        if (!customer || !customer.valid) {
            return;
        }

        Athena.player.set.frozen(customer, false);
        Athena.player.emit.notification(customer, `~r~Hair Dresser Disconnected`);
    }
}

export class BarbershopView {
    static init() {
        InternalFunctions.init();
        alt.onClient(BarbershopEvents.ServerClientEvents.UPDATE, BarbershopView.update);
        alt.onClient(BarbershopEvents.ServerClientEvents.CLOSE, BarbershopView.close);
        alt.onClient(BarbershopEvents.ServerClientEvents.SAVE, BarbershopView.save);
    }

    static save() {
        //
    }

    static close(hairDresser: alt.Player) {
        // bye
    }

    /**
     * Sends an offer from a hair dresser to a customer.
     * If the customer is 'self' then it will automatically open the WebView.
     *
     * @static
     * @param {alt.Player} hairDresser
     * @param {alt.Player} customer
     * @return {*}
     * @memberof BarbershopView
     */
    static offer(hairDresser: alt.Player, customer: alt.Player) {
        const hairDresserID = Athena.systems.identifier.getIdByStrategy(hairDresser);
        const customerID = Athena.systems.identifier.getIdByStrategy(customer);

        if (hairDresserID === customerID) {
            sessions[hairDresserID] = customerID;
            BarbershopView.open(hairDresser);
            return;
        }

        offers[hairDresserID] = customerID;
        Athena.player.emit.message(hairDresser, `You have offered ${customer.data.name} as haircut session.`);
        Athena.player.emit.message(
            customer,
            `You have been offered a haircut session by ${hairDresser.data.name}. /hairaccept ${hairDresserID}`,
        );
    }

    /**
     * Starts a haircut session with a hair dresser that has offered to cut.
     * Customer must specify their ID to accept it.
     *
     * As well as be in range.
     *
     * @static
     * @param {alt.Player} customer
     * @return {void}
     * @memberof BarbershopView
     */
    static accept(customer: alt.Player, _hairDresserID: number): void {
        const hairDresser = Athena.systems.identifier.getPlayer(_hairDresserID);

        if (!hairDresser || !hairDresser.valid) {
            Athena.player.emit.notification(customer, `~r~Could not find the hairdresser.`);
            return;
        }

        if (!offers[_hairDresserID] || typeof _hairDresserID === 'undefined') {
            Athena.player.emit.notification(customer, `~r~Could not find the hairdresser.`);
            return;
        }

        const customerID = Athena.systems.identifier.getIdByStrategy(customer);
        if (offers[_hairDresserID].toString() !== customerID.toString()) {
            Athena.player.emit.notification(customer, `~r~Hair dresser is currently with another customer.`);
            return;
        }

        delete offers[_hairDresserID];
        sessions[_hairDresserID] = customerID;
        BarbershopView.open(hairDresser);
    }

    /**
     * Open a barbershop instance.
     * If a hair dresser instance is not specified, the player will cut the hair themself.
     * Author Note: `If I can cut my own hair, you can too.`
     *
     * @static
     * @param {alt.Player} hairDresser
     * @memberof BarbershopView
     */
    static async open(hairDresser: alt.Player) {
        const hairDresserID = Athena.systems.identifier.getIdByStrategy(hairDresser);
        let customer: alt.Player;

        if (!sessions[hairDresserID]) {
            sessions[hairDresserID] = hairDresserID;
            customer = hairDresser;
        } else {
            customer = Athena.systems.identifier.getPlayer(sessions[hairDresserID]);
        }

        await Athena.player.inventory.unequip(customer, EQUIPMENT_TYPE.HAT);

        const isSelfService = sessions[hairDresserID] === hairDresserID;
        const hairDlc = customer.getDlcClothes(2);

        const makeupInfo = customer.data.appearance.opacityOverlays.find((x) => x.id === 4);
        const makeupColorInfo = customer.data.appearance.colorOverlays.find((x) => x.id === 4);
        const barberData: BarbershopData = {
            sex: customer.data.appearance.sex,
            dlc: hairDlc.dlc,
            hair: hairDlc.drawable,
            hairColor1: customer.data.appearance.hairColor1,
            hairColor2: customer.data.appearance.hairColor2,
            hairOverlay: customer.data.appearance.hairOverlay,
            eyeIndex: customer.data.appearance.eyebrows,
            eyeColor1: customer.data.appearance.eyebrowsColor1,
            eyeOpacity: customer.data.appearance.eyebrowsOpacity,
            beardIndex: customer.data.appearance.facialHair ? 0 : customer.data.appearance.facialHair,
            beardColor1: customer.data.appearance.facialHairColor1,
            beardOpacity: customer.data.appearance.facialHairOpacity,
            makeupIndex: makeupInfo && makeupInfo.value ? makeupInfo.value : 0,
            makeupColor1: makeupColorInfo.color1,
            makeupOpacity: makeupInfo && makeupInfo.opacity ? makeupInfo.opacity : 0,
        };

        console.log(barberData);

        alt.emitClient(hairDresser, BarbershopEvents.ServerClientEvents.OPEN, isSelfService, barberData);
    }

    /**
     * Event to update player hair via another player or self.
     *
     * @static
     * @param {alt.Player} hairDresser
     * @param {BarbershopData} data
     * @return {*}
     * @memberof BarbershopView
     */
    static update(hairDresser: alt.Player, data: BarbershopData) {
        const hairDresserID = Athena.systems.identifier.getIdByStrategy(hairDresser);

        if (!sessions[hairDresserID]) {
            BarbershopView.close(hairDresser);
            return;
        }

        const customer = Athena.systems.identifier.getPlayer(sessions[hairDresserID]);
        if (!customer || !customer.valid) {
            BarbershopView.close(hairDresser);
            return;
        }

        const hairOverlay = hairOverlayInfo[data.hairFullName];
        alt.emitClient(customer, SYSTEM_EVENTS.SET_PLAYER_DECORATIONS, [hairOverlay]);

        if (data.dlc === 0) {
            customer.setClothes(2, data.hair, 0, 0);
        } else {
            customer.setDlcClothes(data.dlc, 2, data.hair, 0, 0);
        }

        customer.setHairColor(data.hairColor1);
        customer.setHairHighlightColor(data.hairColor2);

        // Facial Hair
        customer.setHeadOverlay(1, data.beardIndex, data.beardOpacity);
        customer.setHeadOverlayColor(1, 1, data.beardColor1, data.beardColor1);

        // Eyebrows
        customer.setHeadOverlay(2, data.eyeIndex, data.eyeOpacity);
        customer.setHeadOverlayColor(2, 1, data.eyeColor1, data.eyeColor1);
    }
}
