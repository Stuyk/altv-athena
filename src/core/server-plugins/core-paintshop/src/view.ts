import * as alt from 'alt-server';
import { RGB } from '../../../shared/interfaces/rgb';
import { Vector3 } from '../../../shared/interfaces/vector';
import { PolygonShape } from '../../../server/extensions/extColshape';
import { playerFuncs } from '../../../server/extensions/extPlayer';
import VehicleFuncs from '../../../server/extensions/vehicleFuncs';
import { sha256Random } from '../../../server/utility/encryption';
import { RGBA } from 'alt-shared';
import { VehicleEvents } from '../../../server/events/vehicleEvents';
import { ATHENA_EVENTS_VEHICLE } from '../../../shared/enums/athenaEvents';
import { Paintshop_View_Events } from '../../../shared-plugins/core-paintshop/events';
import { iPaintshopSync } from '../../../shared-plugins/core-paintshop/interfaces';
import { VEHICLE_COLOR_PAINTS } from '../../../shared-plugins/core-paintshop/paints';

interface IPaintShop {
    uid: string;
    cost: number;
    vertices: Array<Vector3>;
}

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
        const someShops: Array<IPaintShop> = [
            {
                // LSC Burton Carcer Way Paint Shop
                cost: 500,
                uid: 'paint-shop-1',
                vertices: [
                    { x: -329.2366638183594, y: -141.3553009033203, z: 38.06044387817383 },
                    { x: -330.82879638671875, y: -145.72210693359375, z: 38.059635162353516 },
                    { x: -324.7835388183594, y: -147.92138671875, z: 38.063636779785156 },
                    { x: -323.1226501464844, y: -143.58056640625, z: 38.06044387817383 },
                ],
            },
            {
                // LSC International Airport Greenwich Pkwy Paint Shop
                cost: 500,
                uid: 'paint-shop-2',
                vertices: [
                    { x: -1163.248291015625, y: -2012.6636962890625, z: 13.221923828125 },
                    { x: -1167.82421875, y: -2017.3055419921875, z: 13.221923828125 },
                    { x: -1171.068115234375, y: -2013.96923828125, z: 13.5421142578125 },
                    { x: -1166.5054931640625, y: -2009.4197998046875, z: 13.221923828125 },
                ],
            },
            {
                // LSC La Mesa Olympic Fwy Paint Shop
                cost: 500,
                uid: 'paint-shop-3',
                vertices: [
                    { x: 733.3450317382812, y: -1075.5692138671875, z: 22.2197265625 },
                    { x: 733.3450317382812, y: -1069.054931640625, z: 22.2197265625 },
                    { x: 738, y: -1069.068115234375, z: 22.2197265625 },
                    { x: 738, y: -1075.5692138671875, z: 22.2197265625 },
                ],
            },
            {
                //Benny's Strawberry Alta St Paint Shop
                cost: 500,
                uid: 'paint-shop-4',
                vertices: [
                    { x: -201.95603942871094, y: -1322.03076171875, z: 31.116455078125 },
                    { x: -195.45494079589844, y: -1322.017578125, z: 31.116455078125 },
                    { x: -195.45494079589844, y: -1326.6724853515625, z: 31.116455078125 },
                    { x: -201.95603942871094, y: -1326.6724853515625, z: 31.116455078125 },
                ],
            },
        ];

        for (let i = 0; i < someShops.length; i++) {
            PaintShopView.register(someShops[i]);
        }

        alt.onClient(Paintshop_View_Events.PREVIEW_PAINT, InternalFunctions.previewPaint);
        alt.onClient(Paintshop_View_Events.OPEN, PaintShopView.open);
        alt.onClient(Paintshop_View_Events.PURCHASE, PaintShopView.purchase);
        alt.onClient(Paintshop_View_Events.CLOSE, PaintShopView.close);
        VehicleEvents.on(ATHENA_EVENTS_VEHICLE.SPAWNED, InternalFunctions.updatePaint);
    }

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

    static enter(polygon: PolygonShape, player: alt.Player) {
        if (!(player instanceof alt.Player)) {
            return;
        }

        if (!player.vehicle) {
            playerFuncs.emit.notification(player, `Must be in a vehicle to use this.`);
            return;
        }

        if (player.vehicle.driver.id !== player.id) {
            return;
        }

        inShop[player.id] = true;

        // playerFuncs.emit.createShard(player, { title: 'Paint Shop', text: 'Paint Your Vehicle', duration: 1500 });
        playerFuncs.emit.sound2D(player, 'shop_enter', 0.5);
        playerFuncs.emit.interactionAdd(player, {
            keyPress: 'E',
            description: 'Open Paint Panel',
            uid: polygon.uid,
        });
        playerFuncs.emit.interactionTemporary(player, Paintshop_View_Events.OPEN);
    }

    static leave(polygon: PolygonShape, player: alt.Player) {
        if (!(player instanceof alt.Player)) {
            return;
        }

        inShop[player.id] = false;
        delete inShop[player.id];
        playerFuncs.emit.interactionRemove(player, polygon.uid);
        playerFuncs.emit.interactionTemporary(player, null);
    }

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
