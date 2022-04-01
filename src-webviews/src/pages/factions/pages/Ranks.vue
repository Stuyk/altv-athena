<template>
    <div class="wrapper pl-2">Ranks</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';
import { Faction } from '../../../../../src/core/shared-plugins/core-factions/interfaces';

const ComponentName = 'Ranks';
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
