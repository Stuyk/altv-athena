import * as alt from 'alt-server';
import { View_Events_PaintShop } from '../../shared/enums/views';
import { RGB } from '../../shared/interfaces/rgb';
import { Vector3 } from '../../shared/interfaces/vector';
import { PolygonShape } from '../extensions/extColshape';
import { playerFuncs } from '../extensions/extPlayer';
import VehicleFuncs from '../extensions/vehicleFuncs';
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

        const polygon = new PolygonShape(
            shop.vertices[0].z - 2.5,
            shop.vertices[0].z + 2.5,
            shop.vertices,
            true,
            false,
        );
        polygon.addEnterCallback(PainShopFunctions.enter);
        polygon.addLeaveCallback(PainShopFunctions.leave);
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

        playerFuncs.emit.createShard(player, { title: 'Paint Shop', text: 'Paint Your Vehicle', duration: 1500 });
        playerFuncs.emit.sound2D(player, 'shop_enter', 0.5);
        playerFuncs.emit.interactionAdd(player, {
            keyPress: 'E',
            description: 'Open Paint Panel',
            uid: polygon.uid,
        });
        playerFuncs.emit.interactionTemporary(player, View_Events_PaintShop.Open);
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
