<template>
    <div class="logo-frame">
        <DropSlot @dropped="dropped">Drop Here</DropSlot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DropSlot from '../../components/DropSlot.vue';

const ComponentName = 'TestDrop';
export default defineComponent({
    name: ComponentName,
    components: {
        DropSlot,
    },
    methods: {
        dropped(dropInfo: string) {
            alert(`You Dropped: ${dropInfo} on the box.`);
        },
    },
});
</script>

<style scoped>
.drop-slot {
    position: fixed;
    left: 50vw;
    height: 100px;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: blue;
}
</style>
