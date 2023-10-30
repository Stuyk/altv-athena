<template>
    <div class="flex flex-col fixed left-0 top-0 p-2 min-w-content w-96 opacity-90">
        <div class="bg-neutral-900 rounded-md" ref="pageRenderer" v-auto-animate>
            <component
                :is="pages[pageName]"
                :character="character"
                :colorMaximums="colorMaximums"
                :overlayMaximums="overlayMaximums"
                @set-menu="setMenu"
                @go-back="goBack"
                @update-character="updateCharacter"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';

import CCMain from './pages/CCMain.vue';
import CCBody from './pages/CCBody.vue';
import CCHair from './pages/CCHair.vue';
import CCFaceStructure from './pages/CCFaceStructure.vue';

import { hairOverlay } from './dataset/hairOverlays.js';
import { Appearance } from '@AthenaShared/interfaces/appearance.js';
import WebViewEvents from '@utility/webViewEvents.js';
import { MAIN_CHARACTER_CREATOR_EVENTS } from '../shared/events.js';

const pages = {
    main: CCMain,
    body: CCBody,
    structure: CCFaceStructure,
    hair: CCHair,
};

let pageName = ref<keyof typeof pages>('main');

let colorMaximums = reactive<{
    primary: { r: number; g: number; b: number }[];
    secondary: { r: number; g: number; b: number }[];
}>({
    // Not actual data, using for debugging
    primary: new Array(64).fill({
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
    }),
    // Not actual data, using for debugging
    secondary: new Array(64).fill({
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
    }),
});

let overlayMaximums = reactive<{ [overlay: number]: number }>({
    0: 23, // Blemish
    1: 28, // Facial Hair
    2: 33, // Eyebrows
    3: 14, // Ageing
    4: 74, // Makeup
    5: 32, // Blush
    6: 11, // Complexion
    7: 10, // Sun Damage
    8: 9, // Lipstick
    9: 17, // Moles / Freckles
    10: 16, // Chest Hair
    11: 11, // Body Blemish
});

let character = ref<Appearance>({
    eyebrowsOpacity: 1,
    skinMix: 0.5,
    chestHair: 0,
    chestHairColor1: 0,
    opacityOverlays: [
        {
            id: 0,
            opacity: 0,
            value: 0,
        },
        {
            id: 3,
            opacity: 0,
            value: 0,
        },
        {
            id: 6,
            opacity: 0,
            value: 0,
        },
        {
            id: 7,
            opacity: 0,
            value: 0,
        },
        {
            id: 9,
            opacity: 0,
            value: 0,
        },
        {
            id: 11,
            opacity: 0,
            value: 0,
        },
    ],
    chestHairOpacity: 0,
    colorOverlays: [
        {
            color1: 0,
            opacity: 0,
            color2: 0,
            id: 4,
            value: 0,
        },
        {
            color1: 0,
            id: 5,
            opacity: 0,
            value: 0,
        },
        {
            color1: 0,
            id: 8,
            opacity: 0,
            value: 0,
        },
    ],
    eyebrows: 0,
    eyes: 0,
    eyebrowsColor1: 0,
    facialHairOpacity: 0,
    faceFather: 0,
    faceMix: 0.5,
    faceMother: 0,
    facialHair: 29,
    facialHairColor1: 0,
    hair: 3,
    hairColor1: 1,
    hairColor2: 5,
    hairOverlay: {
        collection: 'multiplayer_overlays',
        overlay: 'NG_M_Hair_003',
    },
    sex: 1,
    skinFather: 0,
    skinMother: 0,
    structure: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
});

function setMenu(menu: keyof typeof pages) {
    if (!pages[menu]) {
        return;
    }

    pageName.value = menu;
}

function updateCharacter() {
    character.value.hairOverlay = hairOverlay[character.value.sex][character.value.hair];

    const data = JSON.parse(JSON.stringify(character.value)) as Appearance;
    WebViewEvents.emitServer(MAIN_CHARACTER_CREATOR_EVENTS.UPDATE, data);
}

function goBack() {
    pageName.value = 'main';
}

onMounted(() => {
    WebViewEvents.on(MAIN_CHARACTER_CREATOR_EVENTS.GET_OVERLAY_COUNT, (index: number, maxCount: number) => {
        overlayMaximums[index] = maxCount;
    });

    WebViewEvents.on(
        MAIN_CHARACTER_CREATOR_EVENTS.GET_PRIMARY_COLOR_LIST,
        (colors: { r: number; g: number; b: number }[]) => {
            colorMaximums.primary = colors;
        },
    );

    WebViewEvents.on(
        MAIN_CHARACTER_CREATOR_EVENTS.GET_SECONDARY_COLOR_LIST,
        (colors: { r: number; g: number; b: number }[]) => {
            colorMaximums.secondary = colors;
        },
    );

    // Get all values
    for (let i = 0; i < 11; i++) {
        WebViewEvents.emitClient(MAIN_CHARACTER_CREATOR_EVENTS.GET_OVERLAY_COUNT, i); // facialhair
    }

    WebViewEvents.emitClient(MAIN_CHARACTER_CREATOR_EVENTS.GET_PRIMARY_COLOR_LIST);
    WebViewEvents.emitClient(MAIN_CHARACTER_CREATOR_EVENTS.GET_SECONDARY_COLOR_LIST);
});
</script>

<style scoped></style>
