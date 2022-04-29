<template>
    <div class="stack fill-full-width">
        <div class="panel pa-4 mb-4">
            <div class="setting-header subtitle-1 mb-2">Parking</div>
            <span class="subtitle-2 mb-2"
                >Locations of parking spots available for spawning vehicles. Sorted by closest.</span
            >
            <div class="setting-content">
                <div v-for="(spot, index) in getParkingSpots" :key="index">
                    <div class="split space-between fill-full-width mb-4">
                        <span class="subtitle-2 label">{{ spot.dist.toFixed(2) }} Units Away</span>
                        <template v-if="isOwner">
                            <Button color="red" class="settings-button" @click="() => removeLocation(spot.index)">
                                <Icon :size="12" icon="icon-cross" />
                            </Button>
                        </template>
                        <template v-else>
                            <Button color="red" :disable="true" class="settings-button">
                                <Icon :size="12" icon="icon-cross" />
                            </Button>
                        </template>
                    </div>
                </div>
                <template v-if="isOwner">
                    <Button color="blue" class="settings-button" @click="addCurrentLocation"> Add Location </Button>
                </template>
                <template v-else>
                    <Button :disable="true" class="settings-button"> Add Location </Button>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Vector3 } from '../../../../../shared/interfaces/vector';
import { Faction } from '../../../shared/interfaces';
import { distance } from '../../../../../shared/utility/vector';
import { FACTION_EVENTS } from '../../../shared/factionEvents';
import { FACTION_PFUNC } from '../../../shared/funcNames';

const ComponentName = 'Parking';
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
            // No Data Necessary
        };
    },
    computed: {
        getParkingSpots() {
            if (this.faction.settings && !this.faction.settings.parkingSpots) {
                return [];
            }

            const distanceSpots = this.faction.settings.parkingSpots.map((spot, index) => {
                const dist = distance(this.pos, spot.pos);
                return {
                    ...spot,
                    dist,
                    index,
                };
            });

            const sortedDistanceSpots = distanceSpots.sort((a, b) => {
                return a.dist - b.dist;
            });

            return sortedDistanceSpots;
        },
    },
    methods: {
        addCurrentLocation() {
            if (!('alt' in window)) {
                console.log(`Adding Spot with pos: ${JSON.stringify(this.pos)}`);
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.ADD_PARKING_SPOT, this.pos, this.rot);
        },
        removeLocation(index: number) {
            if (!('alt' in window)) {
                console.log(`Removing Spot with index: ${index}`);
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.REMOVE_PARKING_SPOT, index);
        },
    },
});
</script>
