<template>
    <div @click="active = !active" class="fixed right-0 bottom-0 z-50 mr-4 mb-2 p-4 bg-gray-800 active:bg-gray-600 hover:bg-gray-700 cursor-pointer text-cyan-400 rounded-md select-none">
        Pages
    </div>
    <div class="fixed z-40 w-screen flex justify-center backdrop-blur-sm mt-4" v-if="active">
        <div class="bg-gray-800 w-1/2 rounded-md text-gray-300 p-4">
            <p class="text-center font-bold border-b pb-2 border-gray-700">Click to Preview</p>
            <div v-if="pages" class="mt-4 bg-gray-700 border-gray-600 border rounded p-4 overflow-y-auto max-h-96">
                <div v-for="page in currentPages" @click="togglePage(page.name)" class="flex items-center justify-between pt-2 pb-2 mb-2 cursor-pointer hover:bg-gray-600 rounded-sm p-4 select-none">
                    <span>{{ page.name }}</span>
                    <Icon :size="16" :icon="page.enabled ? 'icon-checkmark' : 'icon-times-circle'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import IPageData from '../interfaces/IPageData.js';

const props = defineProps<{ pages: string[], previousPages: IPageData[] }>();
const emit = defineEmits<{ (e: 'dev-update-pages', pageName: string, active: boolean ): void }>();

const KEYS = {
    LEFT_SHIFT: 16,
    F: 70
}

const MODIFIERS = {
    LEFT_SHIFT_DOWN: false,
}

let active = ref<boolean>(true);
let enabledPages = ref<{ [pageName: string]: boolean }>({});
let currentPages = ref<{ name: string, enabled: boolean }[]>([]);

function updatePages() {
            const sortedPages = props.pages.sort();
            const newPageList = [];

            for (let pageName of sortedPages) {
                if (enabledPages[pageName]) {
                    newPageList.push({ name: pageName, enabled: true });
                    continue;
                }

                newPageList.push({ name: pageName, enabled: false });
            }

            currentPages.value = newPageList;
        }

function handleKeyUp(e: KeyboardEvent) {
    if (e.keyCode === KEYS.LEFT_SHIFT) {
        MODIFIERS.LEFT_SHIFT_DOWN = false;
    }
}

function handleKeyDown(e: KeyboardEvent) {
    if (e.keyCode === KEYS.LEFT_SHIFT) {
        MODIFIERS.LEFT_SHIFT_DOWN = true;
    }

    if (MODIFIERS.LEFT_SHIFT_DOWN && e.keyCode === KEYS.F) {
        active.value = !active;
    }
}

function togglePage(pageName: string) {
    if (enabledPages[pageName]) {
        enabledPages[pageName] = false;
        emit('dev-update-pages', pageName, false);
    } else {
        enabledPages[pageName] = true;
        emit('dev-update-pages', pageName, true);
    }

    updatePages();
}

function forceHide() {
    active.value = false;
    localStorage.setItem('hide-pages-on-setup', 'true');
}

onMounted(() => {
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleKeyDown);
    updatePages();
    nextTick(() => {
        for (let pageInfo of props.previousPages) {
            togglePage(pageInfo.name);
        }
    });

    const autoHide = localStorage.getItem('hide-pages-on-setup');
    if (autoHide && typeof autoHide !== 'undefined' && autoHide === 'true') {
        active.value = false;
    }
})

onUnmounted(() => {
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('keydown', handleKeyDown);
});
</script>