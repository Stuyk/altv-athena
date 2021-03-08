const VehicleImage = Vue.component('vehicle-image', {
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
            <div v-if="vehicle.price < data.bank">
                <img width="144px" height="144px"
                    :src="getVehicleImage(vehicle.name)"
                    class="ma-1 rounded-lg elevation-6"
                    :class="getVehicleClasses(vehicle.price)"
                    @click="select(vehicle)"
                >

                </img>
            </div>
            <div v-else>
                <img width="144px" height="144px"
                    :src="getVehicleImage(vehicle.name)"
                    class="ma-1 rounded-lg elevation-6"
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
    components: ['vehicle-image', 'vehicle-search'],
    props: ['data'],
    data() {
        return {
            vehicles: [...VehicleData]
        };
    },
    methods: {
        selectModel(vehicle) {
            console.log(vehicle);
        },
        updateVehicles(vehicles) {
            this.vehicles = vehicles;
        }
    },
    template: `
        <div class="app-dealership">
            <div class="app-wrapper">
                <div class="header pt-2 pb-2">
                    <div class="subtitle-2">Dealership</div>
                </div>
                <div class="main-screen pa-2">
                    <vehicle-search v-bind:data="data" @search-vehicles="updateVehicles" />
                    <template v-for="(vehicle, index) in vehicles">
                        <template v-if="vehicle.sell">
                            <vehicle-image v-bind:vehicle="vehicle" v-bind:data="data" @select-vehicle="selectModel" />
                        </template>
                    </template>
                </div>
            </div>
        </div>
    `
});
