export default interface IVehicleOptical {
    /**
     * The spoiler of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    spoiler?: number;

    /**
     * The frontBumper of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    frontBumper?: number;

    /**
     * The rearBumper of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    rearBumper?: number;

    /**
     * The sideSkirt of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    sideSkirt?: number;

    /**
     * The exhaust of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    exhaust?: number;

    /**
     * The frontBumper of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */

     /**
     * The frame of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    frame?: number;

    /**
     * The grille of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    grille?: number;
    
    /**
     * The bonnet of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    bonnet?: number;
    
    /**
     * The (left)-wing of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    leftWing?: number;

    /**
     * The (right)-wing of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    rightWing?: number;

    /**
     * The roof of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    roof?: number;

    /**
     * The engine of the vehicle
     * @type {number} 0 - 4. Fixed value.
     * @memberof IVehicleOptical
     */
    engine?: number;

     /**
     * The brakes of the vehicle
     * @type {number} 0 - 3. Fixed value.
     * @memberof IVehicleOptical
     */
    brakes?: number;

    /**
     * The transmission of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
     transmission?: number;

    /**
     * The horns of the vehicle
     * @type {number} 0 - 51. Fixed Value.
     * @memberof IVehicleOptical
     */
    horns?: number;

    /**
     * The suspension of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
     suspension?: number;

    /**
     * The armor of the vehicle
     * @type {number} 0 - 5. Fixed Value.
     * @memberof IVehicleOptical
     */
    armor?: number;

    /**
     * The turbo of the vehicle
     * @type {number} 0 - 1. Fixed Value (false, true probably).
     * @memberof IVehicleOptical
     */
     turbo?: number;

    /**
     * The custom tire smoke of the vehicle
     * @type {number} 0 - 1. Fixed Value.
     * @memberof IVehicleOptical
     */
    customTireSmoke?: number;

    /**
     * The xenon-lights of the vehicle
     * @type {number} 0 - 1. Fixed Value.
     * @memberof IVehicleOptical
     */
    xenon?: number;

    /**
     * The front wheels of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    frontWheels?: number;

    /**
     * The back wheels of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    backWheels?: number; 
    
    /**
     * The plante holders of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    plateHolders?: number;

    /**
     * The plante vanity of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    plateVanity?: number;

    /**
     * The trim design of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    trimDesign?: number;

    /**
     * The ornaments of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    ornaments?: number;

    /**
     * The dial design of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    dialDesign?: number;

    /**
     * The door interior of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    doorInterior?: number;

    /**
     * The seats of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    seats?: number;

    /**
     * The steering wheel of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    steeringWheel?: number;

    /**
     * The shift lever of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    shiftLever?: number;

    /**
     * The plaques of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    plaques?: number;

    /**
     * The rear shelf of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    rearShelf?: number;

    /**
     * The trunk of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    trunk?: number;

    /**
     * The hydraulics of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    hydraulics?: number;

    /**
     * The engine block of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    engineBlock?: number;

    /**
     * The air filter of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    airFilter?: number;

    /**
     * The strut bar of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    strutBar?: number;

    /**
     * The arch cover of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    archCover?: number;

    /**
     * The antenna of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    antenna?: number;

    /**
     * The exterior parts of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    exteriorParts?: number;

    /**
     * The tank of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    tank?: number;

    /**
     * The door of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    door?: number;

    /**
     * The wheels rear or hydraulics of the vehicle (strange, idk alt:V wiki isn't sure about that either.)
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    wheelsRearOrHydraulics?: number;

    /**
     * The livery of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    livery?: number;

    /**
     * The primary color of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    primaryColor?: number;

    /**
     * The secondary color of the vehicle
     * @type {number} 0+ - Depending on the vehicle.
     * @memberof IVehicleOptical
     */
    secondaryColor?: number;
}