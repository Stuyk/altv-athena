import * as alt from 'alt-server';
import { Vector3 } from '../../shared/interfaces/vector';
import { Interaction } from '../interface/Interaction';

export class InteractionShape extends alt.ColshapeCylinder {
    isInteraction: boolean = true;
    private interaction: Interaction = {};

    constructor(position: alt.IVector3, radius: number, height: number) {
        super(position.x, position.y, position.z, radius, height);
        this.interaction.position = position;
        this.isInteraction = true;
        this.playersOnly = true;
    }

    /**
     * Set the interaction functionality.
     * @param {Interaction} interaction
     * @memberof InteractionShape
     */
    setInteraction(interaction: Interaction): void {
        this.interaction = interaction;
    }

    /**
     * Get interaction functionality object.
     * @return {*}  {Interaction}
     * @memberof InteractionShape
     */
    getInteraction(): Interaction {
        return this.interaction;
    }

    /**
     * Set the unique identifier for this ColShape
     * @param {string} identifier
     * @memberof InteractionShape
     */
    setIdentifier(identifier: string): void {
        this.interaction.identifier = identifier;
    }

    /**
     * Get the identifier associated with this ColShape.
     * @return {string}
     * @memberof InteractionShape
     */
    getIdentifier(): string {
        return this.interaction.identifier;
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
