<template>
    <div class="container-char-select">
        <div class="selection">
            <div class="stack" v-if="!isDeleting">
                <div class="options" v-if="!isSelecting">
                    <div @mouseover="hover" @click="selectCharacter" class="item hover-blue"># Select</div>
                    <div @mouseover="hover" @click="deleteCharacter" class="item hover-red" v-if="characterCount >= 2">
                        x Delete
                    </div>
                    <div @mouseover="hover" @click="newCharacter" class="item hover-green">+ New</div>
                </div>
                <div class="options" v-else="!isSelecting">
                    <div class="item-no-hover grey--text text--darken-1"># Select</div>
                    <div class="item-no-hover grey--text text--darken-1" v-if="characterCount >= 2">x Delete</div>
                    <div class="item-no-hover grey--text text--darken-1">+ New</div>
                </div>
                <div class="split" v-if="!isSelecting">
                    <div class="left-column">
                        <div class="left-arrow" @click="prev" v-if="characterCount >= 2">
                            <Icon class="grey--text text--lighten-4" :size="48" icon="icon-chevron-left" />
                        </div>
                    </div>
                    <div class="center-column character-name">{{ characterName }}</div>
                    <div class="right-column">
                        <div class="right-arrow" @click="next" v-if="characterCount >= 2">
                            <Icon class="grey--text text--lighten-4" :size="48" icon="icon-chevron-right" />
                        </div>
                    </div>
                </div>
                <div class="split" v-else>
                    <div class="left-column">
                        <div class="left-arrow-no-select" v-if="characterCount >= 2">
                            <Icon class="grey--text text--darken-2" :size="48" icon="icon-chevron-left" />
                        </div>
                    </div>
                    <div class="center-column grey--text text--darken-2 character-name">{{ characterName }}</div>
                    <div class="right-column">
                        <div class="right-arrow-no-select" v-if="characterCount >= 2">
                            <Icon class="grey--text text--darken-2" :size="48" icon="icon-chevron-right" />
                        </div>
                    </div>
                </div>
            </div>
            <CharDelete @yesDelete="deleteCharacterForSure" @noDelete="doNotDelete" v-else />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Icon from '@ViewComponents/Icon.vue';
import CharDelete from './components/CharDelete.vue';
import WebViewEvents from '@utility/webViewEvents';
import { CharSelectEvents } from '../shared/events';

let isSelecting = ref(false);
let isDeleting = ref(false);
let characterName = ref('Test Long Name');
let characterCount = ref<number>(2); // 2 is for debugging purposes

function doNotDelete() {
    WebViewEvents.playSoundFrontend('SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
    isDeleting.value = false;
}

function deleteCharacterForSure() {
    WebViewEvents.playSoundFrontend('SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
    isDeleting.value = false;
    isSelecting.value = true;
    WebViewEvents.emitServer(CharSelectEvents.toServer.delete);
}

function setData(name: string, count: number = 0) {
    characterName.value = name;
    characterCount.value = count;
    isSelecting.value = false;
}

function hover() {
    WebViewEvents.playSoundFrontend('HIGHLIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
}

function next() {
    isSelecting.value = true;
    WebViewEvents.playSoundFrontend('HIGHLIGHT_NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
    WebViewEvents.emitServer(CharSelectEvents.toServer.next);
}

function prev() {
    isSelecting.value = true;
    WebViewEvents.playSoundFrontend('HIGHLIGHT_NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
    WebViewEvents.emitServer(CharSelectEvents.toServer.prev);
}

function selectCharacter() {
    WebViewEvents.playSoundFrontend('SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
    WebViewEvents.emitServer(CharSelectEvents.toServer.select);
}

function deleteCharacter() {
    isDeleting.value = true;
    WebViewEvents.playSoundFrontend('SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
}

function newCharacter() {
    WebViewEvents.playSoundFrontend('SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
    WebViewEvents.emitServer(CharSelectEvents.toServer.new);
}

onMounted(async () => {
    WebViewEvents.on(CharSelectEvents.toWebview.updateName, setData);

    await new Promise((resolve: Function) => {
        setTimeout(resolve, 1000);
    });

    WebViewEvents.emitReady('CharSelect');
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');

.container-char-select {
    display: flex;
    flex-direction: row;
    position: absolute;
    min-width: 100vw;
    min-height: 100vh;
    background: linear-gradient(to top right, rgba(0, 0, 0, 1), transparent 50%);
    font-family: 'Permanent Marker', 'Roboto' !important;
}

.left-arrow,
.right-arrow,
.left-arrow-no-select,
.right-arrow-no-select {
    opacity: 0.7 !important;
}

.left-arrow:hover,
.right-arrow:hover {
    transform: scale(0.95);
    cursor: pointer;
    opacity: 0.9;
}

.character-name {
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
    right: 150px;
    top: 20vh;
    font-size: 20px;
    min-width: 300px;
    opacity: 0.75;
}

.options {
    display: flex;
    flex-direction: column;
    font-size: 24px;
    opacity: 0.7;
    margin-left: 20px;
    margin-bottom: 48px;
    box-sizing: border-box;
}

.options .item {
    margin-bottom: 24px;
    transform: scaleX(1) scaleY(1) scaleZ(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0px) translateY(0px)
        translateZ(0px) skewX(5deg) skewY(-2deg);
    transition: all 0.1s;
}

.options .item-no-hover {
    margin-bottom: 24px;
    transform: scaleX(1) scaleY(1) scaleZ(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0px) translateY(0px)
        translateZ(0px) skewX(5deg) skewY(-2deg);
}

.options .item:hover {
    opacity: 0.9;
    transform: scale(0.98);
    cursor: pointer;
}

.options .item:active {
    transform: scale(0.95);
}

.hover-blue:hover {
    color: cyan;
}

.hover-red:hover {
    color: red;
}

.hover-green:hover {
    color: lime;
}

.selection {
    position: fixed;
    left: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
