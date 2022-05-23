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

const shops: Array<IPaintShop> = [];
const inShop = {};

class InternalFunctions {
    /**
     * Update the vehicle paint based on data.
     * @param vehicle - The vehicle to update.
     */
    static updatePaint(vehicle: alt.Vehicle) {
        // Handle Color Updates - Custom RGBA
        if (vehicle.data.color && vehicle.data.color.hasOwnProperty('r')) {
            if (!vehicle.data.color2) {
                vehicle.data.color2 = vehicle.data.color;
            }

            if (vehicle.data.finish1) {
                vehicle.primaryColor = vehicle.data.finish1;
            }

            if (vehicle.data.finish2) {
                vehicle.secondaryColor = vehicle.data.finish2;
            }

            vehicle.customPrimaryColor = vehicle.data.color as RGBA;
            vehicle.customSecondaryColor = vehicle.data.color2 as RGBA;

            if (vehicle.data.pearl >= 0) {
                vehicle.pearlColor = vehicle.data.pearl;
            }
        }

        // Handle Color Updates - GTA Colours
        if (vehicle.data.color && typeof vehicle.data.color === 'number') {
            if (!vehicle.data.color2) {
                vehicle.data.color2 = vehicle.data.color;
            }

            vehicle.primaryColor = vehicle.data.color as number;
            vehicle.secondaryColor = vehicle.data.color2 as number;
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
            text: 'Paint Shop',
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
            Athena.player.emit.notification(player, `Must be in a vehicle to use this.`);
            return;
        }

        if (player.vehicle.driver.id !== player.id) {
            return;
        }

        inShop[player.id] = true;

        Athena.player.emit.sound2D(player, 'shop_enter', 0.5);
        Athena.player.emit.interactionAdd(player, {
            keyPress: 'E',
            description: 'Open Paint Panel',
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

        if (player.vehicle.isTemporary) {
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
                typeof player.vehicle.data.color === 'object' //
                    ? player.vehicle.data.color
                    : { r: 255, g: 255, b: 255 },
            color2:
                typeof player.vehicle.data.color2 === 'object' //
                    ? player.vehicle.data.color2
                    : { r: 255, g: 255, b: 255 },
            finish1:
                typeof player.vehicle.data.finish1 === 'number' //
                    ? player.vehicle.data.finish1
                    : VEHICLE_COLOR_PAINTS.MATTE,
            finish2:
                typeof player.vehicle.data.finish2 === 'number' //
                    ? player.vehicle.data.finish2
                    : VEHICLE_COLOR_PAINTS.MATTE,
            pearl:
                typeof player.vehicle.data.pearl === 'number' //
                    ? player.vehicle.data.pearl
                    : 0,
        };

        alt.emitClient(player, Paintshop_View_Events.OPEN, syncData);
    }

    /**
     * It takes in a player, the color, color2, finish1, finish2, and pearl and updates the vehicle's
     * color, color2, finish1, finish2, and pearl
     * @param player - alt.Player - The player who is purchasing the vehicle.
     * @param {RGB | number} color - The primary color of the vehicle.
     * @param {RGB | number} color2 - The second color of the vehicle.
     * @param {number} finish1 - number
     * @param {number} finish2 - number
     * @param {number} pearl - number
     * @returns Nothing.
     */
    static purchase(
        player: alt.Player,
        color: RGB | number,
        color2: RGB | number,
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

        let whatToUpdate = {};

        if (color !== undefined && color !== null) {
            whatToUpdate['color'] = color;
        }

        if (color2 !== undefined && color2 !== null) {
            whatToUpdate['color2'] = color2;
        }

        if (finish1 !== undefined && finish1 !== null) {
            whatToUpdate['finish1'] = finish1;
        }

        if (finish2 !== undefined && finish2 !== null) {
            whatToUpdate['finish2'] = finish2;
        }

        if (pearl !== undefined && pearl !== null) {
            whatToUpdate['pearl'] = pearl;
        }

        Object.keys(whatToUpdate).forEach((key) => {
            player.vehicle.data[key] = whatToUpdate[key];
        });

        InternalFunctions.updatePaint(player.vehicle);
        VehicleFuncs.save(player.vehicle, whatToUpdate);
    }
}
