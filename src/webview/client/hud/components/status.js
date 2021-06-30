const status = Vue.component('status', {
    data() {
        return {
            // On Foot
            food: 100,
            water: 100,
            // Vehicle
            fuel: 25,
            lock: 100,
            speed: '0 MP/H',
            inVehicle: false,
            seatbelt: false,
            engineState: false,
            interact: false,
            lights: false,
            lockState: 1,
            lockIcons: ['n/a', 'icon-unlocked', 'icon-lock', 'n/a', 'icon-blocked'],
            lockColor: ['n/a', 'grey darken-4', 'red lighten-2', 'n/a', 'orange'],
            engineColor: {
                false: 'grey darken-4',
                true: 'grey'
            },
            seatbeltColor: {
                false: 'grey darken-4',
                true: 'grey'
            },
            interactColor: {
                false: 'grey darken-4',
                true: 'grey'
            },
            lightsColor: {
                false: 'grey darken-4',
                true: 'grey'
            },
            objective: null
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

            if (!value) {
                this.seatbelt = false;
            }
        },
        setLock(value) {
            this.lockState = value;
        },
        setEngine(value) {
            this.engineState = value;
        },
        setSeatbelt(value) {
            this.seatbelt = value;
        },
        setInteract(value) {
            this.interact = value;
        },
        setLights(value) {
            this.lights = value;
        },
        setObjective(value) {
            this.objective = value;
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
            alt.on('hud:Seatbelt', this.setSeatbelt);
            alt.on('hud:SetInteract', this.setInteract);
            alt.on('hud:SetLights', this.setLights);
            alt.on('hud:SetObjective', this.setObjective);
        } else {
            this.objective = 'hello this is an objective text';
        }
    },
    beforeDestroy() {
        if (!('alt' in window)) {
            return;
        }

        alt.off('hud:SetFood', this.setFood);
        alt.off('hud:SetWater', this.setWater);
        alt.off('hud:SetFuel', this.setFuel);
        alt.off('hud:SetVehicle', this.setVehicle);
        alt.off('hud:Speed', this.setSpeed);
        alt.off('hud:SetLock', this.setLock);
        alt.off('hud:SetEngine', this.setEngine);
        alt.off('hud:Seatbelt', this.setSeatbelt);
        alt.off('hud:SetInteract', this.setInteract);
        alt.off('hud:SetLights', this.setLights);
        alt.off('hud:SetObjective', this.setObjective);
    },
    template: `
        <div class="statusWrapper pa-3">
            <div class="objective" v-if="objective">
                {{ objective }}
            </div>
            <div class="water rounder mb-3">
                <v-icon small class="icon">icon-droplet</v-icon>
                <div class="status-overlay light-blue lighten-2" :style="getTotalHeight('water')"></div>
            </div>
            <div class="food rounder" :class="inVehicle ? { 'mb-3': true } : {}">
                <v-icon small class="icon">icon-fastfood</v-icon>
                <div class="status-overlay orange lighten-2" :style="getTotalHeight('food')"></div>
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
                <div class="seatbelt rounder mb-3">
                    <v-icon class="icon" small>icon-seatbelt-fill</v-icon>
                    <div class="status-overlay" :class="seatbeltColor[seatbelt]" :style="getTotalHeight('lock')"></div>
                </div>
                <div class="headlight rounder">
                    <v-icon class="icon" small>icon-headlight-fill</v-icon>
                    <div class="status-overlay" :class="lightsColor[lights]" :style="getTotalHeight('lock')"></div>
                </div>
                <div class="speed">{{ speed }}</div>
            </template>
        </div>    
        `
});

// 1 unlock, 2 locked, 4 kidnap
