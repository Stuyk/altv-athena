<template>
    <div class="stat-wrapper">
        <span class="crossstreet"> {{ value.toLocaleString() }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import Icon from '@components/Icon.vue';

const ComponentName = 'CrossStreet';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    props: {
        value: {
            type: String,
            default: 'Low Power St',
        },
    },
});
</script>

<style scoped>
.stat-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: left;
    justify-items: left;
    align-items: left;
    align-content: left;
    position: left;
}

.crossstreet {
    font-family: 'Roboto';
    font-size: 16px;
    font-weight: 500;
    text-shadow: 1px 1px black;
    text-align: left;
}
</style>
