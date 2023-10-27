<template>
    <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-200 font-semibold z-20">
        <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
            <div class="text-xs p-1">Body & Face</div>
        </div>
    </div>
    <div class="flex flex-col bg-neutral-900 rounded-md box-border text-neutral-200 font-semibold z-20 mt-2">
        <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
            <!-- Body Type / Sex -->
            <div class="flex flex-row justify-between items-center p-1 border-b pb-3 border-neutral-700">
                <div class="w-24 pr-4 text-left text-xs">Body</div>
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
            <div class="flex flex-row justify-between items-center p-1 border-b pb-3 border-neutral-700">
                <div class="w-24 pr-4 text-left text-xs">Mother</div>
                <div class="flex flex-row justify-between items-center flex-grow h-7">
                    <MenuButton @click="updateFace('faceMother', -1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <input
                        :value="props.character.faceMother"
                        @input="(e: Event) => updateFaceInput(e, 'faceMother')"
                        class="w-12 text-center border-neutral-800 bg-neutral-950 text-xs rounded-sm border flex-grow ml-4 mr-4 h-full font-mono"
                    />
                    <MenuButton @click="updateFace('faceMother', 1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Father -->
            <div class="flex flex-row justify-between items-center p-1 border-b pb-3 border-neutral-700">
                <div class="w-24 pr-4 text-left text-xs">Father</div>
                <div class="flex flex-row justify-between items-center flex-grow h-7">
                    <MenuButton @click="updateFace('faceFather', -1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <input
                        :value="props.character.faceFather"
                        @input="(e: Event) => updateFaceInput(e, 'faceFather')"
                        class="w-12 text-center border-neutral-800 bg-neutral-950 text-xs rounded-sm border flex-grow ml-4 mr-4 h-full font-mono"
                    />
                    <MenuButton @click="updateFace('faceFather', 1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Mother Skin -->
            <div class="flex flex-row justify-between items-center p-1 border-b pb-3 border-neutral-700">
                <div class="w-24 pr-4 text-left text-xs">Mother Skin</div>
                <div class="flex flex-row justify-between items-center flex-grow h-7">
                    <MenuButton @click="updateFace('skinMother', -1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <input
                        :value="props.character.skinMother"
                        @input="(e: Event) => updateFaceInput(e, 'skinMother')"
                        class="w-12 text-center border-neutral-800 bg-neutral-950 text-xs rounded-sm border flex-grow ml-4 mr-4 h-full font-mono"
                    />
                    <MenuButton @click="updateFace('skinMother', 1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Father Skin -->
            <div class="flex flex-row justify-between items-center p-1 border-b pb-3 border-neutral-700">
                <div class="w-24 pr-4 text-left text-xs">Father Skin</div>
                <div class="flex flex-row justify-between items-center flex-grow h-7">
                    <MenuButton @click="updateFace('skinFather', -1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <input
                        :value="props.character.skinFather"
                        @input="(e: Event) => updateFaceInput(e, 'skinFather')"
                        class="w-12 text-center border-neutral-800 bg-neutral-950 text-xs rounded-sm border flex-grow ml-4 mr-4 h-full font-mono"
                    />
                    <MenuButton @click="updateFace('skinFather', 1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Face Blend -->
            <div class="flex flex-row justify-between items-center p-1 border-b pb-3 border-neutral-700">
                <div class="w-24 pr-4 text-left text-xs">Face Mix</div>
                <div class="flex flex-row justify-between items-center flex-grow h-7">
                    <MenuButton @click="updateBlend('faceMix', -0.1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <input
                        :value="props.character.faceMix.toFixed(1)"
                        @input="(e: Event) => updateBlendInput(e, 'faceMix')"
                        class="w-12 text-center border-neutral-800 bg-neutral-950 text-xs rounded-sm border flex-grow ml-4 mr-4 h-full font-mono"
                    />
                    <MenuButton @click="updateBlend('faceMix', 0.1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>
            <!-- Skin Blend -->
            <div class="flex flex-row justify-between items-center p-1 border-b pb-3 border-neutral-700">
                <div class="w-24 pr-4 text-left text-xs">Skin Mix</div>
                <div class="flex flex-row justify-between items-center flex-grow h-7">
                    <MenuButton @click="updateBlend('skinMix', -0.1)">
                        <Icon icon="icon-chevron-left" :size="12" />
                    </MenuButton>
                    <input
                        :value="props.character.skinMix.toFixed(1)"
                        @input="(e: Event) => updateBlendInput(e, 'skinMix')"
                        class="w-12 text-center border-neutral-800 bg-neutral-950 text-xs rounded-sm border flex-grow ml-4 mr-4 h-full font-mono"
                    />
                    <MenuButton @click="updateBlend('skinMix', 0.1)">
                        <Icon icon="icon-chevron-right" :size="12" />
                    </MenuButton>
                </div>
            </div>

            <!-- Randomize All -->
            <div class="flex flex-row justify-between items-center p-1 border-b pb-3 border-neutral-700">
                <div class="flex flex-row justify-between items-center flex-grow h-7">
                    <MenuButton @click="randomizeFace('masculine')">
                        <Icon icon="icon-male1" :size="14" />
                    </MenuButton>
                    <h2 class="text-xs">Randomize</h2>
                    <MenuButton @click="randomizeFace('feminine')">
                        <Icon icon="icon-female1" :size="14" />
                    </MenuButton>
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

    props.character.sex = type === 'feminine' ? 0 : 1;

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
    emit('update-character');
}

function updateFaceInput(
    e: Event,
    type: 'faceMother' | 'faceFather' | 'skinMother' | 'skinFather',
    parseAsFloat = false,
) {
    const valueAsString: string = e.target['value'];
    if (typeof valueAsString === 'undefined' || valueAsString == '') {
        props.character[type] = 0;
        return;
    }

    props.character[type] = parseAsFloat ? parseFloat(valueAsString) : parseInt(valueAsString);

    if (props.character[type] < 0) {
        props.character[type] = 45;
    }

    if (props.character[type] > 45) {
        props.character[type] = 0;
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

function updateBlendInput(e: Event, type: 'faceMix' | 'skinMix') {
    const valueAsString: string = e.target['value'];
    if (typeof valueAsString === 'undefined' || valueAsString == '') {
        props.character[type] = 0;
        return;
    }

    props.character[type] = parseFloat(valueAsString);

    if (props.character[type] < 0) {
        props.character[type] = 0;
    }

    if (props.character[type] > 1.0) {
        props.character[type] = 1;
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
