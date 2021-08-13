import * as alt from 'alt-server';
import { Interior } from '../../shared/interfaces/Interior';
import { Vector3 } from '../../shared/interfaces/Vector';

export interface InteriorInfo extends Interior {
    /**
     * The ColShape used to enter the interior.
     * @type {alt.Colshape}
     * @memberof InteriorInfo
     */
    outsideShape?: alt.Colshape;

    /**
     * The position to use to initialize the inside ColShape.
     * @type {Vector3}
     * @memberof InteriorInfo
     */
    insidePosition?: Vector3;

    /**
     * The position to use to initialize the outside ColShape.
     * @type {Vector3}
     * @memberof InteriorInfo
     */
    outsidePosition?: Vector3;

    /**
     * The ColShape used to exit the interior.
     * This ColShape is only created when a player is 'entering' the interior.
     * @type {alt.Colshape}
     * @memberof InteriorInfo
     */
    insideShape?: alt.Colshape;

    /**
     * The IPL to load if necessary when 'entering' the interior.
     * @type {string}
     * @memberof InteriorInfo
     */
    ipl?: string;

    /**
     * List of players inside of the interior.
     * Does not remove players who logout or are no longer valid.
     * Check for validity yourself if you use this.
     * @type {Array<alt.Player>}
     * @memberof InteriorInfo
     */
    players?: Array<alt.Player>;
}
