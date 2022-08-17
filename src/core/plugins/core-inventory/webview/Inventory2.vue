<template>
    <div class="page-wrap">
        <div class="main-frame">
            <Character />
            <div class="spacer" />
            <Inventory />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import WebViewEvents from '../../../../../src-webviews/src/utility/webViewEvents';
import { INVENTORY_EVENTS } from '../shared/events';

export const ComponentName = 'Inventory2';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Inventory: defineAsyncComponent(() => import('./components/Inventory.vue')),
        Character: defineAsyncComponent(() => import('./components/Character.vue')),
    },
    mounted() {
        WebViewEvents.emitReady(INVENTORY_EVENTS.PAGE);
    },
});
</script>

<style scoped>
@import '@/plugins/css/core-inventory/test.css';

.page-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    /* background: url('https://i.pinimg.com/originals/2a/c3/3a/2ac33ac33ee4fcc300e82307e39cebf9.jpg') !important; */
    /* background-size: cover; */
    min-width: 100vw;
    min-height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
}

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
