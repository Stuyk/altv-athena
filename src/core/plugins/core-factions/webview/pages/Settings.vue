<template>
    <div class="settings-wrapper pa-4">
        <div class="panel pa-4">
            <div class="setting-header subtitle-1 mb-2">Faction Head Quarters</div>
            <span class="subtitle-2 mb-2">Location of the Faction. Click to set to current location.</span>
            <div class="setting-content">
                <template v-if="hasOwnership">
                    <Button color="blue" class="settings-button" @click="setHeadQuarters"> Update Location </Button>
                </template>
                <template v-else>
                    <Button :disable="true" class="settings-button"> Update Location </Button>
                </template>
            </div>
        </div>
        <div class="panel pa-4" v-if="hasCoordinates && hasOwnership">
            <div class="setting-header mb-4">Faction Blip</div>
            <span class="subtitle-2 mb-2">
                Blip sprite, and blip color. Setting this value reveals faction to whole server.
            </span>
            <div class="setting-content split space-between">
                <input class="fill-full-width" type="number" v-model="blip" placeholder="Blip number..." />
                <input class="fill-full-width" type="number" v-model="blipColor" placeholder="Blip Color..." />
                <div class="split space-between ml-4">
                    <Button color="cyan" class="settings-button" @click="() => setBlip(true)"> Clear </Button>
                    <Button color="blue" class="settings-button" @click="() => setBlip(false)"> Update </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Vector3 } from '../../../../shared/interfaces/vector';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { FACTION_PFUNC } from '../../shared/funcNames';
import { Faction } from '../../shared/interfaces';
import { FactionParser } from '../utility/factionParser';

const ComponentName = 'Settings';
export default defineComponent({
    name: ComponentName,
    props: {
        character: String,
        faction: Object as () => Faction,
        pos: Object as () => Vector3,
        rot: Object as () => Vector3,
    },
    data() {
        return {
            blip: 1,
            blipColor: 36,
        };
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    computed: {
        hasCoordinates() {
            return this.faction && this.faction.settings && this.faction.settings.position;
        },
        hasOwnership() {
            const member = FactionParser.getMember(this.faction, this.character);
            if (!member) {
                return false;
            }

            return member.hasOwnership;
        },
    },
    methods: {
        setHeadQuarters() {
            if (!('alt' in window)) {
                console.log(`Setting Head Quarters to ${this.pos.x}, ${this.pos.y}, ${this.pos.z}`);
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.SET_HEAD_QUARTERS, this.pos);
        },
        setBlip(shouldClear = false) {
            if (!('alt' in window)) {
                if (shouldClear) {
                    console.log(`Clearing blip`);
                    return;
                }

                console.log(`Setting Blip to ${this.blip}`);
                return;
            }

            if (shouldClear) {
                alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.SET_BLIP, undefined, undefined);
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.SET_BLIP, this.blip, this.blipColor);
        },
    },
    mounted() {
        this.blip = typeof this.faction.settings.blip !== 'undefined' ? this.faction.settings.blip : 354;
        this.blipColor = typeof this.faction.settings.blipColor !== 'undefined' ? this.faction.settings.blipColor : 36;
    },
});
</script>

<style scoped>
.settings-wrapper {
    width: 100%;
    min-height: 75vh;
    max-height: 75vh;
    box-sizing: border-box;
    overflow-y: scroll;
}

.panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: rgba(48, 48, 48, 1);
    border: 2px solid rgba(28, 28, 28, 1);
    border-radius: 6px;
    box-sizing: border-box;
}

.settings-button {
    border-radius: 6px;
    min-width: 150px;
}

.setting-header {
    font-size: 16px;
    border-bottom: 2px solid rgba(36, 36, 36, 1);
}

input {
    align-self: center;
    font-family: 'Roboto', sans-serif;
    background: rgba(12, 12, 12, 1);
    border: 2px solid rgba(36, 36, 36, 1);
    padding: 6px;
    box-sizing: border-box;
    color: white;
}

input:focus {
    border-color: rgba(52, 52, 52, 1);
}
</style>
