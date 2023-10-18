/**
 *
 * @ignore
 *
 * @enum {number}
 */
export const PLAYER_SYNCED_META = {
    POSITION: 'player-position',
    PING: 'player-ping',
    NAME: 'player-name',
    DIMENSION: 'player-dimension',
    WAYPOINT: 'player-waypoint',
    DATABASE_ID: 'player-character-id',
    ATTACHABLES: 'player-attachable-list',
    ACCOUNT_ID: 'player-account-id',
    /**
     * This specific ID is assigned in the Identifier system.
     * The strategy is dependent on your server's configuration.
     *
     * It could be an increment character id, account id, or a temporary id.
     * It is entirely dependent on what you need.
     */
    IDENTIFICATION_ID: 'player-identification-id',
};

export const PLAYER_LOCAL_META = {
    INVENTORY: 'player-inventory',
    TOOLBAR: 'player-toolbar',
    TOTAL_WEIGHT: 'player-total-weight',
    INVENTORY_SIZE: 'player-inventory-size',
};
