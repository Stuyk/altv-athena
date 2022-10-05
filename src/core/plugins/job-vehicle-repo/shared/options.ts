export const JOB_VEHICLE_REPO_OPTIONS = {
    /**
     * Max time to complete the job in minutes
     */
    MAXTIME: 30,
    /**
     * Time in minutes before the job is available again
     */
    COOLDOWN: 1,
    /**
     * Maximum payout
     * Cap the payout to a limit
     */
    MAX_PAYOUT: 1000,
    /**
     * Payout Distance Multiplier
     * distance * multiplier = payout
     * Example: 1000 meter * 0.5 = $500
     */
    PAYOUT_DISTANCE_MULTIPLIER: 0.5,
};
