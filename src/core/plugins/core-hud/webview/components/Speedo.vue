<template>
    <div class="stat-wrapper">
        <div class="even-split">
            <span class="fuel-name pr-2">
                <em>F</em>
            </span>
            <div class="fuel ml-2">
                <div class="fuel-fill" :style="getFuelStyle" />
            </div>
        </div>
        <div class="stat-split">
            <div class="speed-wrapper">
                <span class="speed-placeholder">
                    <em>{{ getSpeedPlaceholder }}</em>
                </span>
                <span class="speed">
                    <em>{{ getSpeed }}</em>
                </span>
            </div>
            <div class="stack">
                <div class="split space-between status">
                    <div class="seatbelt" :class="getSeatbeltClass">
                        <em><Icon icon="icon-seatbelt-fill" :size="18" id="seatbelt"/></em>
                    </div>
                    <div class="engine" :class="getEngineClass">
                        <em>E</em>
                    </div>
                    <div class="lock" :class="getLockClass">
                        <em>{{ lock ? 'L' : 'U' }}</em>
                    </div>
                    <div class="gear">
                        <em>{{ gear === 0 ? 'R' : gear }}</em>
                    </div>
                </div>
                <div class="metrics">
                    <em>{{ isMetric ? 'KMH' : 'MPH' }}</em>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import Icon from '@components/Icon.vue';

const ComponentName = 'Speedo';
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
        engine: {
            type: Boolean,
            required: true,
        },
        seatbelt: {
            type: Boolean,
            required: true,
        },
        fuel: {
            type: Number,
            default: 50,
            required: true,
        },
        lock: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        getSpeedPlaceholder() {
            if (this.speed.toString().length <= 1) {
                return `00`;
            }

            if (this.speed.toString().length <= 2) {
                return `0`;
            }

            return '';
        },
        getSpeed() {
            return this.speed;
        },
        getEngineClass() {
            if (this.engine) {
                return { 'amber--text': true, 'amber--hover--static': true };
            }

            return { 'grey--text': true };
        },
        getSeatbeltClass() {
            if (this.seatbelt) {
                return { 'amber--text': true, 'amber--hover--static': true };
            }

            return { 'grey--text': true };
        },
        getLockClass() {
            if (this.lock) {
                return { 'orange--text': true, 'orange--hover--static': true };
            }

            return { 'green--text': true, 'green--hover--static': true };
        },
        getFuelStyle() {
            return `width: ${this.fuel}% !important;`;
        },
    },
});
</script>

<style scoped>
.stat-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: flex-end;
    transform: skewX(10deg);
    min-width: 336px;
    padding-right: 1.2vw;
    box-sizing: border-box;
}

.stat-split {
    display: flex;
    flex-direction: row;
    position: relative;
    justify-content: flex-start;
}

.even-split {
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
}

.speed-wrapper {
    display: flex;
    min-width: 100px;
    max-width: 100px;
    justify-content: flex-end;
    justify-items: center;
    align-items: center;
    align-content: center;
    padding-right: 12px;
}

.speed,
.speed-placeholder {
    font-family: 'Barlow Semi Condensed', sans-serif;
    font-size: 64px;
    font-weight: 500;
    text-shadow: 1px 1px black;
    padding: 0 !important;
    margin: 0 !important;
    line-height: 14px;
    transform: skewX(-5deg);
}

.status {
    min-width: 75px;
}

.speed-placeholder {
    right: 0;
    opacity: 0.5;
    text-shadow: unset !important;
}

.metrics {
    font-family: 'Barlow Semi Condensed', sans-serif;
    font-size: 22px;
    font-weight: 500;
    text-shadow: 1px 1px black;
    transform: skewX(-5deg);
}

.gear,
.seatbelt,
.engine,
.lock,
.fuel-name {
    font-family: 'Barlow Semi Condensed', sans-serif;
    font-size: 18px;
    font-weight: 500;
    text-shadow: 1px 1px black;
    transform: skewX(-5deg);
}

.fuel-name {
    position: relative;
    padding-left: 20px;
    top: -2px;
}

.fuel {
    display: flex;
    position: relative;
    height: 10px;
    width: 100%;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    margin-bottom: 4px;
    box-shadow: 1px 1px black;
}

.fuel-fill {
    position: absolute;
    min-height: 10px !important;
    background-color: #ef5350;
    height: 100% !important;
    border-radius: 5px;
}
</style>
