import * as alt from 'alt-server';
import { RGB } from '../../../../shared/interfaces/rgb';
import { PolygonShape } from '../../../../server/extensions/extColshape';
import VehicleFuncs from '../../../../server/extensions/vehicleFuncs';
import { sha256Random } from '../../../../server/utility/encryption';
import { RGBA } from 'alt-shared';
import { VehicleEvents } from '../../../../server/events/vehicleEvents';
import { ATHENA_EVENTS_VEHICLE } from '../../../../shared/enums/athenaEvents';
import { Paintshop_View_Events } from '../../shared/events';
import { IPaintShop, iPaintshopSync } from '../../shared/interfaces';
import { VEHICLE_COLOR_PAINTS } from '../../shared/paints';
import { PAINT_SHOPS } from './shops';
import { ServerBlipController } from '../../../../server/systems/blip';
import { Athena } from '../../../../server/api/athena';
import { PAINTSHOP_LOCALE } from '../../shared/locales';

const shops: Array<IPaintShop> = [];
const inShop = {};

class InternalFunctions {
    /**
     * Update the vehicle paint based on data.
     * @param vehicle - The vehicle to update.
     */
    static updatePaint(vehicle: alt.Vehicle) {
        if (!vehicle.data?.tuning) return;

        if (vehicle.data.tuning.primaryColor && !vehicle.data.tuning.secondaryColor)
            vehicle.data.tuning.secondaryColor = vehicle.data.tuning.primaryColor;

        if (vehicle.data.tuning.secondaryColor && !vehicle.data.tuning.primaryColor)
            vehicle.data.tuning.primaryColor = vehicle.data.tuning.secondaryColor;

        if (vehicle.data.tuning.primaryColor) {
            if (typeof vehicle.data.tuning.primaryColor == 'object')
                vehicle.customPrimaryColor = new alt.RGBA(
                    vehicle.data.tuning.primaryColor.r,
                    vehicle.data.tuning.primaryColor.g,
                    vehicle.data.tuning.primaryColor.b,
                );
            else vehicle.primaryColor = vehicle.data.tuning.primaryColor;
        }

        if (vehicle.data.tuning.secondaryColor) {
            if (typeof vehicle.data.tuning.secondaryColor == 'object')
                vehicle.customSecondaryColor = new alt.RGBA(
                    vehicle.data.tuning.secondaryColor.r,
                    vehicle.data.tuning.secondaryColor.g,
                    vehicle.data.tuning.secondaryColor.b,
                );
            else vehicle.secondaryColor = vehicle.data.tuning.secondaryColor;
        }
    }

    static previewPaint(
        player: alt.Player,
        color: number | RGBA,
        color2: number | RGBA,
        finish1: number,
        finish2: number,
        pearl: number = -1,
    ) {
        if (!inShop[player.id]) {
            return;
        }

        if (!player.vehicle) {
            return;
        }

        if (typeof color === 'number') {
            player.vehicle.primaryColor = color as number;
            player.vehicle.secondaryColor = color2 as number;
        } else {
            player.vehicle.primaryColor = finish1;
            player.vehicle.secondaryColor = finish2;

            player.vehicle.customPrimaryColor = color as RGBA;
            player.vehicle.customSecondaryColor = color2 as RGBA;

            if (pearl >= 0) {
                player.vehicle.pearlColor = pearl;
            }
        }
    }
}

export class PaintShopView {
    static init() {
        for (let i = 0; i < PAINT_SHOPS.length; i++) {
            PaintShopView.register(PAINT_SHOPS[i]);
        }

        alt.onClient(Paintshop_View_Events.PREVIEW_PAINT, InternalFunctions.previewPaint);
        alt.onClient(Paintshop_View_Events.OPEN, PaintShopView.open);
        alt.onClient(Paintshop_View_Events.PURCHASE, PaintShopView.purchase);
        alt.onClient(Paintshop_View_Events.CLOSE, PaintShopView.close);
        VehicleEvents.on(ATHENA_EVENTS_VEHICLE.SPAWNED, InternalFunctions.updatePaint);
    }

    /**
     * Update the vehicle's paintjob and remove the player from the inShop array.
     * Restores the previous paint job that was applied to the vehicle.
     * @param player - alt.Player - The player who is opening the paint shop.
     * @returns Nothing.
     */
    static close(player: alt.Player) {
        if (!player.vehicle) {
            return;
        }

        InternalFunctions.updatePaint(player.vehicle);
        delete inShop[player.id];
    }

    /**
     * Register a Vehicle Paint Shop
     * @static
     * @param {IPaintShop} shop
     * @return {*}  {string}
     * @memberof PaintShopView
     */
    static register(shop: IPaintShop): string {
        if (!shop.uid) {
            shop.uid = sha256Random(JSON.stringify(shop));
        }

        const index = shops.findIndex((x) => x.uid === shop.uid);
        if (index >= 0) {
            console.error(new Error(`Shop with ${shop.uid} is a duplicate.`));
            return null;
        }

        ServerBlipController.append({
            text: PAINTSHOP_LOCALE.PAINTSHOP_LABEL,
            color: 48,
            sprite: 72,
            scale: 1,
            shortRange: true,
            pos: shop.vertices[0],
            uid: `paint-shop-${shop.uid}`,
        });

        const polygon = new PolygonShape(
            shop.vertices[0].z - 2.5,
            shop.vertices[0].z + 2.5,
            shop.vertices,
            true,
            false,
        );
        polygon.addEnterCallback(PaintShopView.enter);
        polygon.addLeaveCallback(PaintShopView.leave);
        return shop.uid;
    }

    /**
     * When the player enters the polygon, they will be able to open the paint shop.
     * This function is triggered when a player has entered the PolygonShape.
     * @param {PolygonShape} polygon - PolygonShape
     * @param player - alt.Player
     * @returns Nothing.
     */
    static enter(polygon: PolygonShape, player: alt.Player) {
        if (!(player instanceof alt.Player)) {
            return;
        }

        if (!player.vehicle) {
            Athena.player.emit.notification(player, PAINTSHOP_LOCALE.MUST_BE_IN_A_VEHICLE);
            return;
        }
        
        if (!player.vehicle.data || player.vehicle.isTemporary) {
            Athena.player.emit.notification(player, PAINTSHOP_LOCALE.CANNOT_BE_MODIFIED);
            return;
        }

        if (player.vehicle.driver.id !== player.id) {
            return;
        }

        inShop[player.id] = true;

        Athena.player.emit.sound2D(player, 'shop_enter', 0.5);
        Athena.player.emit.interactionAdd(player, {
            keyPress: 'E',
            description: PAINTSHOP_LOCALE.OPEN_MENU,
            uid: polygon.uid,
        });
        Athena.player.emit.interactionTemporary(player, Paintshop_View_Events.OPEN);
    }

    /**
     * When a player leaves the shop, the shop will be removed from the player's interaction list.
     * Removes all temporary interactions that were created in the PolygonShape.
     * @param {PolygonShape} polygon - The polygon that the player is leaving.
     * @param player - alt.Player - The player that is leaving the shop.
     * @returns Nothing.
     */
    static leave(polygon: PolygonShape, player: alt.Player) {
        if (!(player instanceof alt.Player)) {
            return;
        }

        inShop[player.id] = false;
        delete inShop[player.id];
        Athena.player.emit.interactionRemove(player, polygon.uid);
        Athena.player.emit.interactionTemporary(player, null);
    }

    /**
     * Opens the paint shop for the player
     * @param player - alt.Player
     * @returns The `alt.emitClient` function returns a `Promise` object.
     */
    static open(player: alt.Player) {
        if (!player.vehicle || player.vehicle.driver !== player) {
            return;
        }

        if (!player.vehicle.data || player.vehicle.isTemporary) {
            return;
        }

        if (!VehicleFuncs.hasOwnership(player, player.vehicle)) {
            return;
        }

        if (!inShop[player.id]) {
            return;
        }

        const syncData: iPaintshopSync = {
            color:
                typeof player.vehicle.data.tuning?.primaryColor === 'object' //
                    ? player.vehicle.data.tuning.primaryColor
                    : { r: 255, g: 255, b: 255 },
            color2:
                typeof player.vehicle.data.tuning?.secondaryColor === 'object' //
                    ? player.vehicle.data.tuning.secondaryColor
                    : { r: 255, g: 255, b: 255 },
            finish1:
                typeof player.vehicle.data.tuning?.primaryFinish === 'number' //
                    ? player.vehicle.data.tuning.primaryFinish
                    : VEHICLE_COLOR_PAINTS.MATTE,
            finish2:
                typeof player.vehicle.data.tuning?.secondaryFinish === 'number' //
                    ? player.vehicle.data.tuning.secondaryFinish
                    : VEHICLE_COLOR_PAINTS.MATTE,
            pearl:
                typeof player.vehicle.data.tuning?.pearlColor === 'number' //
                    ? player.vehicle.data.tuning.pearlColor
                    : 0,
        };

        alt.emitClient(player, Paintshop_View_Events.OPEN, syncData);
    }

    /**
     * It takes in a player, the color, color2, finish1, finish2, and pearl and updates the vehicle's
     * color, color2, finish1, finish2, and pearl
     * @param player - alt.Player - The player who is purchasing the vehicle.
     * @param {RGBA | number} color - The primary color of the vehicle.
     * @param {RGBA | number} color2 - The second color of the vehicle.
     * @param {number} finish1 - number
     * @param {number} finish2 - number
     * @param {number} pearl - number
     * @returns Nothing.
     */
    static purchase(
        player: alt.Player,
        color: RGBA | number,
        color2: RGBA | number,
        finish1: number,
        finish2: number,
        pearl: number,
    ) {
        if (!player.vehicle || player.vehicle.driver !== player) {
            return;
        }

        if (!inShop[player.id]) {
            return;
        }

        if (player.vehicle.isTemporary) {
            return;
        }

        if (!VehicleFuncs.hasOwnership(player, player.vehicle)) {
            return;
        }

        if (color !== undefined && color !== null) {
            if (!player.vehicle.data.tuning) player.vehicle.data.tuning = {};
            player.vehicle.data.tuning.primaryColor = color;
        }

        if (color2 !== undefined && color2 !== null) {
            if (!player.vehicle.data.tuning) player.vehicle.data.tuning = {};
            player.vehicle.data.tuning.secondaryColor = color;
        }

        if (finish1 !== undefined && finish1 !== null) {
            if (!player.vehicle.data.tuning) player.vehicle.data.tuning = {};
            player.vehicle.data.tuning.primaryFinish = finish1;
        }

        if (finish2 !== undefined && finish2 !== null) {
            if (!player.vehicle.data.tuning) player.vehicle.data.tuning = {};
            player.vehicle.data.tuning.secondaryFinish = finish2;
        }

        if (pearl !== undefined && pearl !== null) {
            if (!player.vehicle.data.tuning) player.vehicle.data.tuning = {};
            player.vehicle.data.tuning.pearlColor = pearl;
        }

        InternalFunctions.updatePaint(player.vehicle);
        VehicleFuncs.save(player.vehicle, player.vehicle.data);
    }
}
