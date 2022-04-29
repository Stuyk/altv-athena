<template>
    <div class="vehicles-wrapper pa-4">
        <AddVehicle
            v-bind:faction="faction"
            v-if="addVehicle"
            @close="() => (addVehicle = false)"
            @update="finishAddVehicle"
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
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Vector3 } from '../../../../shared/interfaces/vector';
import { Faction } from '../../shared/interfaces';
import { FactionParser } from '../utility/factionParser';

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
        finishAddVehicle(model: string) {
            //
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
</style>
