import { SHARED_CONFIG } from '../../shared/configurations/shared';

export const DEFAULT_CONFIG = {
    // Whitelisting
    WHITELIST: false,
    USE_DISCORD_BOT: false,
    // Use Voice
    VOICE_ON: SHARED_CONFIG.VOICE_ON,
    VOICE_MAX_DISTANCE: 35,
    // Character Selection View
    CHARACTER_SELECT_POS: { x: 36.19486618041992, y: 859.3850708007812, z: 197.71343994140625 },
    CHARACTER_SELECT_ROT: { x: 0, y: 0, z: -0.1943807601928711 },
    PLAYER_MAX_CHARACTER_SLOTS: 5,
    // Character Creation View
    CHARACTER_CREATOR_POS: { x: -673.5911254882812, y: -227.51573181152344, z: 37.090972900390625 },
    CHARACTER_CREATOR_ROT: { x: 0, y: 0, z: 1.302026629447937 },
    // New Character Properties
    PLAYER_NEW_SPAWN_POS: { x: -867.1437377929688, y: -172.6201934814453, z: 37.799232482910156 },
    PLAYER_CASH: 100,
    PLAYER_BANK: 100,
    // Chat Properties
    CHAT_ENABLED: true, // Turn off messaging. Chat still works for commands.
    CHAT_DISTANCE: 35,
    // Death / Respawn Properties
    RESPAWN_TIME: SHARED_CONFIG.RESPAWN_TIME, // 30s in Milliseconds
    RESPAWN_LOSE_WEAPONS: true, // Removes player weapons on death.
    RESPAWN_HEALTH: 200, // Health is 100 - 200. 99 is dead.
    RESPAWN_ARMOUR: 0, // Lose weapons when you respawn
    // Command Properties
    COMMAND_OOC_DISTANCE: 35,
    COMMAND_ME_DISTANCE: 35,
    COMMAND_DO_DISTANCE: 35,
    COMMAND_LOW_DISTANCE: 10,
    COMMAND_WHISPER_DISTANCE: 5,
    CHAT_ROLEPLAY_OOC_COLOR: `{656565}`, // OOC Color
    CHAT_ROLEPLAY_COLOR: `{C39ADD}`, // Roleplay Color
    CHAT_ROLEPLAY_LOW_COLOR: `{d3d3d3}`, // Low Color
    CHAT_ROLEPLAY_WHISPER_COLOR: `{e6e6ce}`, // Whisper Color
    // Interaction Properties
    MAX_INTERACTION_DISTANCE: 3, // The maximum distance the player can stand away from a interaction object.
    // World Time
    BOOTUP_HOUR: 9,
    BOOTUP_MINUTE: 0,
    MINUTES_PER_MINUTE: 5,
    USE_SERVER_TIME: true, // Overwrites the server time to use the current time of the computer it is running on.
    // Inventory Properites
    TIME_BETWEEN_INVENTORY_UPDATES: 10000,
    // Food Properties
    TIME_BETWEEN_FOOD_UPDATES: 10000,
    WATER_REMOVAL_RATE: 0.08, // How much food to remove every update.
    FOOD_REMOVAL_RATE: 0.05, // How much water to remove every update.
    // World Properties
    VALID_HOSPITALS: [
        { x: -248.01309204101562, y: 6332.01513671875, z: 33.0750732421875 },
        { x: 1839.15771484375, y: 3672.702392578125, z: 34.51904296875 },
        { x: 297.4647521972656, y: -584.7089233398438, z: 44.292724609375 },
        { x: -677.0172119140625, y: 311.7821350097656, z: 83.601806640625 },
        { x: 1151.2904052734375, y: -1529.903564453125, z: 36.3017578125 }
    ],
    WEATHER_ROTATION: [
        'EXTRASUNNY',
        'EXTRASUNNY',
        'CLEAR',
        'CLOUDS',
        'OVERCAST',
        'RAIN',
        'THUNDER',
        'RAIN',
        'FOGGY',
        'OVERCAST',
        'CLEARING'
    ],
    // Vehicle Properties
    TIME_BETWEEN_VEHICLE_UPDATES: 10000, // 10s
    TIME_BETWEEN_VEHICLE_SAVES: 30000, // 30s
    FUEL_LOSS_PER_PLAYER_TICK: 0.15, // Happens every 10s
    VEHICLE_DEALERSHIP_SPAWNS: {
        boat: { x: -877.3353271484375, y: -1357.1688232421875, z: 4.00537109375 },
        speedboat: { x: -877.3353271484375, y: -1357.1688232421875, z: 4.00537109375 },
        commercial: { x: 1270.839599609375, y: -3211.898193359375, z: 5.9010396003723145 },
        compact: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        coupe: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        cycle: { x: -1105.5673828125, y: -1688.4227294921875, z: 4.3033366203308105 },
        emergency: { x: 419.75384521484375, y: -1024.2294921875, z: 29.041784286499023 },
        industrial: { x: 1270.839599609375, y: -3211.898193359375, z: 5.9010396003723145 },
        military: { x: -2246.874755859375, y: 3245.732177734375, z: 32.81018829345703 },
        motorcycle: { x: 1770.909912109375, y: 3341.8837890625, z: 41.18528366088867 },
        muscle: { x: -230.79527282714844, y: -1388.4603271484375, z: 31.258228302001953 },
        offroad: { x: 1981.775146484375, y: 3776.6796875, z: 32.18091583251953 },
        aircraft: { x: -1052.5650634765625, y: -2964.5654296875, z: 18.8182373046875 },
        suv: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        sedan: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        service: { x: 419.75384521484375, y: -1024.2294921875, z: 29.041784286499023 },
        sport: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        sportclassic: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        super: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        trailer: { x: 1270.839599609375, y: -3211.898193359375, z: 5.9010396003723145 },
        train: { x: 0, y: 0, z: 0 },
        utility: { x: 1270.839599609375, y: -3211.898193359375, z: 5.9010396003723145 },
        van: { x: -230.79527282714844, y: -1388.4603271484375, z: 31.258228302001953 }
    },
    // Vehicle Garage List
    // Includes Parking Spots with Rotations
    VEHICLE_GARAGES: [
        {
            position: { x: 638.1083374023438, y: 206.50425720214844, z: 97.1 },
            parking: [
                {
                    position: { x: 628.10546875, y: 196.30441284179688, z: 97.22518157958984 },
                    rotation: { x: 0, y: 0, z: -1.970790982246399 }
                },
                {
                    position: { x: 626.5447387695312, y: 192.6681671142578, z: 97.25752258300781 },
                    rotation: { x: 0, y: 0, z: -1.8901821374893188 }
                },
                {
                    position: { x: 624.948974609375, y: 188.57269287109375, z: 97.36048126220703 },
                    rotation: { x: 0, y: 0, z: -1.9690102338790894 }
                },
                {
                    position: { x: 623.661865234375, y: 184.9991455078125, z: 97.43209075927734 },
                    rotation: { x: 0, y: 0, z: -1.9761689901351929 }
                },
                {
                    position: { x: 622.1517333984375, y: 181.24188232421875, z: 97.44312286376953 },
                    rotation: { x: 0, y: 0, z: -2.018047571182251 }
                },
                {
                    position: { x: 620.6544799804688, y: 177.16505432128906, z: 97.43790435791016 },
                    rotation: { x: 0, y: 0, z: -1.9260358810424805 }
                },
                {
                    position: { x: 619.1698608398438, y: 173.0449676513672, z: 97.43238830566406 },
                    rotation: { x: 0, y: 0, z: -1.9144991636276245 }
                },
                {
                    position: { x: 632.9246826171875, y: 180.1527862548828, z: 96.40357208251953 },
                    rotation: { x: 0, y: 0, z: 1.1817524433135986 }
                }
            ]
        },
        {
            position: { x: 596.8131713867188, y: 91.3467025756836, z: 92.6 },
            parking: [
                {
                    position: { x: 598.7886962890625, y: 98.26612854003906, z: 92.90635681152344 },
                    rotation: { x: 0, y: 0, z: -1.948119878768921 }
                },
                {
                    position: { x: 600.1036987304688, y: 102.00892639160156, z: 92.90635681152344 },
                    rotation: { x: 0, y: 0, z: -1.903090000152588 }
                },
                {
                    position: { x: 608.7832641601562, y: 103.8222885131836, z: 92.80987548828125 },
                    rotation: { x: 0, y: 0, z: 1.1688060760498047 }
                },
                {
                    position: { x: 609.926513671875, y: 107.25581359863281, z: 92.85598754882812 },
                    rotation: { x: 0, y: 0, z: 1.142356038093567 }
                },
                {
                    position: { x: 611.8656616210938, y: 110.81784057617188, z: 92.88837432861328 },
                    rotation: { x: 0, y: 0, z: 1.19924795627594 }
                },
                {
                    position: { x: 614.61572265625, y: 118.38829040527344, z: 92.88383483886719 },
                    rotation: { x: 0, y: 0, z: 1.2284070253372192 }
                },
                {
                    position: { x: 615.8260498046875, y: 122.29161071777344, z: 92.89236450195312 },
                    rotation: { x: 0, y: 0, z: 0.895605206489563 }
                },
                {
                    position: { x: 600.2688598632812, y: 111.46712493896484, z: 92.9063720703125 },
                    rotation: { x: 0, y: 0, z: -1.9416331052780151 }
                },
                {
                    position: { x: 601.3671875, y: 114.90589904785156, z: 92.90636444091797 },
                    rotation: { x: 0, y: 0, z: -1.9309113025665283 }
                },
                {
                    position: { x: 602.7779541015625, y: 118.63621520996094, z: 92.90564727783203 },
                    rotation: { x: 0, y: 0, z: -1.9368425607681274 }
                },
                {
                    position: { x: 604.0194702148438, y: 122.0771255493164, z: 92.90568542480469 },
                    rotation: { x: 0, y: 0, z: -1.9406081438064575 }
                },
                {
                    position: { x: 605.3681640625, y: 126.13227844238281, z: 92.90278625488281 },
                    rotation: { x: 0, y: 0, z: -1.88627290725708 }
                },
                {
                    position: { x: 606.7911987304688, y: 130.0382843017578, z: 92.89869689941406 },
                    rotation: { x: 0, y: 0, z: -1.9011530876159668 }
                }
            ]
        }
    ]
};
