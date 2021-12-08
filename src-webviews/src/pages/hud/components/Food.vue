<template>
    <div class="stat-wrapper">
        <div class="split space-between">
            <div class="bar">
                <div class="fill" :style="getFill" />
            </div>
            <Icon :shadow="true" class="food-icon ml-4" icon="icon-fastfood" :size="18"></Icon>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '../../../components/Icon.vue';

const ComponentName = 'Food';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon,
    },
    props: {
        value: {
            type: Number,
            default: 199,
        },
    },
    computed: {
        getFill() {
            return `width: ${this.value}% !important`;
        },
    },
});
</script>

<style scoped>
.stat-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.2);
    padding: 8px;
    padding-right: 16px;
    padding-left: 16px;
    right: -50px;
    transform: skew(-15deg);
}

.food-icon {
    position: relative;
    z-index: 99;
    opacity: 0.85;
    padding-right: 50px;
    transform: skew(15deg);
}

.bar {
    display: block;
    position: relative;
    background: rgba(136, 136, 136, 0.5);
    box-sizing: border-box;
    min-width: 88px;
    max-width: 88px;
    min-height: 10px;
    max-height: 10px;
    border-radius: 5px;
    transform: skewX(-10deg);
    box-shadow: -1px 1px black;
    margin-top: 2px;
    transform: scaleX(-1) skew(-15deg);
}

.fill {
    position: absolute;
    background: #ff9800;
    z-index: 25;
    height: 100%;
    box-sizing: border-box;
    bottom: 0px;
    border-radius: 5px;
}
</style>
