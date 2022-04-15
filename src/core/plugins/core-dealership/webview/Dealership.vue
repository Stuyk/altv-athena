<template>
    <div class="dealership-wrapper pl-2">
        <div class="stack pt-4 pr-2 dealership-header"></div>
        <div class="stack pt-4 pr-2 dealership-body">
            <div v-for="(vehicle, index) in vehicles" :key="index">
                <div class="stack pb-4">
                    <div class="split space-between pb-2">
                        <span class="vehicle-name overline">
                            {{ vehicle.name }}
                        </span>
                        <span class="vehicle-price overline">${{ vehicle.price }}</span>
                    </div>
                    <Button class="mr-2 mb-2" style="width: 100%" color="yellow" @click="() => preview(vehicle)">
                        PREVIEW
                    </Button>
                    <Button class="mr-2" style="width: 100%" color="green" @click="() => purchase(vehicle)">
                        PURCHASE
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@components/Icon.vue';
import Button from '@components/Button.vue';
import Toolbar from '@components/Toolbar.vue';
import { VehicleInfo } from '../../../shared/interfaces/vehicleInfo';
import { DEALERSHIP_WEBVIEW_EVENTS } from '../shared/events';
import { VehicleData } from '../../../shared/information/vehicles';
import { VEHICLE_CLASS } from '../../../shared/enums/vehicleTypeFlags';

export const ComponentName = 'Dealership';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Icon,
        Toolbar,
    },
    data() {
        return {
            search: '',
            vehicles: [] as Array<VehicleInfo>,
        };
    },
    computed: {
        getVehicles() {
            return this.vehicles.filter();
        },
    },
    methods: {
        setVehicles(vehicles: Array<VehicleInfo>) {
            this.vehicles = vehicles;
        },
        handlePress(key: any) {
            console.log(key);
        },
        purchase(info: VehicleInfo) {
            if ('alt' in window) {
                alt.emit(DEALERSHIP_WEBVIEW_EVENTS.PURCHASE, info);
            } else {
                console.log('Purchase');
                console.log(info);
            }
        },
        preview(info: VehicleInfo) {
            if ('alt' in window) {
                alt.emit(DEALERSHIP_WEBVIEW_EVENTS.PREVIEW, info);
            } else {
                console.log('Preview');
                console.log(info);
            }
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on(DEALERSHIP_WEBVIEW_EVENTS.SET_VEHICLES, this.setVehicles);
            alt.emit(DEALERSHIP_WEBVIEW_EVENTS.READY);
        } else {
            this.setVehicles(VehicleData.filter((x) => x.class === VEHICLE_CLASS.MUSCLE && x.sell));
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.off(DEALERSHIP_WEBVIEW_EVENTS.SET_VEHICLES, this.setVehicles);
        }
    },
});
</script>

<style scoped>
.dealership-wrapper {
    position: fixed;
    left: 0vh !important;
    top: 0vh;
    background: rgba(12, 12, 12, 1) !important;
    min-height: 100vh;
    max-height: 100vh;
    min-width: 250px;
    max-width: 250px;
    overflow: hidden;
}

.dealership-header {
    min-height: 100px;
    max-height: 100px;
}

.dealership-body {
    min-height: calc(100vh - 100px);
    max-height: calc(100vh - 100px);
    overflow-y: scroll;
    border-top: 2px solid rgba(255, 255, 255, 0.2);
}
</style>
