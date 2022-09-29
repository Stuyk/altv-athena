<template>
    <div class="stack" style="color: black">
        <div class="stack">
            <div>Health: {{ state.hp ? state.hp : 'Not Defined' }}</div>
            <div>Armour: {{ state.armour ? state.armour : 'Not Defined' }}</div>
            <div>Random: {{ state.random ? state.random : 'Not Defined' }}</div>
        </div>
        <div class="stack">
            <h2>Delayed Changes...</h2>
            <div>Health: {{ hp ? hp : 'Not Defined' }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
    },
    watch: {
        'state.hp': {
            handler(newValue) {
                if (Date.now() < this.hpDebounce) {
                    return;
                }

                this.hpDebounce = Date.now() + 500;
                this.hp = newValue;
            },
        },
    },
    methods: {
        test() {
            this.hpDebounce;
        },
    },
});
</script>

<style scoped></style>
