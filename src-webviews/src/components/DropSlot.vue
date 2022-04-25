<template>
    <div class="drop-slot" id="drop-slot">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const ComponentName = 'DropSlot';
export default defineComponent({
    name: ComponentName,
    methods: {
        dropped(e) {
            if (!e.detail) {
                return;
            }

            this.$emit('dropped', e.detail);
        },
    },
    mounted() {
        document.addEventListener('drop-slot', this.dropped);
    },
    unmounted() {
        document.removeEventListener('drop-slot', this.dropped);
    },
});
</script>

<style scoped>
.drop-slot {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
