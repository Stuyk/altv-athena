<template>
    <div class="stat-wrapper">
        <span class="bank overline mr-4">{{ value }}</span>
        <Icon :shadow="true" icon="icon-user2" :size="14" />
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'Identifier';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    props: {
        value: {
            type: Number,
            default: 199,
        },
    },
});
</script>

<style scoped>
.stat-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
    position: relative;
    opacity: 0.75 !important;
}

.bank {
    font-family: 'Inter';
    font-size: 16px !important;
    font-weight: 600;
    text-shadow: 1px 1px black;
}
</style>
