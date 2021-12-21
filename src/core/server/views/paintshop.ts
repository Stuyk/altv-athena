import * as alt from 'alt-server';
import { View_Events_PaintShop } from '../../shared/enums/views';
import { IStreamPolygon } from '../../shared/interfaces/iStreamPolygon';
import { RGB } from '../../shared/interfaces/rgb';
import { Vector3 } from '../../shared/interfaces/vector';
import { playerFuncs } from '../extensions/Player';
import VehicleFuncs from '../extensions/VehicleFuncs';
import { ServerPolygonController } from '../streamers/polygon';
import { VehicleSystem } from '../systems/vehicle';
import { sha256Random } from '../utility/encryption';

interface IPaintShop {
    uid: string;
    cost: number;
    vertices: Array<Vector3>;
}

const shops: Array<IPaintShop> = [];
const inShop = {};

export class PainShopFunctions {
    static init() {
        const someShops: Array<IPaintShop> = [
            {
                cost: 500,
                uid: 'paint-shop-1',
                vertices: [
                    { x: -329.2366638183594, y: -141.3553009033203, z: 38.06044387817383 },
                    { x: -330.82879638671875, y: -145.72210693359375, z: 38.059635162353516 },
                    { x: -324.7835388183594, y: -147.92138671875, z: 38.063636779785156 },
                    { x: -323.1226501464844, y: -143.58056640625, z: 38.06044387817383 },
                ],
            },
        ];

        for (let i = 0; i < someShops.length; i++) {
            PainShopFunctions.register(someShops[i]);
        }
    }

    /**
     * Register a Vehicle Paint Shop
     * @static
     * @param {IPaintShop} shop
     * @return {*}  {string}
     * @memberof PainShopFunctions
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

        const polygon: IStreamPolygon = {
            vertices: shop.vertices,
            pos: shop.vertices[0],
            enterEventCall: PainShopFunctions.enter,
            leaveEventCall: PainShopFunctions.leave,
            maxY: 1.5,
            debug: true,
        };

        ServerPolygonController.append(polygon);
        return shop.uid;
    }

    static enter<T>(player: T | alt.Player, polygon: IStreamPolygon) {
        if (!(player instanceof alt.Player)) {
            return;
        }

        if (!player.vehicle) {
            return;
        }

        inShop[player.id] = true;

        playerFuncs.emit.createShard(player, { title: 'Paint Shop', text: 'Paint Your Vehicle', duration: 1500 });
        playerFuncs.emit.sound2D(player, 'shop_enter', 0.5);
        playerFuncs.emit.interactionAdd(player, {
            keyPress: 'E',
            description: 'Open Paint Panel',
            uid: polygon.uid,
        });
        playerFuncs.emit.interactionTemporary(player, View_Events_PaintShop.Open);
    }

    static leave<T>(player: T, polygon: IStreamPolygon) {
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

        alt.emitClient(player, View_Events_PaintShop.Open);
    }

    static purchase(player: alt.Player, color1: RGB, color2: RGB) {
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

        player.vehicle.data.color = color1;
        player.vehicle.data.color2 = color2;
        VehicleFuncs.updateVehicleMods(player.vehicle);
        VehicleFuncs.save(player.vehicle, { color: player.vehicle.data.color, color2: player.vehicle.data.color2 });
    }
}

PainShopFunctions.init();
alt.onClient(View_Events_PaintShop.Open, PainShopFunctions.open);
alt.onClient(View_Events_PaintShop.Purchase, PainShopFunctions.purchase);
