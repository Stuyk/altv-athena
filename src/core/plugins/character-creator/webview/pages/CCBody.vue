<template>
    <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-400 font-semibold z-20">
        <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
            <!-- Body Type / Sex -->
            <div class="flex flex-row justify-between items-center p-2 border border-neutral-700 rounded-md">
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
            <div class="flex flex-row justify-between items-center p-2 border border-neutral-700 rounded-md">
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
            <div class="flex flex-row justify-between items-center p-2 border border-neutral-700 rounded-md">
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
            <div class="flex flex-row justify-between items-center p-2 border border-neutral-700 rounded-md">
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
            <!-- Father Skin -->
            <div class="flex flex-row justify-between items-center p-2 border border-neutral-700 rounded-md">
                <div class="w-24 pr-4 text-left text-sm">Father Skin</div>
                <div class="flex flex-row justify-between items-center flex-grow">
                    <MenuButton @click="updateFace('skinFather', -1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <span class="font text-xs">{{ props.character.skinFather }}</span>
                    <MenuButton @click="updateFace('skinFather', 1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Face Blend -->
            <div class="flex flex-row justify-between items-center p-2 border border-neutral-700 rounded-md">
                <div class="w-24 pr-4 text-left text-sm">Face Mix</div>
                <div class="flex flex-row justify-between items-center flex-grow">
                    <MenuButton @click="updateBlend('faceMix', -0.1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <span class="font text-xs">{{ props.character.faceMix.toFixed(1) }}</span>
                    <MenuButton @click="updateBlend('faceMix', 0.1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Skin Blend -->
            <div class="flex flex-row justify-between items-center p-2 border border-neutral-700 rounded-md">
                <div class="w-24 pr-4 text-left text-sm">Skin Mix</div>
                <div class="flex flex-row justify-between items-center flex-grow">
                    <MenuButton @click="updateBlend('skinMix', -0.1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <span class="font text-xs">{{ props.character.skinMix.toFixed(1) }}</span>
                    <MenuButton @click="updateBlend('skinMix', 0.1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Randomize All -->
            <div class="flex flex-row select-none flex-grow rounded m-2 text-center gap-2">
                <MenuButton @click="randomizeFace('masculine')" class="flex-grow text-sm">
                    <Icon icon="icon-dice" :size="12" />
                    <span class="pl-2">Masculine</span>
                </MenuButton>
                <MenuButton @click="randomizeFace('feminine')" class="flex-grow text-sm">
                    <Icon icon="icon-dice" :size="12" />
                    <span class="pl-2">Feminine</span>
                </MenuButton>
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
import MenuButton from '../components/MenuButton.vue';
import { Appearance } from '@AthenaShared/interfaces/appearance.js';

const feminineFaces = [45, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41];
const masculineFaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];

const props = defineProps<{ character: Appearance }>();
const emit = defineEmits<{
    (e: 'set-menu', name: string): void;
    (e: 'go-back'): void;
    (e: 'update-character'): void;
}>();

function randomizeFace(type: 'masculine' | 'feminine') {
    const dataSet = type === 'masculine' ? masculineFaces : feminineFaces;

    props.character.faceMother = dataSet[Math.floor(Math.random() * dataSet.length)];
    props.character.faceFather = dataSet[Math.floor(Math.random() * dataSet.length)];

    props.character.skinMother = props.character.faceMother;
    props.character.skinFather = props.character.faceFather;

    props.character.skinMix = 0.5;
    props.character.faceMix = 0.5;

    emit('update-character');
}

function updateSex() {
    props.character.sex = props.character.sex ? 0 : 1;

    if (props.character.sex === 0) {
        props.character.faceMother = 45;
        props.character.faceFather = 21;
        props.character.skinFather = Math.floor(Math.random() * 45);
        props.character.skinMother = Math.floor(Math.random() * 45);
        props.character.skinMix = 0.5;
        props.character.faceMix = 0.5;
    } else {
        props.character.faceMother = 0;
        props.character.faceFather = 0;
        props.character.skinFather = Math.floor(Math.random() * 45);
        props.character.skinMother = Math.floor(Math.random() * 45);
        props.character.skinMix = 0.5;
        props.character.faceMix = 0.5;
    }

    emit('update-character');
}

function updateFace(type: 'faceMother' | 'faceFather' | 'skinMother' | 'skinFather', value: number) {
    props.character[type] += value;

    if (props.character[type] < 0) {
        props.character[type] = 45;
    }

    if (props.character[type] > 45) {
        props.character[type] = 0;
    }

    emit('update-character');
}

function updateBlend(type: 'skinMix' | 'faceMix', value: number) {
    props.character[type] += value;

    if (props.character[type] < 0) {
        props.character[type] = 0;
    }

    if (props.character[type] > 1) {
        props.character[type] = 1;
    }

    emit('update-character');
}
</script>
