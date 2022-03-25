export interface IConfig {
    DISCORD_BOT?: string;
    DISCORD_SERVER_ID?: string;
    WHITELIST_ROLE?: string;
    ARES_ENDPOINT?: string;
    MONGO_URL?: string;
    MONGO_USERNAME?: string;
    MONGO_PASSWORD?: string;
    MONGO_COLLECTIONS?: string;
    WEBSERVER_IP?: string;
    VUE_DEBUG?: string | boolean;
    USE_ALTV_RECONNECT?: boolean;
    USE_DEV_MODE?: boolean;
}
