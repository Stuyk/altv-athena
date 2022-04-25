<template>
    <div class="wrapper pl-2">Vehicles</div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Faction } from '../../shared/interfaces';

const ComponentName = 'Vehicles';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: Object as () => Faction,
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    computed: {},
    methods: {},
});
</script>

<style scoped></style>
