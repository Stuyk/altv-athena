<template>
    <div class="vehicles-wrapper pa-4">
        <AddVehicle
            v-bind:faction="faction"
            v-if="addVehicle"
            @close="() => (addVehicle = false)"
            @purchase-vehicle="finishPurchase"
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
    },
    props: {
        character: String,
        faction: Object as () => Faction,
        pos: Object as () => Vector3,
        rot: Object as () => Vector3,
    },
    data() {
        return {
            addVehicle: false,
            manageVehicles: false,
            ResolvePath: ResolvePath,
        };
    },
    mounted() {
        const member = FactionParser.getMember(this.faction, this.character);
        const rank = FactionParser.getRank(this.faction, member);

        this.manageVehicles = member.hasOwnership || rank.rankPermissions.manageVehicles ? true : false;
    },
    watch: {
        faction() {
            const member = FactionParser.getMember(this.faction, this.character);
            const rank = FactionParser.getRank(this.faction, member);

            this.manageVehicles = member.hasOwnership || rank.rankPermissions.manageVehicles ? true : false;
        },
    },
    methods: {
        finishPurchase(model: string) {
            this.addVehicle = false;

            if (!('alt' in window)) {
                console.log(`Attempting to purchase ${model}`);
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.PURCHASE_VEHICLE, model);
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
