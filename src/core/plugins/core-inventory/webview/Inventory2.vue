<template>
    <div class="main-frame">
        <Character />
        <div class="spacer" />
        <Inventory />
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

export const ComponentName = 'Inventory2';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Inventory: defineAsyncComponent(() => import('./components/Inventory.vue')),
        Character: defineAsyncComponent(() => import('./components/Character.vue')),
    },
    data() {
        return {};
    },
    methods: {},
    mounted() {
        //
    },
    unmounted() {},
});
</script>

<style scoped>
.main-frame {
    display: flex;
    flex-direction: row;
    min-width: 1280px;
    max-width: 1280px;
    min-height: 720px;
    max-height: 720px;
    justify-content: space-between;
}
</style>
