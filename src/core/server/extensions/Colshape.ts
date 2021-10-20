import * as alt from 'alt-server';
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
