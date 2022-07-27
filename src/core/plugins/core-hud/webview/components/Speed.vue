<template>
    <div class="speed-text speed-font-style">
        <div v-for="(number, index) in getSpeed" :key="index" class="speed-number-overlay" :style="getSpeedColor">
            {{ number }}
        </div>
    </div>
    <div class="speed-text speed-font-style">
        <div v-for="(number, index) in getSpeed" :key="index" class="speed-number">
            {{ number }}
        </div>
    </div>
    <div class="speed-type speed-font-style">
        {{ isMetric ? 'KMH' : 'MPH' }}
    </div>
    <div class="gear speed-font-style">
        {{ gear }}
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'Speed';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    props: {
        speed: {
            type: Number,
            required: true,
        },
        isMetric: {
            type: Boolean,
            required: true,
        },
        gear: {
            type: Number,
            required: true,
        },
    },
    computed: {
        getSpeed(): Array<string> {
            let speedValue = `${this.speed}`;

            if (this.speed.toString().length <= 2) {
                speedValue = `0` + `${this.speed}`;
            }

            if (this.speed.toString().length <= 1) {
                speedValue = `00` + `${this.speed}`;
            }

            if (this.speed === 0) {
                speedValue = `000`;
            }

            return speedValue.split('');
        },
        getSpeedColor() {
            //
            if ((this.isMetric && this.speed >= 160) || (!this.isMetric && this.speed >= 100)) {
                return 'opacity: 1 !important';
            }

            const maxValue = this.isMetric ? 160 : 100;
            return `opacity: ${this.speed / maxValue} !important`;
        },
    },
});
</script>

<style scoped>
.speed-font-style {
    font-family: 'Oswald', sans-serif;
    font-size: 48px;
    font-weight: 400 !important;
}

.speed-text {
    display: flex;
    flex-direction: row;
    color: rgba(255, 255, 255, 0.75);
    /* text-shadow: 1px 1px black; */
    min-width: 200px;
    justify-content: space-evenly;
}

.speed-text .speed-number,
.speed-text .speed-number-overlay {
    position: fixed;
    bottom: 38px;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    font-style: italic;
}

.speed-number-overlay {
    color: rgb(255, 69, 0);
    z-index: 99;
    opacity: 0;
}

.gear {
    position: fixed;
    font-style: italic;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    bottom: 73px;
    font-size: 16px;
    right: 22px;
}

.speed-type {
    position: fixed;
    font-style: italic;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    bottom: 48px;
    font-size: 12px;
    right: 22px;
}

.speed-text .speed-number:nth-child(1),
.speed-text .speed-number-overlay:nth-child(1) {
    position: fixed;
    right: calc(56px * 2.4);
}

.speed-text .speed-number:nth-child(2),
.speed-text .speed-number-overlay:nth-child(2) {
    position: fixed;
    right: calc(56px * 1.7);
}

.speed-text .speed-number:nth-child(3),
.speed-text .speed-number-overlay:nth-child(3) {
    position: fixed;
    right: 56px;
}
</style>
