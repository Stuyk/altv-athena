<template>
    <div class="stat-wrapper">
        <div class="split space-between">
            <div class="bar">
                <Icon :shadow="true" class="stat-icon" icon="icon-heart" :size="18" v-if="value >= 100" />
                <Icon :shadow="true" class="stat-icon" icon="icon-death-skull" :size="18" v-if="value <= 99" />
                <div class="fill" :style="getFill" :class="getClass" />
                <div class="bar-shadow"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'Health';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    props: {
        value: {
            type: Number,
            default: 99,
        },
    },
    computed: {
        getClass() {
            const actualValue = this.value - 99;
            if (actualValue <= 25) {
                return { 'fill-twenty-five': true };
            }

            if (actualValue <= 50) {
                return { 'fill-fifty': true };
            }

            return {};
        },
        getFill() {
            const actualValue = this.value - 99;
            return `height: ${actualValue}% !important`;
        },
    },
});
</script>

<style scoped>
.stat-wrapper {
    display: flex;
    flex-direction: row;
}

.bar {
    display: block;
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    min-width: 45px;
    max-width: 45px;
    min-height: 45px;
    max-height: 45px;
    border-radius: 45px;
    overflow: hidden;
    border: 2px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 0px 4px rgba(0, 0, 0, 0.2);
}

.bar-shadow {
    display: block;
    position: relative;
    box-sizing: border-box;
    min-width: 49px;
    max-width: 49px;
    min-height: 49px;
    max-height: 49px;
    border-radius: 50px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset 0px 0px 0px 6px rgba(0, 0, 0, 0.3);
    z-index: 50;
    left: -4px;
    top: -4px;
    mix-blend-mode: overlay;
}

.stat-icon {
    display: flex;
    color: white;
    align-items: center;
    justify-content: center;
    min-width: 45px;
    max-width: 45px;
    min-height: 45px;
    max-height: 45px;
    position: absolute;
    z-index: 99;
    opacity: 0.5;
    left: -4px;
    top: -2px;
    mix-blend-mode: lighten;
}

.fill {
    position: absolute;
    background: #ef5350;
    z-index: 25;
    min-width: 65px;
    box-sizing: border-box;
    bottom: 0px;
    animation: healthy 5s infinite ease-in-out;
    outline: 1px solid transparent;
}

.fill-fifty {
    background: #c93d3a;
    animation: fifty 3s infinite ease-in-out !important;
}

.fill-twenty-five {
    background: #9a2422;
    animation: twentyfive 1s infinite ease-in-out !important;
}

@keyframes healthy {
    0% {
        background: #ef5350;
    }
    25% {
        background: #c93d3a;
    }
    75% {
        background: #c93d3a;
    }
    100% {
        background: #ef5350;
    }
}

@keyframes fifty {
    0% {
        background: #c93d3a;
    }
    25% {
        background: #9a2422;
    }
    75% {
        background: #9a2422;
    }
    100% {
        background: #c93d3a;
    }
}

@keyframes twentyfive {
    0% {
        background: #9a2422;
    }
    25% {
        background: #6a1312;
    }
    75% {
        background: #6a1312;
    }
    100% {
        background: #9a2422;
    }
}
</style>
