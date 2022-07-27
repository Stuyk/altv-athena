import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Interaction } from '../../shared/interfaces/interaction';
import { Vector2, Vector3 } from '../../shared/interfaces/vector';
import { sha256Random } from '../utility/encryption';

const DEFAULT_INTERACTION_HEIGHT = 3;

export class InteractionShape extends alt.ColshapeCylinder {
    interaction: Interaction = {};

    constructor(interaction: Required<Interaction>) {
        super(
            interaction.position.x,
            interaction.position.y,
            interaction.position.z,
            interaction.range,
            interaction.height ? interaction.height : DEFAULT_INTERACTION_HEIGHT,
        );

        // Set the dimension based on specifications from the interaction interface
        if (this.dimension === undefined || this.dimension === null) {
            this.dimension = 0;
        } else {
            this.dimension = interaction.dimension;
        }

        this.interaction = interaction;
    }
}

export class GarageSpaceShape extends alt.ColshapeSphere {
    private rotation: Vector3;
    private isOpen: boolean = true;
    isGarage: boolean = true;

    constructor(position: alt.IVector3, rotation: Vector3, radius: number) {
        super(position.x, position.y, position.z, radius);
        this.rotation = rotation;
    }

    setSpaceStatus(value: boolean) {
        this.isOpen = value;
    }

    getPositionAndRotation() {
        return { position: this.pos, rotation: this.rotation };
    }

    getSpaceStatus() {
        return this.isOpen;
    }
}

export class PolygonShape extends alt.ColshapePolygon {
    uid: string;
    vertices: Array<Vector2>;
    isPlayerOnly: boolean;
    isVehicleOnly: boolean;
    isPolygonShape = true;
    isDebug = false;

    private enterCallbacks: Array<(shape: PolygonShape, entity: alt.Vehicle | alt.Player | alt.Entity) => void> = [];
    private leaveCallbacks: Array<(shape: PolygonShape, entity: alt.Vehicle | alt.Player | alt.Entity) => void> = [];

    /**
     * Creates an expensive instance of PolygonShape.
     *
     * Enter / Exit can be fetched with 'entityEnterColshape' and 'entityLeaveColshape' events
     *
     * @param {number} minZ The floor level of the polygon
     * @param {number} maxZ The max height of the polygon
     * @param {Array<IVector2>} vertices An array of {x, y} to determine where to draw the polygon around
     * @memberof PolygonShape
     */
    constructor(
        minZ: number,
        maxZ: number,
        vertices: Vector2[] | Vector3[],
        isPlayerOnly: boolean,
        isVehicleOnly: boolean,
        debug = false,
    ) {
        const processedVertices = vertices.map((pos) => {
            return new alt.Vector2(pos.x, pos.y);
        });

        super(minZ, maxZ, processedVertices);
        this.vertices = processedVertices;
        this.isPolygonShape = true;
        this.isPlayerOnly = isPlayerOnly;
        this.isVehicleOnly = isVehicleOnly;
        this.uid = sha256Random(JSON.stringify(this));
        this.isDebug = debug;
    }

    addEnterCallback(callback: (shape: PolygonShape, entity: alt.Vehicle | alt.Player | alt.Entity) => void) {
        this.enterCallbacks.push(callback);
    }

    addLeaveCallback(callback: (shape: PolygonShape, entity: alt.Vehicle | alt.Player | alt.Entity) => void) {
        this.leaveCallbacks.push(callback);
    }

    invokeEnterCallbacks(entity: alt.Entity) {
        for (let i = 0; i < this.enterCallbacks.length; i++) {
            this.enterCallbacks[i](this, entity);
        }
    }

    invokeLeaveCallbacks(entity: alt.Entity) {
        for (let i = 0; i < this.leaveCallbacks.length; i++) {
            this.leaveCallbacks[i](this, entity);
        }
    }
}

alt.on('entityEnterColshape', (colshape: alt.Colshape, entity: alt.Entity) => {
    if (!(colshape instanceof PolygonShape)) {
        return;
    }

    if (!colshape.isPolygonShape) {
        return;
    }

    if (entity instanceof alt.Player && colshape.isPlayerOnly) {
        colshape.invokeEnterCallbacks(entity);

        if (colshape.isDebug) {
            alt.emitClient(entity, SYSTEM_EVENTS.DEBUG_COLSHAPE_VERTICES, colshape.uid, colshape.vertices);
        }
    }

    if (entity instanceof alt.Vehicle && colshape.isVehicleOnly) {
        colshape.invokeEnterCallbacks(entity);

        if (colshape.isDebug && entity.driver) {
            alt.emitClient(entity.driver, SYSTEM_EVENTS.DEBUG_COLSHAPE_VERTICES, colshape.uid, colshape.vertices);
        }
    }
});

alt.on('entityLeaveColshape', (colshape: alt.Colshape, entity: alt.Entity) => {
    if (!(colshape instanceof PolygonShape)) {
        return;
    }

    if (!colshape.isPolygonShape) {
        return;
    }

    if (entity instanceof alt.Player && colshape.isPlayerOnly) {
        colshape.invokeLeaveCallbacks(entity);
    }

    if (entity instanceof alt.Vehicle && colshape.isVehicleOnly) {
        colshape.invokeLeaveCallbacks(entity);
    }
});
