<template>
    <div class="stat-wrapper">
        <div class="split space-between">
            <div class="bar">
                <Icon :shadow="true" class="stat-icon" icon="icon-microphone" :size="18" v-if="value" />
                <Icon :shadow="true" class="stat-icon" icon="icon-microphone-slash" :size="18" v-else />
                <div class="fill" :style="getFill" />
                <div class="bar-shadow"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'Microphone';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        getFill() {
            if (this.value) {
                return `height: 100% !important; background-color: #447c44;`;
            }

            return `height: 100% !important; background-color: #6a6a6a;`;
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
    background: #6a6a6a;
    z-index: 25;
    min-width: 65px;
    box-sizing: border-box;
    bottom: 0px;
    outline: 1px solid transparent;
}
</style>
