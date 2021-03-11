const VehicleImagePreview = Vue.component('vehicle-image-preview', {
    props: ['vehicle', 'data'],
    methods: {
        getVehicleImage(model) {
            return `../../images/vehicles/${model}.png`;
        },
        getVehicleClasses(price) {
            return price > this.data.bank ? { disabled: true } : { clickable: true };
        },
        select(vehicle) {
            this.$emit('select-vehicle', vehicle);
        }
    },
    template: `
        <template>
            <div v-if="vehicle.price < data.bank + data.cash">
                <img width="144px" height="144px"
                    :src="getVehicleImage(vehicle.name)"
                    class="ma-1 rounded-lg elevation-6 preview-img"
                    :class="getVehicleClasses(vehicle.price)"
                    @click="select(vehicle)"
                >

                </img>
            </div>
            <div v-else>
                <img width="144px" height="144px"
                    :src="getVehicleImage(vehicle.name)"
                    class="ma-1 rounded-lg elevation-6 preview-img"
                    :class="getVehicleClasses(vehicle.price)"
                >
                </img>
            </div>
        </template>
    `
});

const VehicleSearch = Vue.component('vehicle-search', {
    props: ['data'],
    data() {
        return {
            searchTerm: ''
        };
    },
    methods: {
        filterVehicles(searchTerm) {
            searchTerm = searchTerm.toLowerCase();

            if (searchTerm === '' || !searchTerm) {
                this.$emit('search-vehicles', VehicleData);
                return;
            }

            // Filter by search term.
            const newList = VehicleData.filter((data) => {
                if (data.class.includes(searchTerm) && data.sell) {
                    return true;
                }

                if (data.name.includes(searchTerm) && data.sell) {
                    return true;
                }

                if (data.type.includes(searchTerm) && data.sell) {
                    return true;
                }

                if (data.display.includes(searchTerm) && data.sell) {
                    return true;
                }

                return false;
            });

            this.$emit('search-vehicles', newList);
        }
    },
    watch: {
        searchTerm(value) {
            this.filterVehicles(value);
        }
    },
    template: `
        <template>
            <div class="ma-1 pa-2 grey darken-4 rounded-lg flex-grow-1" style="max-height: 86px">
                <v-text-field class="font-weight-black"
                    label="Search by name, type, or model..."
                    v-model="searchTerm" 
                    autocomplete="off"
                />
            </div>
        </template>
    `
});

const appDealership = Vue.component('app-dealership', {
    components: ['vehicle-image', 'vehicle-image-preview', 'vehicle-search'],
    props: ['data'],
    data() {
        return {
            vehicles: [...VehicleData],
            vehicle: null // { display: 'Dinghy', name: 'dinghy', type: 'boat', class: 'boat', sell: true, price: 12000 }
        };
    },
    methods: {
        selectModel(vehicle) {
            this.vehicle = vehicle;
        },
        updateVehicles(vehicles) {
            this.vehicles = vehicles;
        },
        getVehicleImage(model) {
            return `../../images/vehicles/${model}.png`;
        },
        purchase(model) {
            console.log(model);
        },
        back() {
            this.vehicle = null;
        }
    },
    template: `
        <div class="app-dealership">
            <div class="app-wrapper">
                <div class="header pt-2 pb-2">
                    <template v-if="!vehicle">
                        <div class="overline">Browse Vehicles</div>
                    </template>
                    <template v-else>
                        <div class="overline">{{ vehicle.display }}</div>
                    </template>
                </div>
                <div class="main-screen pa-2">
                    <template v-if="!vehicle">
                        <vehicle-search v-bind:data="data" @search-vehicles="updateVehicles" />
                        <template v-for="(vehicle, index) in vehicles">
                            <template v-if="vehicle.sell">
                                <div class="image-placeholder">
                                    <vehicle-image-preview v-bind:vehicle="vehicle" v-bind:data="data" @select-vehicle="selectModel" />
                                    <div class="vehicle-model">{{ vehicle.display }}</div>
                                </div>
                            </template>
                        </template>
                    </template>
                    <template v-else>
                        <v-btn class="grey darken-4 ma-1 rounded-lg grey--text text--lighten-1 overline flex-grow-1" outlined @click="back">
                            <v-icon>icon-chevron-left</v-icon> Back
                        </v-btn>
                        <v-card class="flex-grow-1 ma-1 rounded-lg">
                            <img :src="getVehicleImage(vehicle.name)" width="100%"></img>
                            <v-card-text class="d-flex flex-column font-weight-black text-center">
                                <v-chip class="overline orange accent-4 full-width" label>\${{ vehicle.price }}</v-chip>
                                <v-chip class="overline mt-4" label>Class: {{ vehicle.class }}</v-chip>
                                <v-chip class="overline mt-4" label>Model: {{ vehicle.display }}</v-chip>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn class="green--text text--lighten-1 overline flex-grow-1" @click="purchase(vehicle.name)" outlined>Purchase</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </div>
            </div>
        </div>
    `
});
