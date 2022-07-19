export enum PLAYER_SYNCED_META {
    WANTED_LEVEL = 'player-wanted',
    POSITION = 'player-position',
    PING = 'player-ping',
    NAME = 'player-name',
    DIMENSION = 'player-dimension',
    WAYPOINT = 'player-waypoint',
    DATABASE_ID = 'player-character-id',
    ATTACHABLES = 'player-attachable-list',
    ACCOUNT_ID = 'player-account-id',
    IS_FROZEN = 'player-is-frozen',
    /**
     * This specific ID is assigned in the Identifier system.
     * The strategy is dependent on your server's configuration.
     *
     * It could be an increment character id, account id, or a temporary id.
     * It is entirely dependent on what you need.
     */
    IDENTIFICATION_ID = 'player-identification-id',
}
