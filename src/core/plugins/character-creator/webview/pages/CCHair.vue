<template>
    <div>
        <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-200 font-semibold z-20">
            <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
                <div class="text-xs p-1">Hair</div>
            </div>
        </div>
        <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-200 font-semibold z-20 mt-2">
            <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-3 max-h-96 overflow-y-scroll">
                <!-- Hairstyle -->
                <div class="flex flex-row justify-between items-center p-1 border-b pb-3 pt-2 border-neutral-700">
                    <div class="w-24 pr-4 text-left text-xs">Hairstyle</div>
                    <div class="flex flex-row justify-between items-center flex-grow">
                        <MenuButton @click="updateHair(-1)">
                            <Icon icon="icon-chevron-left" :size="12" />
                        </MenuButton>
                        <span class="font text-xs">{{ props.character.hair }}</span>
                        <MenuButton @click="updateHair(1)">
                            <Icon icon="icon-chevron-right" :size="12" />
                        </MenuButton>
                    </div>
                </div>
                <!-- Hair Color -->
                <MenuCollapse title="Hair Color" class="border-b border-neutral-700 pb-2">
                    <div
                        class="flex flex-col justify-center p-1 bg-neutral-950 rounded mr-3 mt-2 border border-neutral-700"
                    >
                        <div class="flex flex-row flex-wrap flex-grow gap-2 mt-4 mb-4 pl-3">
                            <div
                                v-for="(color, index) in props.colorMaximums.primary"
                                :key="index"
                                :style="getColorPickerStyle(color)"
                                @click="updateHairColor('hairColor1', index)"
                                class="w-5 h-5 flex items-center justify-center border border-transparent hover:border-neutral-700 hover:cursor-pointer hover:scale-125 rounded"
                                :class="props.character.hairColor1 === index ? ['scale-125'] : []"
                            >
                                <Icon :size="12" icon="icon-check" v-if="props.character.hairColor1 === index" />
                            </div>
                        </div>
                    </div>
                </MenuCollapse>
                <!-- Hair Highlight -->
                <MenuCollapse title="Hair Highlight" class="border-b border-neutral-700 pb-2">
                    <div
                        class="flex flex-col justify-center p-1 bg-neutral-950 rounded mr-3 mt-2 border border-neutral-700"
                    >
                        <div class="flex flex-row flex-wrap flex-grow gap-2 mt-4 mb-4 pl-3">
                            <div
                                v-for="(color, index) in props.colorMaximums.primary"
                                :key="index"
                                :style="getColorPickerStyle(color)"
                                @click="updateHairColor('hairColor2', index)"
                                class="w-5 h-5 flex items-center justify-center border border-transparent hover:border-neutral-700 hover:cursor-pointer hover:scale-125 rounded"
                                :class="props.character.hairColor2 === index ? ['scale-125'] : []"
                            >
                                <Icon :size="12" icon="icon-check" v-if="props.character.hairColor2 === index" />
                            </div>
                        </div>
                    </div>
                </MenuCollapse>
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
import MenuButton from '../components/MenuButton.vue';
import MenuCollapse from '../components/MenuCollapse.vue';
import { Appearance } from '@AthenaShared/interfaces/appearance.js';

const props = defineProps<{
    character: Appearance;
    overlayMaximums: { [overlay: number]: number };
    colorMaximums: {
        primary: { r: number; g: number; b: number }[];
        secondary: { r: number; g: number; b: number }[];
    };
}>();

const emit = defineEmits<{
    (e: 'set-menu', name: string): void;
    (e: 'go-back'): void;
    (e: 'update-character'): void;
}>();

const hairLimit = {
    0: 80, // Female
    1: 76, // Male
};

function getColorPickerStyle(color: { r: number; g: number; b: number }) {
    return `background-color: rgb(${color.r}, ${color.g}, ${color.b})`;
}

function updateHair(value: number) {
    props.character.hair += value;

    if (props.character.hair < 0) {
        props.character.hair = hairLimit[props.character.sex];
    }

    if (props.character.hair > hairLimit[props.character.sex]) {
        props.character.hair = 0;
    }

    emit('update-character');
}

function updateHairColor(type: 'hairColor1' | 'hairColor2', index: number) {
    props.character[type] = index;
    emit('update-character');
}
</script>

<style scoped>
.overflow-y-scroll::-webkit-scrollbar {
    width: 0.6rem;
}

.overflow-y-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

.overflow-y-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
}

.overflow-y-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}
</style>
