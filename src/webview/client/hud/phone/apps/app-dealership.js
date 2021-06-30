const VehicleImagePreview = Vue.component('vehicle-image-preview', {
    props: ['vehicle', 'data'],
    methods: {
        getVehicleImage(model) {
            return `../../images/vehicles/${model}.png`;
        },
        getVehicleClasses(price) {
            return price > this.data.bank + this.data.cash ? { disabled: true } : { clickable: true };
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
    props: ['data', 'vehicles'],
    data() {
        return {
            searchTerm: '',
            newLength: 0
        };
    },
    methods: {
        filterVehicles(searchTerm) {
            searchTerm = searchTerm.toLowerCase();

            if (searchTerm === '' || !searchTerm) {
                this.$emit('search-vehicles', null);
                return;
            }

            // Filter by search term.
            const newList = this.vehicles.filter((data) => {
                if (!data.sell) {
                    return false;
                }

                if (data.class.includes(searchTerm)) {
                    return true;
                }

                if (data.name.includes(searchTerm)) {
                    return true;
                }

                if (data.type.includes(searchTerm)) {
                    return true;
                }

                if (data.display.toLowerCase().includes(searchTerm)) {
                    return true;
                }

                return false;
            });

            this.$emit('search-vehicles', newList);
        }
    },
    watch: {
        searchTerm(value) {
            if (value.length < this.newLength) {
                this.$emit('search-vehicles', null);
            }

            this.$nextTick(() => {
                this.newLength = value.length;
                this.filterVehicles(value);
            });
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
            color: '#00FF00',
            vehiclesOriginal: null,
            vehicles: [],
            vehicle: null, // { display: 'Dinghy', name: 'dinghy', type: 'boat', class: 'boat', sell: true, price: 12000 }
            update: 0
        };
    },
    methods: {
        selectModel(vehicle) {
            this.vehicle = vehicle;
        },
        updateVehicles(vehicles) {
            if (!vehicles) {
                if (!this.vehiclesOriginal) {
                    return;
                }

                this.vehicles = this.vehiclesOriginal;
                this.update += 1;
                return;
            }

            this.vehicles = vehicles;

            if (this.vehiclesOriginal) {
                return;
            }

            this.vehiclesOriginal = vehicles;
        },
        getVehicleImage(model) {
            return `../../images/vehicles/${model}.png`;
        },
        purchase(model) {
            let color = this.asRGB(this.color);

            if (!color) {
                color = {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 255
                };
            }

            if (!color.a) {
                color.a = 255;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit('phone:Event', 'phone:Dealership:Buy', model, color);
        },
        asRGB(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? {
                      r: parseInt(result[1], 16),
                      g: parseInt(result[2], 16),
                      b: parseInt(result[3], 16)
                  }
                : null;
        },
        back() {
            this.vehicle = null;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('phone:Dealership:Vehicles', this.updateVehicles);
            alt.emit('phone:Dealership:Populate');
            alt.emit('phone:ATM:Populate');
        } else {
            this.updateVehicles([
                {
                    display: 'Dinghy',
                    name: 'dinghy',
                    type: 'boat',
                    class: 'boat',
                    sell: true,
                    price: 12000
                },
                {
                    display: 'Dinghy 2',
                    name: 'dinghy2',
                    type: 'boat',
                    class: 'boat',
                    sell: true,
                    price: 12000
                },
                {
                    display: 'Dinghy 3',
                    name: 'dinghy3',
                    type: 'boat',
                    class: 'boat',
                    sell: true,
                    price: 12000
                },
                {
                    display: 'Dinghy',
                    name: 'dinghy',
                    type: 'boat',
                    class: 'boat',
                    sell: true,
                    price: 12000
                },
                {
                    display: 'Dinghy 2',
                    name: 'dinghy2',
                    type: 'boat',
                    class: 'boat',
                    sell: true,
                    price: 12000
                },
                {
                    display: 'Dinghy 3',
                    name: 'dinghy3',
                    type: 'boat',
                    class: 'boat',
                    sell: true,
                    price: 12000
                }
            ]);
        }
    },
    beforeDestroy() {
        if (!('alt' in window)) {
            return;
        }

        alt.off('phone:Dealership:Vehicles', this.updateVehicles);
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
                        <vehicle-search v-bind:data="data" v-bind:vehicles="vehicles" @search-vehicles="updateVehicles" />
                        <template v-for="(vehicle, index) in vehicles">
                            <template v-if="vehicle.sell">
                                <div class="image-placeholder">
                                    <vehicle-image-preview v-bind:vehicle="vehicle" v-bind:data="data" @select-vehicle="selectModel" />
                                    <div class="vehicle-model">{{ vehicle.display }}</div>
                                    <div class="vehicle-price">\${{ vehicle.price }}</div>
                                </div>
                            </template>
                        </template>
                    </template>
                    <template v-else>
                        <button class="grey darken-4 ma-1 rounded-lg grey--text text--lighten-1 overline flex-grow-1" outlined @click="back">
                            <v-icon>icon-chevron-left</v-icon> Back
                        </button>
                        <v-card class="flex-grow-1 ma-1 rounded-lg">
                            <img :src="getVehicleImage(vehicle.name)" width="100%"></img>
                            <v-card-text class="d-flex flex-column font-weight-black text-center">
                                <v-chip class="overline orange accent-4 full-width" label>\${{ vehicle.price }}</v-chip>
                                <v-chip class="overline mt-4" label>Class: {{ vehicle.class }}</v-chip>
                                <v-chip class="overline mt-4" label>Model: {{ vehicle.display }}</v-chip>
                            </v-card-text>
                            <v-color-picker
                                v-model="color"
                                class="ma-2"
                                hide-canvas
                            ></v-color-picker>
                            <v-card-actions>
                                <button class="green--text text--lighten-1 overline flex-grow-1" @click="purchase(vehicle.name)" outlined>Purchase</button>
                            </v-card-actions>
                        </v-card>
                    </template>
                </div>
            </div>
        </div>
    `
});
