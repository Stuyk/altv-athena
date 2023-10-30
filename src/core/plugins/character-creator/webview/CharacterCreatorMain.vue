<template>
    <div class="flex flex-col fixed left-0 top-0 p-2 min-w-content w-96 opacity-90">
        <component
            :is="pages[pageName]"
            :character="character"
            @set-menu="setMenu"
            @go-back="goBack"
            @update-character="updateCharacter"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CCMain from './pages/CCMain.vue';
import CCBody from './pages/CCBody.vue';
import CCFaceStructure from './pages/CCFaceStructure.vue';
import { hairOverlay } from './dataset/hairOverlays.js';
import { Appearance } from '@AthenaShared/interfaces/appearance.js';
import WebViewEvents from '@utility/webViewEvents.js';
import { MAIN_CHARACTER_CREATOR_EVENTS } from '../shared/events.js';

const pages = {
    main: CCMain,
    body: CCBody,
    structure: CCFaceStructure,
};

let pageName = ref<keyof typeof pages>('main');
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
</script>

<style scoped></style>
