<template>
    <div class="stack" style="color: white; text-shadow: 1px 1px black">
        <div class="stack">
            <p>{{ state }}</p>
            <p>{{ accountState }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as state from '@ViewUtility/state.js';

const ComponentName = 'StateTest';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            hp: 0,
            hpDebounce: 1,
        };
    },
    props: {
        state: {
            type: Object,
            required: true,
        },
        accountState: {
            type: Object,
            required: true,
        },
    },
});
</script>

<style scoped></style>
