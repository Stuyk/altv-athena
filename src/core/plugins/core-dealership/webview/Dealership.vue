<template>
    <div class="dealership-wrapper">
        <div class="money pr-12 pt-12 green--text text--lighten-1">${{ money.toFixed(2).toLocaleString() }}</div>
        <Preview
            @camera="camera"
            @select-vehicle="selectVehicle"
            @exit-window="exit"
            @set-color="setColor"
            @preview="preview"
            v-bind:money="money"
            v-bind:vehicles="vehicles"
            v-if="step === 0"
        ></Preview>
        <Custom
            @camera="camera"
            @go-back="goBack"
            @set-color="setColor"
            @purchase="purchase"
            @exit-window="exit"
            v-bind:money="money"
            v-bind:vehicle="selectedVehicle"
            v-if="step === 1"
        ></Custom>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { VehicleInfo } from '../../../shared/interfaces/vehicleInfo';
import { DEALERSHIP_WEBVIEW_EVENTS } from '../shared/events';
import { VehicleData } from '../../../shared/information/vehicles';
import { VEHICLE_CLASS } from '../../../shared/enums/vehicleTypeFlags';

export const ComponentName = 'Dealership';
export default defineComponent({
    name: ComponentName,
    components: {
        Preview: defineAsyncComponent(() => import('./components/Preview.vue')),
        Custom: defineAsyncComponent(() => import('./components/Custom.vue')),
    },
    data() {
        return {
            color: 5,
            step: 0,
            money: 24000,
            search: '',
            vehicles: [] as Array<VehicleInfo>,
            selectedVehicle: null,
        };
    },
    computed: {
        getVehicles() {
            return this.vehicles.filter((x) => {
                if (x.name.includes(this.search)) {
                    return true;
                }

                if (x.display.includes(this.search)) {
                    return true;
                }

                return false;
            });
        },
    },
    methods: {
        selectVehicle(vehicle: VehicleInfo) {
            this.selectedVehicle = vehicle;
            this.preview(vehicle);
            this.step = 1;
        },
        setBank(amount: number) {
            this.money = amount;
        },
        setVehicles(vehicles: Array<VehicleInfo>) {
            this.vehicles = vehicles;
        },
        handlePress(e: { keyCode: number }) {
            if (e.keyCode !== 27) {
                return;
            }

            this.exit();
        },
        exit() {
            if (!('alt' in window)) {
                console.log('EXIT TEST');
                return;
            }

            alt.emit(DEALERSHIP_WEBVIEW_EVENTS.EXIT);
        },
        camera() {
            if (!('alt' in window)) {
                console.log(`CAMERA TEST`);
                return;
            }

            alt.emit(DEALERSHIP_WEBVIEW_EVENTS.CAMERA);
        },
        purchase() {
            if ('alt' in window) {
                alt.emit(DEALERSHIP_WEBVIEW_EVENTS.PURCHASE, this.selectedVehicle, this.color);
            } else {
                console.log('Purchase');
                console.log(this.selectedVehicle);
                console.log(this.color);
            }
        },
        preview(info: VehicleInfo) {
            if ('alt' in window) {
                alt.emit(DEALERSHIP_WEBVIEW_EVENTS.PREVIEW, info, this.color);
            } else {
                console.log('Preview');
                console.log(info);
            }
        },
        handleSearch(searchText: string) {
            this.search = searchText;
        },
        goBack() {
            this.step -= 1;
            if (this.step < 0) {
                this.step = 0;
            }
        },
        setColor(id: number | string) {
            if (typeof id === 'string') {
                id = parseInt(id);
            }

            this.color = id;

            if ('alt' in window) {
                alt.emit(DEALERSHIP_WEBVIEW_EVENTS.PREVIEW, this.selectedVehicle, this.color);
            } else {
                console.log('Set Color');
                console.log(`${id} | ${this.selectedVehicle.name}`);
            }
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on(DEALERSHIP_WEBVIEW_EVENTS.SET_VEHICLES, this.setVehicles);
            alt.on(DEALERSHIP_WEBVIEW_EVENTS.SET_BANK, this.setBank);
            alt.emit(DEALERSHIP_WEBVIEW_EVENTS.READY);
        } else {
            this.setVehicles(VehicleData.filter((x) => x.class === VEHICLE_CLASS.MUSCLE && x.sell));
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.off(DEALERSHIP_WEBVIEW_EVENTS.SET_VEHICLES, this.setVehicles);
            alt.off(DEALERSHIP_WEBVIEW_EVENTS.SET_BANK, this.setBank);
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
    min-height: 50px;
    max-height: 50px;
}

.dealership-options {
    min-height: 50px;
    max-height: 50px;
}

.dealership-body {
    min-height: calc(100vh - 134px);
    max-height: calc(100vh - 134px);
    overflow-y: scroll;
    border-top: 2px solid rgba(48, 48, 48, 1);
}

.money {
    position: fixed;
    top: 0px;
    right: 0px;
    font-family: 'Roboto';
    font-size: 26px;
    font-weight: 600;
    text-shadow: 1px 1px black;
}
</style>
