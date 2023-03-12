<template>
    <div class="page-wrap" @click="clearContext">
        <div class="main-frame">
            <Grid :offclick="offclick" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

export const ComponentName = 'Inventory';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Grid: defineAsyncComponent(() => import('./components/Grid.vue')),
    },
    data() {
        return {
            offclick: 0,
        };
    },
    methods: {
        clearContext() {
            this.offclick += 1;
        },
    },
    mounted() {
        // Ready event is emitted inside of Grid.vue
    },
});
</script>

<style scoped>
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
    max-height: 635px;
    justify-content: flex-end;
    box-sizing: border-box;
    padding-right: 24px;
    padding-left: 24px;
}
</style>
