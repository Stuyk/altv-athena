<template>
    <div class="stat-wrapper">
        <Icon :shadow="true" class="amber--text text--accent-4 mr-1" icon="icon-wallet" :size="14" />
        <span class="bank amber--text text--accent-4">{{ value.toLocaleString() }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import Icon from '@components/Icon.vue';

const ComponentName = 'Bank';
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
}

.bank {
    font-family: 'Roboto';
    font-size: 16px;
    font-weight: 600;
    text-shadow: 1px 1px black;
}
</style>
