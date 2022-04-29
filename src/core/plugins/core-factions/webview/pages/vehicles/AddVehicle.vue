<template>
    <div class="wrapper">
        <Modal>
            <Frame minWidth="700px" maxWidth="700px" maxHeight="600px">
                <template v-slot:toolbar>
                    <Toolbar :overrideCallback="true" @close-click="close">
                        Purchase a New Vehicle - ${{ faction.bank.toLocaleString() }}
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="stack fill-full-width">
                        <template v-if="getVehicles.length <= 0">
                            <h2>No Vehicles Available</h2>
                        </template>
                        <template v-else>
                            <div
                                class="vehicle-option split fill-full-width space-between mb-4"
                                v-for="(vehicle, index) in getVehicles"
                                :key="index"
                            >
                                <div class="vehicle-image">
                                    <img :src="ResolvePath(`../../assets/vehicles/${vehicle.model}.png`)" />
                                </div>
                                <div class="vehicle-name subtitle-2">Model: {{ vehicle.model }}</div>
                                <div class="vehicle-name subtitle-2">${{ vehicle.price }}</div>
                                <template v-if="faction.bank >= vehicle.price">
                                    <Button
                                        class="veh-button mr-4"
                                        color="green"
                                        @click="(e) => purchase(vehicle.model)"
                                    >
                                        <Icon :size="14" icon="icon-dollar" />
                                    </Button>
                                </template>
                                <template v-else>
                                    <Button class="veh-button mr-4" color="red" :disable="true">
                                        <Icon :size="14" icon="icon-dollar" />
                                    </Button>
                                </template>
                            </div>
                        </template>
                    </div>
                </template>
            </Frame>
        </Modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Faction } from '../../../shared/interfaces';
import ResolvePath from '@utility/pathResolver';

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
    },
    data() {
        return {
            ResolvePath: ResolvePath,
        };
    },
    computed: {
        getVehicles() {
            return this.faction.settings && this.faction.settings.vehicles ? this.faction.settings.vehicles : [];
        },
    },
    methods: {
        close() {
            this.$emit('close');
        },
        purchase(model: string) {
            this.$emit('purchase-vehicle', model);
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
