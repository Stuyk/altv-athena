export default interface IVehicleHandling {
    acceleration: number;

    /**
     * The bias between front and rear for the antiroll bar(0 front, 1 rear).
     * @type {number} 0 - 1
     * @memberof IVehicleHandling
     */
    antiRollBarBiasFront: number;

    /**
     * This value modify the weight transmission during an acceleration between the left and right.
     * @type {number} 0 - 1.2
     * @memberof IVehicleHandling
     */
    antiRollBarBiasRear: number;

    /**
     * The spring constant that is transmitted to the opposite wheel when under compression larger numbers are a larger force. Larger Numbers = less body roll.
     * @type {number} 0 - 3
     * @memberof IVehicleHandling
     */
    antiRollBarForce: number;

    /**
     * Determines the distribution of traction from front to rear.
     * @type {number} 0.325 - 0.95
     * @memberof IVehicleHandling
     */
    brakeBiasFront: number;

    brakeBiasRear: number;

    /**
     * Braking power for handbrake. Bigger number = harder braking.
     * @type {number} 0.01 - 6
     * @memberof IVehicleHandling
     */
    brakeForce: number;

    /**
     * This value modify the grip of the car when you're drifting and you release the gas. In general, it makes your car slide more on sideways movement. More than 0 make the car sliding on the same angle you're drifting and less than 0 make your car oversteer (not recommend to use more than 0.1 / -0.1 if you don't know what you're doing).
     * @type {number} 0 - 1.12
     * @memberof IVehicleHandling
     */
    camberStiffness: number;

    /**
     * This value shifts the center of gravity in meters from side to side (when in vehicle looking forward).
     * @type {{ x: number; y: number; z: number }} x: (-5 to 5) | y: (-5 to 5) | z: (-2 to 2)
     * @memberof IVehicleHandling
     */
    centreOfMassOffset: { x: number; y: number; z: number };

    /**
     * Clutch speed multiplier on down shifts, bigger number = faster shifts.
     * @type {number} 0.3 - 9
     * @memberof IVehicleHandling
     */
    clutchChangeRateScaleDownShift: number;

    /**
     * Clutch speed multiplier on up shifts, bigger number = faster shifts.
     * @type {number} 0.3 - 9
     * @memberof IVehicleHandling
     */
    clutchChangeRateScaleUpShift: number;

    /**
     * Multiplies the game's calculation of damage to the vehicle through collision.
     * @type {number} 0.005 - 2
     * @memberof IVehicleHandling
     */
    collisionDamageMult: number;

    /**
     * Multiplies the game's calculation of deformation damage.
     * @type {number}
     * @memberof IVehicleHandling
     */
    deformationDamageMult: number;

    /**
     * No Description
     * @type {number} 1.15 - 300
     * @memberof IVehicleHandling
     */
    downforceModifier: number;

    /**
     * This value is used to determine whether a vehicle is front, rear, or four wheel drive.
     * @type {number} 0 - 1
     * @memberof IVehicleHandling
     */
    driveBiasFront: number;

    /**
     * Describes how fast an engine will rev. For example an engine with a long stroke crank and heavy flywheel will take longer to redline than an engine with a short stroke and light flywheel.
     * @type {number} 0.1 - 2.5
     * @memberof IVehicleHandling
     */
    driveInertia: number;

    driveMaxFlatVel: number;

    /**
     * Multiplies the game's calculation of damage to the engine, causing explosion or engine failure.
     * @type {number} 0.01 - 2.5
     * @memberof IVehicleHandling
     */
    engineDamageMult: number;

    /**
     * Braking power for handbrake. Bigger number = harder braking.
     * @type {number} 0.01 - 6
     * @memberof IVehicleHandling
     */
    handBrakeForce: number;

    /**
     * Handling flags. Written in HEX. Rightmost digit is the first one.
     * No additional information on this property.
     * @type {number}
     * @memberof IVehicleHandling
     */
    handlingFlags: number;

    /**
     * Sets the drag coefficient on the rage physics archetype of the vehicle (proportional to velocity squared). Increase to simulate aerodynamic drag.
     * @type {number} 0.9 - 300
     * @memberof IVehicleHandling
     */
    initialDragCoeff: number;

    /**
     * This multiplier modifies the game's calculation of drive force (from the output of the transmission).
     * @type {number} 0 - 18
     * @memberof IVehicleHandling
     */
    initialDriveForce: number;

    /**
     * How many forward speeds a transmission contains.
     * @type {number} 1 - 6
     * @memberof IVehicleHandling
     */
    initialDriveGears: number;

    /**
     * Determines the speed at redline in top gear. Setting this value does not guarantee the vehicle will reach this speed. Multiply the number in the file by 0-82 to get the speed in mph or multiply by 1.32 to get kph.
     * @type {number} 10 - 328.6
     * @memberof IVehicleHandling
     */
    initialDriveMaxFlatVel: number;

    /**
     * How much traction is reduced at low speed, 0.0 means normal traction. It affects mainly car burnout (spinning wheels when car doesn't move) when pressing gas. Decreasing value will cause less burnout, less sliding at start. However, the higher value, the more burnout car gets. Optimal is 1.0.
     * @type {number} 0 - 2.2
     * @memberof IVehicleHandling
     */
    lowSpeedTractionLossMult: number;

    /**
     * This value modify the weight transmission during an acceleration between the left and right.
     * @type {number} 0 - 1.2
     * @memberof IVehicleHandling
     */
    rollCentreHeightFront: number;

    rollCentreHeightRear: number;

    /**
     * This value is a multiplier of the game's calculation of the angle a steer wheel will turn while at full turn. Steering lock is directly related to over or understeer / turning radius.
     * @type {number} 20 - 55
     * @memberof IVehicleHandling
     */
    steeringLock: number;

    steeringLockRatio: number;

    /**
     * Force damping scale front/back. If more wheels at back (e.g. trucks) need front suspension to be stronger. This value determines which suspension is stronger, front or rear. If value is above 0.50 then front is stiffer, when below, rear.
     * @type {number} 0 - 3
     * @memberof IVehicleHandling
     */
    suspensionBiasFront: number;

    suspensionBiasRear: number;

    /**
     * Damping during strut compression. Bigger = stiffer.
     * @type {number} 0 - 8
     * @memberof IVehicleHandling
     */
    suspensionCompDamp: number;

    /**
     * 1 / (Force * NumWheels) = Lower limit for zero force at full extension. Affects how strong suspension is. Can help if car is easily flipped over when turning.
     * @type {number} 0 - 9
     * @memberof IVehicleHandling
     */
    suspensionForce: number;

    /**
     * Visual limit... how far can wheels move up / down from original position.
     * @type {number} -0.36 - 0.1
     * @memberof IVehicleHandling
     */
    suspensionLowerLimit: number;

    /**
     * The amount that the suspension raises the body off the wheels. Recommend adjusting at second decimal unless vehicle has room to move. ie -0.02 is plenty of drop on an already low car. Too much will show the wheels clipping through or if positive, no suspension joining the body to wheels.
     * @type {number} -0.085 - 0.35
     * @memberof IVehicleHandling
     */
    suspensionRaise: number;

    /**
     * Damping during strut rebound. Bigger = stiffer.
     * @type {number} 0 - 10.8
     * @memberof IVehicleHandling
     */
    suspensionReboundDamp: number;

    /**
     * Visual limit... how far can wheels move up / down from original position.
     * @type {number} 0 - 0.8
     * @memberof IVehicleHandling
     */
    suspensionUpperLimit: number;

    /**
     * Determines the distribution of traction from front to rear.
     * @type {number} 0.325 - 0.95
     * @memberof IVehicleHandling
     */
    tractionBiasFront: number;

    tractionBiasRear: number;

    /**
     * Shape of lateral traction curve (peak traction position in degrees).
     * @type {number} 1 - 120
     * @memberof IVehicleHandling
     */
    tractionCurveLateral: number;

    tractionCurveLateralRatio: number;

    /**
     * Cornering grip of the vehicle as a multiplier of the tire surface friction.
     * @type {number} 0 - 3.7
     * @memberof IVehicleHandling
     */
    tractionCurveMax: number;

    tractionCurveMaxRatio: number;

    /**
     * Accelerating/braking grip of the vehicle as a multiplier of the tire surface friction.
     * @type {number} 0 - 3.5
     * @memberof IVehicleHandling
     */
    tractionCurveMin: number;

    tractionCurveMinRatio: number;

    /**
     * How much is traction affected by material grip differences from 1.0. Basically it affects how much grip is changed when driving on asphalt and mud (the higher, the more grip you loose, making car less responsive and prone to sliding).
     * @type {number} 0 - 1.4
     * @memberof IVehicleHandling
     */
    tractionLossMult: number;

    /**
     * This value denotes at what distance above the ground the car will lose traction.
     * @type {number} 0.02 - 0.5
     * @memberof IVehicleHandling
     */
    tractionSpringDeltaMax: number;

    tractionSpringDeltaMaxRatio: number;

    /**
     * Multiplies the game's calculation of damage to the vehicle by weapons.
     * @type {number}
     * @memberof IVehicleHandling
     */
    weaponDamageMult: number
}
