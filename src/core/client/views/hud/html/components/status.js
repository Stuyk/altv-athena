const status = Vue.component('status', {
    data() {
        return {
            // On Foot
            food: 100,
            water: 50,
            // Vehicle
            fuel: 25,
            lock: 100,
            speed: '0 MP/H',
            inVehicle: false,
            seatbelt: false,
            engineState: false,
            lockState: 1,
            lockIcons: ['n/a', 'icon-unlocked', 'icon-lock', 'n/a', 'icon-blocked'],
            lockColor: ['n/a', 'grey darken-4', 'red darken-1', 'n/a', 'orange'],
            engineColor: {
                false: 'grey darken-4',
                true: 'green darken-1'
            },
            seatbeltColor: {
                false: 'grey darken-4',
                true: 'green darken-1'
            }
        };
    },
    methods: {
        setWater(value) {
            this.water = value;
        },
        setFood(value) {
            this.food = value;
        },
        setFuel(value) {
            this.fuel = value;
        },
        setLock(value) {
            this.lockState = value;
        },
        setSpeed(value) {
            this.speed = value;
        },
        setVehicle(value) {
            this.inVehicle = value;
        },
        setLock(value) {
            this.lockState = value;
        },
        setEngine(value) {
            this.engineState = value;
        },
        getTotalHeight(name) {
            return `height: ${this[name]}% !important;`;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('hud:SetFood', this.setFood);
            alt.on('hud:SetWater', this.setWater);
            alt.on('hud:SetFuel', this.setFuel);
            alt.on('hud:SetVehicle', this.setVehicle);
            alt.on('hud:Speed', this.setSpeed);
            alt.on('hud:SetLock', this.setLock);
            alt.on('hud:SetEngine', this.setEngine);
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off('hud:SetFood', this.setFood);
            alt.off('hud:SetWater', this.setWater);
            alt.off('hud:SetFuel', this.setFuel);
            alt.off('hud:SetVehicle', this.setVehicle);
            alt.off('hud:Speed', this.setSpeed);
        }
    },
    template: `
        <div class="statusWrapper pa-3">
            <div class="water rounder mb-3">
                <v-icon small class="icon">icon-droplet</v-icon>
                <div class="status-overlay light-blue lighten-1" :style="getTotalHeight('water')"></div>
            </div>
            <div class="food rounder" :class="inVehicle ? { 'mb-3': true } : {}">
                <v-icon small class="icon">icon-fastfood</v-icon>
                <div class="status-overlay orange darken-1" :style="getTotalHeight('food')"></div>
            </div>
            <template v-if="inVehicle">
                <div class="fuel rounder mb-3">
                    <v-icon small class="icon">icon-local_gas_station</v-icon>
                    <div class="status-overlay red lighten-1" :style="getTotalHeight('fuel')"></div>
                </div>
                <div class="fuel rounder mb-3">
                    <v-icon small class="icon">{{ lockIcons[lockState] }}</v-icon>
                    <div class="status-overlay" :class="lockColor[lockState]" :style="getTotalHeight('lock')"></div>
                </div>
                <div class="engine rounder mb-3">
                    <v-icon class="icon" small>icon-engine-fill</v-icon>
                    <div class="status-overlay" :class="engineColor[engineState]" :style="getTotalHeight('lock')"></div>
                </div>
                <div class="seatbelt rounder">
                    <v-icon class="icon" small>icon-seatbelt-fill</v-icon>
                    <div class="status-overlay" :class="seatbeltColor[seatbelt]" :style="getTotalHeight('lock')"></div>
                </div>
                <div class="speed">{{ speed }}</div>
            </template>
        </div>    
        `
});

// 1 unlock, 2 locked, 4 kidnap
