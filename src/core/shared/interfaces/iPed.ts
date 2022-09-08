import { Vector3 } from './vector';
import { Animation } from './animation';
import { Weapon } from '../information/weaponList';

export interface IPed {
    /**
     * Position of the Ped in a 3D space.
     * @type {Vector3}
     * @memberof IPed
     */
    pos: Vector3;

    /**
     * The model name this Ped.
     * @type {string}
     * @memberof IPed
     */
    model: string;

    /**
     * The rotation of this Ped. 0 - 360
     * @type {number}
     * @memberof IPed
     */
    heading?: number;

    /**
     * The max distance this Ped should render at.
     * @type {number}
     * @memberof IPed
     */
    maxDistance?: number;

    /**
     * A unique identifier for this Ped.
     * @type {string}
     * @memberof IPed
     */
    uid: string;

    /**
     * A list of random animations to play on this pedestrian.
     * @type {Animation[]}
     * @memberof IPed
     */
    animations?: Animation[];

    /**
     * Should the appearance of this ped be randomized when spawned?
     * @type {boolean}
     * @memberof IPed
     */
    randomizeAppearance?: boolean;

    /**
     * Local Ped ID.
     * Do not actually fill this out.
     * @type {number}
     * @memberof IPed
     */
    local?: number;

    /**
     * Local Ped Info
     * Do not automatically fill this out.
     * @type {boolean}
     * @memberof IPed
     */
    isBeingCreated?: boolean;

    /**
     * Will show across all dimensions.
     * @type {number}
     * @memberof IPed
     */
    dimension?: number;

    
    /**
     * Will the ped dispawn 10 minutes after death?
     * default: true
     * @type {boolean}
     * @memberof IPed
     */
     dispawn10MinutesAfterDeath?: boolean;

     /**
      * Will the ped be invicible?
      * @type {boolean}
      * @memberof IPed
      */
     invicible?: boolean;
 
     /**
      * Will the ped be able to ragdoll?
      * @type {boolean}
      * @memberof IPed
      */
     ragdoll?: boolean;
 
     /**
      * Will the ped be able to recieve critical damages?
      * @type {boolean}
      * @memberof IPed
      */
     sufferCriticalHits?: boolean;
 
     /**
      * Will the ped be able to get targeted?
      * @type {boolean}
      * @memberof IPed
      */
     canBeTargeted?: boolean;
 
     canUseCover?: boolean;
 
     canUseVehicles?: boolean;
 
     canDoDrivebys?: boolean;
 
     canLeaveVehicle?: boolean;
 
     blindFireWhenInCover?: boolean;
 
     canTauntInVehicle?: boolean;
 
     canChaseTargetOnFoot?: boolean;
 
     willDragInjueredPedsToSafety?: boolean;
 
     perfectAccuracy?: boolean;
 
     maintainMinDistanceToTarget?: boolean;
 
     canUsePeekingVariations?: boolean;
 
     canCommandeerVehicles?: boolean;
 
     canFlank?: boolean;
 
     disableFleeFromCombat?: boolean;
 
 
     /**
      * Will the ped be able to collide with other entities?
      * @type {boolean}
      * @memberof IPed
      */
     collision?: boolean;
 
     /**
      * The number of milisecs passed after the ped's death.
      * You should not set this.
      * @type {number}
      * @memberof IPed
      */
     msPastDeath?: number
 
     /**
      * The character's sex for generating customName
      * @type {string}
      * @memberof IPed
      */
     sex?: "male" | "female";
 
     /**
      * You can set a custom InCharacter name for the ped, it generates one by default.
      * @type {string}
      * @memberof IPed
      */
     customName?: string,
     
    /**
     * You can give a weapon to the PED. Will not equip by default.
     * @type {Weapon}
     * @memberof IPed
     */
    weapon?: Weapon,

    /**
     * Determines whether the ped has its weapon equipped or not
     * @type {Boolean}
     * @memberof IPed
     */
    isWeaponEquipped?: Boolean

    isDead?: boolean,
}
