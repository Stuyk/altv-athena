<template>
    <div>
        <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-200 font-semibold z-20">
            <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
                <div class="text-xs p-1">Face Structure</div>
            </div>
        </div>
        <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-200 font-semibold z-20 mt-2">
            <div
                class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2 max-h-96 overflow-y-auto pr-2"
            >
                <!-- micro morphs -->
                <div
                    v-for="(name, index) in morphNames"
                    :key="index"
                    class="flex flex-row justify-between items-center p-1 border-b pb-3 border-neutral-700"
                >
                    <div class="w-24 pr-4 text-left text-xs">{{ name }}</div>
                    <div class="flex flex-row justify-between items-center flex-grow">
                        <span class="text-xs pr-2">-1.0</span>
                        <input
                            class="w-full accent-neutral-500"
                            type="range"
                            min="-1"
                            max="1"
                            step="0.1"
                            @input="(e: Event) => updateStructure(index, parseFloat(e.target['value']))"
                            :value="props.character.structure[index]"
                        />
                        <span class="text-xs pl-2">1.0</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-200 font-semibold z-20 mt-2">
            <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
                <MenuButton @click="emit('go-back')">
                    <Icon icon="icon-chevron-left" :size="12" />
                    <span>Back</span>
                </MenuButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MenuButton from '../components/MenuButton.vue';
import { Appearance } from '@AthenaShared/interfaces/appearance.js';

const morphNames = ref<string[]>([
    'Nose Width',
    'Nose Height',
    'Nose Length',
    'Nose Profile',
    'Nose Tip',
    'Nose Broke',
    'Brow Height',
    'Brow Depth',
    'Cheek Height',
    'Cheek Depth',
    'Cheek Puffed',
    'Eyes Size',
    'Lips Size',
    'Jaw Width',
    'Jaw Round',
    'Chin Height',
    'Chin Depth',
    'Chin Pointed',
    'Chin Dimple',
    'Neck Size',
]);

const props = defineProps<{ character: Appearance }>();
const emit = defineEmits<{
    (e: 'set-menu', name: string): void;
    (e: 'go-back'): void;
    (e: 'update-character'): void;
}>();

function updateStructure(index: number, value: number) {
    props.character.structure[index] = value;
    emit('update-character');
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
    width: 0.6rem;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}
</style>
