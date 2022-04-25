<template>
    <div class="key-wrapper">
        <div class="description pa-2 pr-4 pl-4">
            <span class="description-text">{{ description }}</span>
        </div>
        <div class="keyPress amber--text">
            <span class="keyPress-text">{{ keyPress }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import Icon from '@components/Icon.vue';

const ComponentName = 'Interaction';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    props: {
        keyPress: {
            type: String,
            default: 'E',
        },
        description: {
            type: String,
            default: 'Enter the Vehicle',
        },
    },
});
</script>

<style scoped>
.key-wrapper {
    display: flex;
    position: relative;
    flex-direction: row;
    align-self: center;
    width: 100%;
    justify-content: flex-end;
    /* animation: slide-in-right 1s ease-in-out; */
}

/* @keyframes slide-in-right {
    0% {
        opacity: 0;
        right: -300px;
    }
    100% {
        opacity: 1;
        right: 0px;
    }
} */

.description {
    display: flex;
    position: relative;
    font-family: 'Roboto';
    text-shadow: 1px 1px black;
    font-weight: 600;
    min-height: 35px;
    max-height: 35px;
    align-items: center;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.2);
    transform: skew(-15deg);
    right: -50px;
    margin-right: 3px;
}

.description-text,
.keyPress-text {
    transform: skew(15deg);
}

.keyPress {
    display: flex;
    position: relative;
    min-height: 35px;
    max-height: 35px;
    width: 100px;
    justify-content: flex-start;
    padding-left: 15px;
    font-family: 'Barlow Semi Condensed', sans-serif;
    font-weight: 800;
    font-size: 16px;
    color: white;
    text-shadow: 0px 0px 3px black;
    align-items: center;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.2);
    transform: skew(-15deg);
    right: -50px;
}
</style>
