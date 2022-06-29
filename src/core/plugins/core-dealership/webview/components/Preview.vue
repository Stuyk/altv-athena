<template>
    <div class="preview-component">
        <div class="stack pt-4 pl-2 pr-2 dealership-header">
            <SimpleInput :value="search" :isNumberOnly="false" placeholder="Search..." @update="handleSearch" />
        </div>
        <div class="stack pl-2 pr-2 dealership-options">
            <div class="split space-between">
                <Button class="mr-2 fill-full-width" color="red" @click="exit">
                    {{ LOCALE.EXIT }}
                </Button>
                <Button class="fill-full-width" color="orange" @click="camera">
                    {{ LOCALE.CAMERA }}
                </Button>
            </div>
        </div>
        <div class="stack pt-4 pl-2 pr-2 dealership-body">
            <div v-for="(vehicle, index) in getVehicles" :key="index">
                <div class="stack pb-4">
                    <div class="split space-between pb-2">
                        <span class="vehicle-name overline">
                            {{ vehicle.display }}
                        </span>
                        <span
                            class="vehicle-price overline"
                            :class="vehicle.canPurchase ? { 'green--text': true } : { 'red--text': true }"
                        >
                            ${{ vehicle.price }}
                        </span>
                    </div>
                    <div class="split space-between">
                        <Button class="mr-2 fill-full-width" color="blue" @click="() => preview(vehicle)">
                            {{ LOCALE.PREVIEW }}
                        </Button>
                        <Button class="fill-full-width" color="blue" @click="() => selectVehicle(vehicle)">
                            {{ LOCALE.SELECT }}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

import { VehicleInfo } from '../../../../shared/interfaces/vehicleInfo';
import { DEALERSHIP_LOCALE } from '../../shared/locale';

export default defineComponent({
    name: 'Preview',
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        SimpleInput: defineAsyncComponent(() => import('@components/SimpleInput.vue')),
    },
    props: {
        vehicles: {
            type: Array,
            required: true,
        },
        money: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            LOCALE: DEALERSHIP_LOCALE,
            search: '',
        };
    },
    computed: {
        getVehicles() {
            const updatedVehicles = this.vehicles.map((vehicle) => {
                return {
                    ...vehicle,
                    canPurchase: this.money >= vehicle.price,
                };
            });

            updatedVehicles.sort((a, b) => {
                return b.canPurchase - a.canPurchase;
            });

            return updatedVehicles.filter((x) => {
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
        camera() {
            this.$emit('camera');
        },
        selectVehicle(info: VehicleInfo) {
            this.$emit('select-vehicle', info);
        },
        preview(info: VehicleInfo) {
            this.$emit('preview', info);
        },
        handleSearch(searchText: string) {
            this.search = searchText;
        },
        exit() {
            this.$emit('exit-window');
        },
    },
});
</script>

<style scoped>
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
</style>
