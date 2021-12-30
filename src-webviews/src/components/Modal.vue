<template>
    <div class="modal-page">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const ComponentName = 'Modal';
export default defineComponent({
    name: ComponentName,
});
</script>

<style scoped>
.modal-page {
    display: flex;
    position: fixed;
    left: 0;
    top: 0;
    min-width: 100vw;
    min-height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    flex-direction: column;
    user-select: none;
    justify-content: center;
    align-content: center;
    align-items: center;
    justify-items: center;
    z-index: 999;
    background: rgba(0, 0, 0, 0.7);
}
</style>
