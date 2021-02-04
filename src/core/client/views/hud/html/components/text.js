const status = Vue.component('status', {
    data() {
        return {
            interaction: false
        };
    },
    methods: {
        setInteraction(value) {
            this.water = value;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('hud:SetInteraction', this.setInteraction);
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off('hud:SetInteraction', this.setInteraction);
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
