<template>
    <div class="wrapper pl-2">Bank</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Faction } from '../../shared/interfaces';
import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';

const ComponentName = 'Bank';
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
