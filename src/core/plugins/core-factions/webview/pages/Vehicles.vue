<template>
    <div class="wrapper pl-2">Vehicles</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import { Faction } from '../../shared/interfaces';

const ComponentName = 'Vehicles';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: Object as () => Faction,
    },
    components: {
        Button,
        Icon,
    },
    computed: {},
    methods: {},
});
</script>

<style scoped></style>
