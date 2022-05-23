<template>
    <div class="stack fill-full-width">
        <div class="panel pa-4 mb-4">
            <div class="setting-header subtitle-1 mb-2">Faction Head Quarters</div>
            <span class="subtitle-2 mb-2">Location of the Faction. Click to set to current location.</span>
            <div class="setting-content">
                <template v-if="isOwner">
                    <Button color="blue" class="settings-button" @click="setHeadQuarters"> Update Location </Button>
                </template>
                <template v-else>
                    <Button :disable="true" class="settings-button"> Update Location </Button>
                </template>
            </div>
        </div>
        <div class="panel pa-4 mb-4" v-if="hasCoordinates && isOwner">
            <div class="setting-header mb-4">Faction Blip</div>
            <span class="subtitle-2 mb-2">
                Blip sprite, and blip color. Setting this value reveals faction to whole server.
            </span>
            <div class="setting-content stack space-between">
                <div class="split space-between fill-full-width mb-4 mt-2">
                    <span class="overline label">Sprite</span>
                    <input class="fill-full-width" type="number" v-model="blip" placeholder="Blip number..." />
                </div>
                <div class="split space-between fill-full-width mb-4">
                    <span class="overline label">Sprite Color</span>
                    <input class="fill-full-width" type="number" v-model="blipColor" placeholder="Blip Color..." />
                </div>
                <div class="split space-between ml-4">
                    <Button color="cyan" class="settings-button mr-4" @click="() => setBlip(true)"> Clear </Button>
                    <Button color="blue" class="settings-button ml-4" @click="() => setBlip(false)"> Update </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Vector3 } from '../../../../../shared/interfaces/vector';
import { FACTION_EVENTS } from '../../../shared/factionEvents';
import { FACTION_PFUNC } from '../../../shared/funcNames';
import { Faction } from '../../../shared/interfaces';

const ComponentName = 'HeadQuarters';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: Object as () => Faction,
        character: String,
        pos: Object as () => Vector3,
        rot: Object as () => Vector3,
        isOwner: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    data() {
        return {
            blip: 1,
            blipColor: 36,
        };
    },
    computed: {
        hasCoordinates() {
            return this.faction && this.faction.settings && this.faction.settings.position;
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
