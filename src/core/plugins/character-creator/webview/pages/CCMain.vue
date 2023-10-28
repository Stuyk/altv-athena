<template>
    <div>
        <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-200 font-semibold z-20">
            <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
                <div class="text-xs p-1">Create Character</div>
            </div>
        </div>
        <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-200 font-semibold z-20 mt-2">
            <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
                <MenuButton @click="emit('set-menu', 'body')" class="flex-grow">
                    <span>Body & Face</span>
                    <Icon :size="18" icon="icon-man" />
                </MenuButton>

                <MenuButton @click="emit('set-menu', 'structure')">
                    <span>Face Structure</span>
                    <Icon :size="18" icon="icon-person" />
                </MenuButton>

                <MenuButton @click="emit('set-menu', 'hair')">
                    <span>Hair</span>
                    <Icon :size="18" icon="icon-hair" />
                </MenuButton>

                <MenuButton @click="emit('set-menu', 'blemishes')">
                    <span>Blemishes</span>
                    <Icon :size="18" icon="icon-large-wound" />
                </MenuButton>

                <MenuButton @click="emit('set-menu', 'details')">
                    <span>Details</span>
                    <Icon :size="18" icon="icon-makeup" />
                </MenuButton>
            </div>
        </div>
        <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-200 font-semibold z-20 mt-2">
            <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
                <MenuButton>
                    <span>Done</span>
                    <Icon icon="icon-checkmark" :size="12" />
                </MenuButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import MenuButton from '../components/MenuButton.vue';

const emit = defineEmits<{ (e: 'set-menu', name: string): void; (e: 'go-back'): void }>();
</script>

<style scoped></style>
