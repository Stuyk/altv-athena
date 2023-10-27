<template>
    <div class="fixed top-0 w-1/3 mt-2 opacity-90 largest-z-index">
        <div
            class="bg-neutral-900 rounded-md text-neutral-200 transition-all text-xs"
            :class="active ? ['opacity-100'] : ['opacity-0 hover:opacity-50']"
        >
            <p
                v-if="active"
                @click="active = !active"
                class="text-center font-bold p-4 border-neutral-700 cursor-pointer"
            >
                Hide Pages
            </p>
            <p v-else @click="active = !active" class="text-center font-bold p-4 cursor-pointer">Pages</p>
            <div
                v-if="active && pages"
                class="flex flex-col m-4 p-2 border rounded-md bg-neutral-950 border-neutral-700 overflow-y-auto max-h-96 gap-2"
            >
                <div
                    v-for="page in currentPages"
                    @click="togglePage(page.name)"
                    class="flex font-semibold items-center justify-between pt-2 pb-2 cursor-pointer bg-neutral-800 hover:bg-neutral-700 rounded-sm p-4 select-none border border-neutral-700"
                >
                    <span>{{ page.name }}</span>
                    <Icon :size="16" :icon="page.enabled ? 'icon-checkmark' : 'icon-times-circle'" />
                </div>
            </div>
            <div class="text-center w-full pb-2 select-none">
                <sup>Use <code class="bg-neutral-700 p-1 rounded-sm">SHIFT + F</code> to toggle this menu.</sup>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import IPageData from '../interfaces/IPageData.js';

const props = defineProps<{ pages: string[]; previousPages: IPageData[] }>();
const emit = defineEmits<{ (e: 'dev-update-pages', pageName: string, active: boolean): void }>();

const KEYS = {
    LEFT_SHIFT: 16,
    F: 70,
};

const MODIFIERS = {
    LEFT_SHIFT_DOWN: false,
};

let active = ref<boolean>(true);
let enabledPages = ref<{ [pageName: string]: boolean }>({});
let currentPages = ref<{ name: string; enabled: boolean }[]>([]);

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
        active.value = !active.value;
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
});

onUnmounted(() => {
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.largest-z-index {
    z-index: 999;
}

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
