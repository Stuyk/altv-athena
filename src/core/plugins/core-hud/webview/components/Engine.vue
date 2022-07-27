<template>
    <div class="stat-wrapper">
        <div class="split space-between">
            <div class="bar">
                <Icon :shadow="false" class="stat-icon" :class="getStatus" icon="icon-engine-fill" :size="12" />
                <div class="bar-shadow"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'Engine';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    props: {
        status: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        getStatus() {
            return this.status ? { 'stat-icon-on': true } : {};
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
    min-width: 25px;
    max-width: 25px;
    min-height: 25px;
    max-height: 25px;
    border-radius: 25px;
    overflow: hidden;
    border: 2px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.bar-shadow {
    display: block;
    position: relative;
    box-sizing: border-box;
    min-width: 29px;
    max-width: 29px;
    min-height: 29px;
    max-height: 29px;
    border-radius: 50px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.3);
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
    min-width: 25px;
    max-width: 25px;
    min-height: 25px;
    max-height: 25px;
    position: absolute;
    z-index: 99;
    /* opacity: 0.5; */
    left: -4px;
    top: -2px;
    /* mix-blend-mode: lighten; */
    color: rgba(255, 255, 255, 0.5);
}

.stat-icon-on {
    color: #1cdeb8;
    text-shadow: 0px 0px 6px #1cdeb8;
}

@keyframes glow {
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
</style>
