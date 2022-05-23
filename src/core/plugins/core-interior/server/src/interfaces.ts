import * as alt from 'alt-server';
import { Interior } from '../../shared/interfaces';

export interface InteriorInternal extends Interior {
    /**
     * Automatically generated dimension from interior system.
     * @type {number}
     * @memberof InteriorInternal
     */
    dimension: number;

    /**
     * The ColShape used to enter the interior.
     * @type {alt.Colshape}
     * @memberof InteriorInternal
     */
    outsideShape?: alt.Colshape;

    /**
     * The ColShape used to exit the interior.
     * This ColShape is only created when a player is 'entering' the interior.
     * @type {alt.Colshape}
     * @memberof InteriorInternal
     */
    insideShape?: alt.Colshape;

    /**
     * Players who were inside this interior.
     * May not always be accurate but should be pretty accurate.
     * @type {Array<number>}
     * @memberof InteriorInternal
     */
    players?: Array<number>;
}
