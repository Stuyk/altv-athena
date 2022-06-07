export default interface IVehiclePartDamage {
    /**
     * Number of bullet holes currently in vehicle part
     * @type {number}
     * @memberof IVehiclePartDamage
     */
    bulletHoles?: number

    /**
     * Damage level of the vehicle part
     * @type {string}
     * @memberof IVehiclePartDamage
     */
    damageLevel: string
}