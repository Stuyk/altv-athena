<template>
    <div class="wrapper-chat" :style="getWrapperStyle">
        <div class="interaction-placement" v-if="interactions.length >= 1" :key="updateCount">
            <Interaction
                class="mb-4"
                v-for="(data, index) in interactions"
                :key="index"
                :keyPress="data.keyPress"
                :description="data.description"
            />
        </div>

        <div class="speedo-placement" v-if="isInVehicle">
            <Speedo
                :isMetric="isMetric"
                :speed="speed"
                :gear="gear"
                :engine="engine"
                :lock="lock"
                :fuel="fuel"
                :seatbelt="seatbelt"
            />
        </div>
        <div class="info-placement mb-4">
            <Cash class="mb-2" :value="cash" />
            <Bank class="mb-2" :value="bank" />
            <Time class="mb-2" :value="time" />
        </div>
        <div class="icon-placement">
            <Water class="mb-2" :value="water" />
            <Food class="mb-2" :value="food" />
            <Armour class="mb-2" :value="armour" />
            <Health class="mb-2" :value="health" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import WebViewEvents from '../../../../../src-webviews/src/utility/webViewEvents';

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'Hud';
export default defineComponent({
    name: ComponentName,
    // Used to add Custom Components
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Armour: defineAsyncComponent(() => import('./components/Armour.vue')),
        Cash: defineAsyncComponent(() => import('./components/Cash.vue')),
        Food: defineAsyncComponent(() => import('./components/Food.vue')),
        Interaction: defineAsyncComponent(() => import('./components/Interaction.vue')),
        Health: defineAsyncComponent(() => import('./components/Health.vue')),
        Water: defineAsyncComponent(() => import('./components/Water.vue')),
        Bank: defineAsyncComponent(() => import('./components/Bank.vue')),
        Speedo: defineAsyncComponent(() => import('./components/Speedo.vue')),
        Time: defineAsyncComponent(() => import('./components/Time.vue')),
    },
    // Used to define state
    data() {
        return {
            health: 199,
            armour: 50,
            food: 85,
            water: 50,
            cash: 5000000,
            bank: 1000000,
            time: '05:53 PM',
            speed: 99,
            engine: false,
            gear: 0,
            fuel: 0,
            lock: false,
            seatbelt: false,
            isMetric: false,
            isInVehicle: false,
            interactions: [] as Array<{ keyPress: string; description: string }>,
            updateCount: 0,
        };
    },
    mounted() {
        if ('alt' in window) {
            alt.on(`${ComponentName}:SetProp`, this.setProp);
            WebViewEvents.emitReady(ComponentName);
        } else {
            this.isInVehicle = true;
            this.setProp(
                'interactions',
                JSON.stringify([
                    { keyPress: 'E', description: 'Press To Do Something' },
                    { keyPress: 'F', description: 'Help Me' },
                    { keyPress: 'G', description: 'Do Not Buy Doge Coin' },
                ]),
                true,
            );
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(`${ComponentName}:SetProp`, this.setProp);
        }
    },
    computed: {
        getWrapperStyle() {
            if ('alt' in window) {
                return '';
            }

            return `background: url('https://i.imgur.com/wtCnL7Z.jpeg') !important; background-size: 100% 100% !important;`;
        },
    },
    methods: {
        setProp(propName: string, propValue: any, isJSON = false) {
            let wasJSON = false;

            // Handle JSON Data Passed from Client
            if (isJSON) {
                propValue = JSON.parse(propValue);
                wasJSON = true;
            }

            this[propName] = propValue;

            if (wasJSON) {
                this.updateCount += 1;
            }
        },
    },
});
</script>

<style>
.wrapper-chat {
    display: flex;
    position: absolute;
    min-height: 100vh;
    min-width: 100vw;
    overflow: hidden;
}

.interaction-placement {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 15vh;
    right: 0;
    min-width: 300px;
}

.info-placement {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 5vh;
    right: 1vw;
    justify-content: flex-end;
    align-items: flex-end;
}

.icon-placement {
    display: flex;
    flex-direction: column-reverse;
    position: fixed;
    bottom: 0;
    right: 0;
    justify-content: flex-end;
    align-items: flex-end;
    border-radius: 12px !important;
    margin-bottom: 90px;
}

.speedo-placement {
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    right: -50px;
    justify-content: flex-end;
    align-items: flex-end;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-bottom: 0px;
    padding-bottom: 0.8vh;
    transform: skewX(-15deg);
    padding-top: 8px;
    padding-right: 50px;
}
</style>
