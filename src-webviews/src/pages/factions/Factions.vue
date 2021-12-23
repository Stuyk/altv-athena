<template>
    <div class="factions-wrapper">
        <div class="frame">
            <div class="navbar">
                <div class="left-nav">
                    <div @click="exit" class="exit">
                        <Icon icon="icon-exit" class="navitem pl-4 pr-4" color="red" :size="16"></Icon>
                    </div>
                    <span class="text-sm-overline keybind pl-2 pr-2">ESC</span>
                </div>
                <div class="center-nav pr-8" v-if="components.length >= 1">
                    <div
                        v-for="(component, index) in components"
                        :key="index"
                        :class="isNavSelected(index)"
                        @click="setPage(index)"
                    >
                        {{ component.name }}
                    </div>
                </div>
                <div class="split right-nav">
                    <!-- Left Empty on Purpose -->
                </div>
            </div>
            <template v-if="components[index]">
                <component
                    ref="pageComponent"
                    v-bind:is="components[index].name"
                    v-bind:faction="faction"
                    v-bind:flags="flags"
                ></component>
            </template>
        </div>
        <div class="response-green pa-4" v-if="response && response.status">
            {{ response.response }}
        </div>
        <div class="response-red pa-4" v-if="response && !response.status">
            {{ response.response }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue';
import Button from '../../components/Button.vue';
import Frame from '../../components/Frame.vue';
import Icon from '../../components/Icon.vue';
import Input from '../../components/Input.vue';
import Modal from '../../components/Modal.vue';
import Module from '../../components/Module.vue';
import RangeInput from '../../components/RangeInput.vue';
import Toolbar from '../../components/Toolbar.vue';

// Default Data
import FactionData from './utility/factionData';

// Components
import Members from './components/Members.vue';
import Ranks from './components/Ranks.vue';

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'Factions';
export default defineComponent({
    name: ComponentName,
    // Used to add Custom Components
    components: {
        Button,
        Frame,
        Icon,
        Input,
        Modal,
        Module,
        RangeInput,
        Toolbar,
        Members,
        Ranks,
    },
    // Used to define state
    data() {
        return {
            timeout: 0,
            index: 3,
            response: null,
            locales: {},
            faction: {},
            flags: {},
            components: [
                { name: 'Members' },
                { name: 'Ranks' },
                { name: 'Bank' },
                { name: 'Options' },
                { name: 'Logs' },
            ],
        };
    },
    methods: {
        setURL(url) {
            if (url.includes('assets/webserver')) {
                this.url = url;
                return;
            }

            this.url = `http://${url}`;
        },
        showResponse(response) {
            if (!response) {
                return;
            }

            this.response = response;

            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            this.timeout = setTimeout(() => {
                clearTimeout(this.timeout);
                this.response = null;
                this.timeout = null;
            }, 3000);
        },
        setFaction(faction) {
            faction.players = faction.players.sort((a, b) => {
                return a.rank - b.rank;
            });

            this.faction = faction;

            if (!this.$refs.pageComponent) {
                return;
            }

            if (this.$refs.pageComponent.factionUpdate) {
                this.$refs.pageComponent.factionUpdate(faction);
            }
        },
        setFlags(flags) {
            this.flags = flags;
        },
        setPage(index) {
            this.index = index;
        },
        exit() {
            if ('alt' in window) {
                alt.emit('factions:Close');
            } else {
                console.log('Exit button go brr');
            }
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            this.exit();
        },
        isNavSelected(index) {
            if (this.index === index) {
                return { navitem: true, navselected: true, overline: true };
            }

            return { navitem: true, overline: true };
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on('factions:SetFaction', this.setFaction);
            alt.on('factions:SetLocale', this.setLocales);
            alt.on('factions:SetFlags', this.setFlags);
            alt.on('factions:Response', this.showResponse);
            alt.on('url', this.setURL);
            alt.emit('factions:Ready');
            alt.emit('ready');
            alt.emit('url');
        } else {
            let players = [
                {
                    name: 'Jane_Dane',
                    id: '608729d7b1f7d6140ca718ac',
                    rank: 0,
                },
                {
                    name: 'Some_Person',
                    id: '608729d7b1f7d6140ca718fd',
                    rank: 1,
                    canBeKicked: true,
                    canRankDown: true,
                },
                {
                    name: 'Jobi_Jones',
                    id: '608729d7b1f7d6140ca718ad',
                    rank: 1,
                    canBeKicked: true,
                    canRankDown: true,
                },
            ];

            for (let i = 0; i < 5; i++) {
                players.forEach((player) => {
                    players.push(player);
                });
            }

            FactionData.players = players;
            this.setFaction(FactionData);

            // Example Output from Clientside Enum Send
            this.setFlags({
                1: 'SUPER_ADMIN',
                2: 'CHANGE_NAME',
                4: 'CHANGE_MEMBER_RANK',
                8: 'CHANGE_RANK_ORDER',
                16: 'CHANGE_RANK_NAMES',
                32: 'KICK_MEMBER',
                64: 'CREATE_RANK',
                128: 'PREVENT_FACTION_CHAT',
                256: 'ACCESS_STORAGE',
                512: 'ADD_TO_BANK',
                1024: 'REMOVE_FROM_BANK',
                2048: 'ACCESS_WEAPONS',
                4096: 'ADD_MEMBERS',
                8192: 'CHANGE_RANK_PERMS',
                ACCESS_STORAGE: 256,
                ACCESS_WEAPONS: 2048,
                ADD_MEMBERS: 4096,
                ADD_TO_BANK: 512,
                CHANGE_MEMBER_RANK: 4,
                CHANGE_NAME: 2,
                CHANGE_RANK_NAMES: 16,
                CHANGE_RANK_ORDER: 8,
                CHANGE_RANK_PERMS: 8192,
                CREATE_RANK: 64,
                KICK_MEMBER: 32,
                PREVENT_FACTION_CHAT: 128,
                REMOVE_FROM_BANK: 1024,
                SUPER_ADMIN: 1,
            });

            this.showResponse({ status: true, response: 'Hello World' });
        }
    },
});
</script>

<style>
.frame {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    user-select: none;
    min-width: 100vw;
    height: 100vh;
    backface-visibility: hidden;
    animation: fadein ease 0.5s;
    background: rgba(25, 25, 25, 0.9);
}

.navbar {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center;
    justify-items: center;
    width: 100%;
    min-height: 75px;
    border-bottom: 3px solid rgba(255, 255, 255, 0.1);
}

.navbar .center-nav {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-grow: 1;
    justify-content: space-between;
    align-content: space-between;
    justify-items: center;
    align-items: center;
}

.navbar .left-nav {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-grow: 1;
    justify-items: center;
    align-items: center;
}

.navbar .navitem {
    position: relative;
    display: flex;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
    cursor: pointer;
    width: 100%;
    height: 100%;
}

.navbar .navitem:hover {
    opacity: 0.75;
}

.navbar .navselected {
    text-shadow: 0px 0px 5px rgba(255, 255, 255, 1), 0px 0px 25px rgba(255, 255, 255, 1);
}

.frame .exit:hover {
    opacity: 1;
    text-shadow: 0px 0px 25px rgba(255, 0, 0, 1);
}

.table {
    display: table;
    width: 100%;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
}

.table .headers {
    width: 100%;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2) !important;
    flex-wrap: nowrap;
    box-sizing: border-box;
}

.table .row {
    display: table-row;
    padding-left: 25px;
}

.table .row:nth-of-type(odd) {
    background: rgba(0, 0, 0, 0.1);
}

.table .cell {
    display: table-cell;
    padding-top: 6px;
    padding-bottom: 6px;
}

.table .cell:first-child {
    padding-left: 12px;
}

.table .cell:last-child {
    padding-right: 12px;
}

.table .options {
    display: flex;
    text-align: center;
    flex-wrap: nowrap;
}

.table-members {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    row-gap: 15px;
    column-gap: 48px;
    text-align: left;
    width: 100%;
}

.small-icon,
.small-icon-solo {
    display: block;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    text-align: center;
    justify-content: center;
    align-content: center;
    align-items: center;
    justify-items: center;
    padding: 6px;
}

.small-icon:hover {
    cursor: pointer;
}

.selectable {
    user-select: text !important;
}
</style>
