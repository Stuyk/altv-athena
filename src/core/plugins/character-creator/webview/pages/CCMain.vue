<template>
    <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-400 font-semibold z-20">
        <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
            <MenuButton @click="emit('set-menu', 'body')">Body</MenuButton>
            <MenuButton @click="emit('set-menu', 'face')">Face</MenuButton>
            <MenuButton @click="emit('set-menu', 'hair')">Hair</MenuButton>
            <MenuButton @click="emit('set-menu', 'structure')">Structure</MenuButton>
            <MenuButton @click="emit('set-menu', 'details')">Details</MenuButton>
        </div>
    </div>
    <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-400 font-semibold z-20 mt-2">
        <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
            <MenuButton>
                <span>Done</span>
                <Icon icon="icon-checkmark" :size="12" />
            </MenuButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import MenuButton from '../components/MenuButton.vue';

const emit = defineEmits<{ (e: 'set-menu', name: string): void; (e: 'go-back'): void }>();
</script>

<style scoped></style>
