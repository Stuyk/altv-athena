import * as alt from 'alt-server';
import { Interaction } from '../../shared/interfaces/interaction';
import { Vector3 } from '../../shared/interfaces/vector';
import { sha256Random } from '../utility/encryption';

const DEFAULT_INTERACTION_HEIGHT = 3;

/**
 * Purpose of the ColShape is to easily call all callbacks added
 * to this ColShape so that it is easily deciphered.
 *
 * @export
 * @class BoundPlayerColShape
 * @extends {alt.ColshapeCylinder}
 */
export class BoundPlayerColShape extends alt.ColshapeCylinder {
    uid: string;
    enterCallbacks: Array<(colshape: alt.Colshape, player: alt.Player) => void>;
    leaveCallbacks: Array<(colshape: alt.Colshape, player: alt.Player) => void>;

    constructor(x: number, y: number, z: number, range: number, height: number) {
        super(x, y, z, range, height);
        this.enterCallbacks = [];
        this.leaveCallbacks = [];
        this.uid = `bound-player-colshape-${sha256Random(JSON.stringify(this))}`;
    }

    /**
     * Add a callback to this specific ColShape
     *
     * @param {(colshape: alt.Colshape, player: alt.Player) => void} callback
     * @memberof BoundColshape
     */
    addEnterCallback(callback: (colshape: alt.Colshape, player: alt.Player) => void) {
        this.enterCallbacks.push(callback);
    }

    /**
     * Invokes all callbacks bound to this ColShape.
     *
     * @param {alt.Player} player
     * @memberof BoundPlayerColShape
     */
    invokeEnter(player: alt.Player) {
        for (let i = 0; i < this.enterCallbacks.length; i++) {
            this.enterCallbacks[i](this, player);
        }
    }

    invokeLeave(player: alt.Player) {
        for (let i = 0; i < this.leaveCallbacks.length; i++) {
            this.leaveCallbacks[i](this, player);
        }
    }
}

export class InteractionShape extends alt.ColshapeCylinder {
    interaction: Interaction = {};

    constructor(interaction: Interaction) {
        super(
            interaction.position.x,
            interaction.position.y,
            interaction.position.z,
            interaction.range,
            DEFAULT_INTERACTION_HEIGHT,
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

alt.on('entityEnterColshape', (colshape: alt.Colshape, entity: alt.Entity) => {
    if (!(colshape instanceof BoundPlayerColShape)) {
        return;
    }

    if (!colshape.uid || !colshape.invokeEnter || !colshape.invokeLeave) {
        return;
    }



});
