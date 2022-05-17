<template>
    <div class="wrapper">
        <Modal>
            <Frame minWidth="700px" maxWidth="700px" maxHeight="600px">
                <template v-slot:toolbar>
                    <Toolbar :overrideCallback="true" @close-click="close"> Toggle Ranks with Vehicle Access </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="stack fill-full-width">
                        <!-- Show Ranks in a List, Show a +/- Button for Toggling a Rank -->
                        <div class="rank mb-4" v-for="(rank, index) in getRanks" :key="index">
                            <template v-if="doesRankHaveVehicle(rank)">
                                <Button color="green" @click="toggleRank(rank.uid)">
                                    {{ rank.name }}
                                </Button>
                            </template>
                            <template v-else>
                                <Button color="red" @click="toggleRank(rank.uid)">
                                    {{ rank.name }}
                                </Button>
                            </template>
                        </div>
                    </div>
                </template>
            </Frame>
        </Modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Faction, FactionRank } from '../../../shared/interfaces';
import { FactionParser } from '../../utility/factionParser';

// Look at the current ranks
// Inside of each rank see if `rank.vehicles` has the vehicle identifier
// If it has the identifier make the button green
// If it does not have the identifier make the button red
// Show the rank name
// Clicking the button toggles the rank's vehicle access

const ComponentName = 'AddVehicle';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Modal: defineAsyncComponent(() => import('@components/Modal.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
    },
    props: {
        faction: {
            type: Object as () => Faction,
            default: null,
        },
        selectedVehicle: {
            type: Object as () => { model: string; id: string },
            default: null,
        },
    },
    data() {
        return {};
    },
    computed: {
        getRanks() {
            return FactionParser.getFactionRanks(this.faction);
        },
    },
    methods: {
        doesRankHaveVehicle(rank: FactionRank) {
            if (!rank.vehicles) {
                return false;
            }

            return rank.vehicles.includes(this.selectedVehicle.id);
        },
        close() {
            this.$emit('close');
        },
        toggleRank(rankId: string) {
            this.$emit('toggle-rank', rankId, this.selectedVehicle.id);
        },
    },
});
</script>

<style scoped>
input {
    align-self: center;
    font-family: 'Roboto', sans-serif;
    background: rgba(12, 12, 12, 1);
    border: 2px solid rgba(36, 36, 36, 1);
    padding: 6px;
    width: 100%;
    box-sizing: border-box;
    color: white;
}

input:focus {
    border-color: rgba(52, 52, 52, 1);
}

.vehicle-option {
    background: rgba(22, 22, 22, 1);
    padding: 12px;
    box-sizing: border-box;
    border-radius: 6px;
    border: 2px solid rgba(36, 36, 36, 1);
}
</style>
