<template>
    <div class="vehicles-wrapper pa-4">
        <!-- Toggle Purchase Faction Vehicle Modal -->
        <AddVehicle
            v-bind:faction="faction"
            v-if="addVehicle"
            @close="() => (addVehicle = false)"
            @purchase-vehicle="finishPurchase"
        />
        <!-- Toggle Rank Permissions for Vehicle Modal -->
        <RankPermissions
            v-bind:faction="faction"
            v-bind:selected-vehicle="selectedVehicle"
            v-if="editRankPermissions"
            @toggle-rank="toggleRank"
            @close="(e) => (editRankPermissions = false)"
        />
        <div class="vehicle-panel mb-4" v-if="manageVehicles">
            <div class="split space-between">
                <div class="overline">Purchase New Vehicle?</div>
                <template v-if="faction.bank >= 1">
                    <Button class="veh-button" color="green" @click="addVehicle = true">
                        <Icon :size="14" icon="icon-plus" />
                    </Button>
                </template>
                <template v-else>
                    <Button class="veh-button" color="green" :disable="true">
                        <Icon :size="14" icon="icon-plus" />
                    </Button>
                </template>
            </div>
        </div>
        <div class="vehicle-panel split space-between mb-4" v-for="(vehicle, index) in faction.vehicles">
            <div class="vehicle-image">
                <img :src="ResolvePath(`../../assets/vehicles/${vehicle.model}.png`)" />
            </div>
            <div class="vehicle-name subtitle-2">Model: {{ vehicle.model }}</div>
            <div class="split">
                <!-- Manage Permissions -->
                <template v-if="manageVehicles">
                    <Button
                        class="veh-button"
                        color="green"
                        help="Permissions"
                        @click="() => showRankPermissions(vehicle)"
                    >
                        <Icon :size="14" icon="icon-cog2" />
                    </Button>
                </template>
                <template v-else>
                    <Button class="veh-button" color="green" :disable="true">
                        <Icon :size="14" icon="icon-cog2" />
                    </Button>
                </template>
                <!-- Spawn / Despawn Vehicle -->
                <template v-if="!isVehicleSpawned(vehicle)">
                    <Button class="veh-button" color="blue" help="Spawn" @click="() => spawnVehicle(vehicle.id)">
                        <Icon :size="14" icon="icon-upload2" />
                    </Button>
                </template>
                <template v-else>
                    <Button class="veh-button" color="blue" :disable="true">
                        <Icon :size="14" icon="icon-upload2" />
                    </Button>
                </template>
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
import ResolvePath from '@utility/pathResolver';

const ComponentName = 'Vehicles';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        AddVehicle: defineAsyncComponent(() => import('./vehicles/AddVehicle.vue')),
        RankPermissions: defineAsyncComponent(() => import('./vehicles/RankPermissions.vue')),
    },
    props: {
        character: String,
        faction: Object as () => Faction,
        pos: Object as () => Vector3,
        rot: Object as () => Vector3,
        spawnedVehicles: Array as () => Array<string>,
    },
    data() {
        return {
            // Permissions Check
            manageVehicles: false,
            // Add Vehicle Modal
            addVehicle: false,
            // Change Vehicle Rank Permissions Modal
            editRankPermissions: false,
            selectedVehicle: null as { id: string; model: string },
            // Utility
            ResolvePath: ResolvePath,
        };
    },
    mounted() {
        this.updateFaction();
    },
    watch: {
        faction() {
            this.updateFaction();
        },
    },
    methods: {
        updateFaction() {
            const member = FactionParser.getMember(this.faction, this.character);
            const rank = FactionParser.getRank(this.faction, member);

            this.manageVehicles = member.hasOwnership || rank.rankPermissions.manageVehicles ? true : false;
        },
        showRankPermissions(vehicle: { id: string; model: string }) {
            this.selectedVehicle = vehicle;
            this.editRankPermissions = true;
        },
        finishPurchase(model: string) {
            this.addVehicle = false;

            if (!('alt' in window)) {
                console.log(`Attempting to purchase ${model}`);
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.PURCHASE_VEHICLE, model);
        },
        toggleRank(rank: string, vehicleId: string) {
            if (!('alt' in window)) {
                console.log(`Updating Permission for ${rank} with vehicle: ${vehicleId}`);
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.TOGGLE_VEHICLE_RANK_PERMISSION, rank, vehicleId);
        },
        isVehicleSpawned(vehicle: { model: string; id: string }) {
            const index = this.spawnedVehicles.findIndex((id) => id === vehicle.id);
            return index >= 0 ? true : false;
        },
        spawnVehicle(uid: string) {
            if (!('alt' in window)) {
                console.log(`Spawning vehicle with ${uid}`);
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.SPAWN_VEHICLE, uid);
        },
    },
});
</script>

<style scoped>
.vehicles-wrapper {
    width: 100%;
    min-height: 75vh;
    max-height: 75vh;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
}

:deep() .vehicle-panel {
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    border: 2px solid rgba(28, 28, 28, 1);
    background: rgba(28, 28, 28, 1);
    border-radius: 6px;
    background: rgb(48, 48, 48);
}

:deep() .veh-button {
    border-radius: 12px;
}

:deep() .vehicle-image img {
    border-radius: 6px;
    max-width: 150px;
    border: 2px solid rgba(36, 36, 36, 1);
    box-sizing: border-box;
}
</style>
