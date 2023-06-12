<template></template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';

function disableContext(e: MouseEvent) {
    e.preventDefault();
}

onUnmounted(() => {
    window.removeEventListener('contextmenu', disableContext);
});

onMounted(() => {
    window.addEventListener('contextmenu', disableContext);
});
</script>
