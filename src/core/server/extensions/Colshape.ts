import * as alt from 'alt-server';
import { Blip } from '../../shared/interfaces/Blip';
import { EventCall } from '../../shared/interfaces/EventCall';
import { Interaction } from '../../shared/interfaces/Interaction';
import { BlipController } from '../systems/blip';
import { distance2d } from '../utility/vector';

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
    setInteraction(interaction: Interaction) {
        this.interaction = interaction;
        this.populateBlip(interaction.blip);
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
     * Apply the blip for this interaction.
     * @param {Blip} blip
     * @memberof InteractionShape
     */
    setBlip(blip: Blip) {
        const oldBlip = this.interaction.blip ? { ...this.interaction.blip } : null;
        this.interaction.blip = blip;
        this.populateBlip(oldBlip);
    }

    /**
     * Add a callback event based on alt events when
     * a player interacts with this event.
     * @param {EventCall} event
     * @memberof InteractionShape
     */
    setEvent(event: EventCall) {
        this.interaction.event = event;
    }

    /**
     * Set the unique identifier for this ColShape
     * @param {string} identifier
     * @memberof InteractionShape
     */
    setIdentifier(identifier: string) {
        this.interaction.identifier = identifier;
    }

    /**
     * Adds text to the Colshape that displays on client-side.
     * @param {string} shortDesc
     * @param {string} [longDesc]
     * @memberof InteractionShape
     */
    setText(shortDesc: string, longDesc?: string) {
        this.interaction.shortDesc = shortDesc;
        this.interaction.longDesc = longDesc;
    }

    setType(uniqueType: string) {
        this.interaction.type = uniqueType;
    }

    getType(): string {
        return this.interaction.type;
    }

    getIdentifier(): string {
        return this.interaction.identifier;
    }

    /**
     * Get distance to this ColShape.
     * @param {alt.Player} player
     * @return {*}  {number}
     * @memberof InteractionShape
     */
    getDistance(entity: { pos: alt.IVector3 }): number {
        return distance2d(entity.pos, this.interaction.position);
    }

    private populateBlip(oldBlip: Blip) {
        if (oldBlip && oldBlip.uid) {
            BlipController.remove(oldBlip.uid);
        }

        BlipController.add(this.interaction.blip);
    }
}
