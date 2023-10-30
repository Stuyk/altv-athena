<template>
    <div
        class="flex flex-col fixed right-0 bottom-0 mr-4 mb-4 bg-neutral-900 w-1/6 rounded-md box-border text-neutral-200 font-semibold z-20 text-xs opacity-90"
    >
        <div v-auto-animate>
            <div v-if="isDeleting" class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
                <div
                    @click="deleteCharacterForSure"
                    class="transition-all active:scale-95 flex flex-row justify-between items-cente border text-red-400 border-red-400 hover:text-red-400 cursor-pointer bg-neutral-800 hover:bg-neutral-700 rounded-sm p-4 pt-2 pb-2"
                >
                    <span>Delete '{{ characterName }}'</span>
                </div>
                <div
                    @click="doNotDelete"
                    class="transition-all hover:text-neutral-200 active:scale-95 flex flex-row justify-between items-center border border-neutral-700 cursor-pointer bg-neutral-800 hover:bg-neutral-700 rounded-sm p-4 pt-2 pb-2"
                >
                    <Icon :size="18" icon="icon-chevron-left" />
                    <span>Go Back</span>
                </div>
            </div>
            <div v-else class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
                <div
                    @click="deleteCharacter"
                    class="transition-all hover:text-neutral-200 active:scale-95 flex flex-row justify-between items-center border border-neutral-700 cursor-pointer bg-neutral-800 hover:bg-neutral-700 rounded-sm p-4 pt-2 pb-2"
                >
                    <span>Delete</span>
                    <Icon :size="18" icon="icon-remove" />
                </div>
            </div>
        </div>
    </div>

    <div
        class="flex flex-col fixed left-0 bottom-0 ml-4 mb-4 bg-neutral-900 w-1/6 rounded-md box-border text-neutral-200 font-semibold z-20 text-xs opacity-90"
    >
        <div class="flex flex-col select-none flex-grow rounded m-2 text-center gap-2">
            <div
                @click="newCharacter"
                class="transition-all hover:text-neutral-200 active:scale-95 flex flex-row justify-between items-center border border-neutral-700 cursor-pointer bg-neutral-800 hover:bg-neutral-700 rounded-sm p-4 pt-2 pb-2"
            >
                <span>New</span>
                <Icon :size="18" icon="icon-plus" />
            </div>
            <div
                @click="selectCharacter"
                class="transition-all hover:text-neutral-200 active:scale-95 flex flex-row justify-between items-center border border-neutral-700 cursor-pointer bg-neutral-800 hover:bg-neutral-700 rounded-sm p-4 pt-2 pb-2"
            >
                <span>Select</span>
                <Icon :size="18" icon="icon-select" />
            </div>
        </div>
    </div>
    <div
        class="flex justify-center gap-3 fixed w-1/3 bottom-0 mb-4 rounded-md box-border z-10 text-neutral-300 hover:text-neutral-100 text-xs opacity-90"
        v-if="characterCount >= 2"
    >
        <div @click="prev" class="bg-neutral-900 p-2 rounded-md active:scale-95">
            <Icon
                class="transition-all p-2 bg-neutral-800 border-neutral-700 border rounded-sm cursor-pointer hover:bg-neutral-700"
                :size="16"
                icon="icon-chevron-left"
            />
        </div>
        <p
            class="flex flex-grow justify-center select-none items-center w-1/4 font-bold border-neutral-700 bg-neutral-900 rounded-md"
        >
            {{ characterName }}
        </p>
        <div @click="next" class="bg-neutral-900 p-2 rounded-md active:scale-95">
            <Icon
                class="transition-all p-2 bg-neutral-800 border-neutral-700 border rounded-sm cursor-pointer hover:bg-neutral-700"
                :size="16"
                icon="icon-chevron-right"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import WebViewEvents from '@utility/webViewEvents.js';
import { CharSelectEvents } from '../shared/events.js';

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

<style scoped></style>
