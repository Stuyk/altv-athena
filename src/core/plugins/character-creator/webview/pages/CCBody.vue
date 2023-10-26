<template>
    <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-400 font-semibold z-20">
        <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
            <!-- Body Type / Sex -->
            <div class="flex flex-row justify-between items-center p-4 border border-neutral-700 rounded-md">
                <div class="w-24 pr-4 text-left text-sm">Body</div>
                <div class="flex flex-row justify-between items-center flex-grow">
                    <MenuButton @click="updateSex">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <span class="font text-xs">{{ props.character.sex ? 'Masculine' : 'Feminine' }}</span>
                    <MenuButton @click="updateSex">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Mother -->
            <div class="flex flex-row justify-between items-center p-4 border border-neutral-700 rounded-md">
                <div class="w-24 pr-4 text-left text-sm">Mother</div>
                <div class="flex flex-row justify-between items-center flex-grow">
                    <MenuButton @click="updateFace('faceMother', -1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <span class="font text-xs">{{ props.character.faceMother }}</span>
                    <MenuButton @click="updateFace('faceMother', 1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Father -->
            <div class="flex flex-row justify-between items-center p-4 border border-neutral-700 rounded-md">
                <div class="w-24 pr-4 text-left text-sm">Father</div>
                <div class="flex flex-row justify-between items-center flex-grow">
                    <MenuButton @click="updateFace('faceFather', -1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <span class="font text-xs">{{ props.character.faceFather }}</span>
                    <MenuButton @click="updateFace('faceFather', 1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Mother Skin -->
            <div class="flex flex-row justify-between items-center p-4 border border-neutral-700 rounded-md">
                <div class="w-24 pr-4 text-left text-sm">Mother Skin</div>
                <div class="flex flex-row justify-between items-center flex-grow">
                    <MenuButton @click="updateFace('skinMother', -1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <span class="font text-xs">{{ props.character.skinMother }}</span>
                    <MenuButton @click="updateFace('skinMother', 1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-400 font-semibold z-20 mt-2">
        <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
            <MenuButton @click="emit('go-back')">
                <Icon icon="icon-chevron-left" :size="12" />
                <span>Back</span>
            </MenuButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import MenuButton from '../components/MenuButton.vue';
import { Appearance } from '@AthenaShared/interfaces/appearance.js';

const props = defineProps<{ character: Appearance }>();
const emit = defineEmits<{ (e: 'set-menu', name: string): void; (e: 'go-back'): void }>();

function updateSex() {
    props.character.sex = props.character.sex ? 0 : 1;
}

function updateFace(type: 'faceMother' | 'faceFather' | 'skinMother' | 'skinFather', value: number) {
    props.character[type] += value;

    if (props.character[type] < 0) {
        props.character[type] = 45;
        return;
    }

    if (props.character[type] > 45) {
        props.character[type] = 0;
        return;
    }
}
</script>
