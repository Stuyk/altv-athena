<template>
    <div class="wrapper pl-2">Actions</div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Faction } from '../../shared/interfaces';

const ComponentName = 'Actions';
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
