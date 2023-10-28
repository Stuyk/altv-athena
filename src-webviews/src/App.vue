<template>
    <div class="page">
        <!-- Developer Menu for Local Host -->
        <VueDevMenu
            :pages="getAllPageNames"
            :previousPages="pages"
            @DevUpdatePages="devUpdatePages"
            v-if="isDevMenu()"
        />
        <!-- Displays Individual Pages -->
        <component v-for="(page, index) in pages" :key="index" :is="page.component" />
        <component v-for="(page, index) in overlays" :key="index" :is="page.component" />
        <component v-for="(page, index) in persistent" :key="index" :is="page.component" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { CORE_IMPORTS } from './pages/components.js';
import { PLUGIN_IMPORTS } from './plugins/imports.js';
import { WebViewEventNames } from '../../src/core/shared/enums/webViewEvents.js';
import VueDevMenu from './components/VueDevMenu.vue';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { Character } from '@AthenaShared/interfaces/character.js';
import * as state from '@utility/state.js';

// Interfaces
import IPageData from './interfaces/IPageData.js';
import WebViewEvents from '@utility/webViewEvents.js';
import { Account } from '@AthenaShared/interfaces/iAccount.js';

const ALL_THE_COMPONENTS = {
    ...CORE_IMPORTS,
    ...PLUGIN_IMPORTS,
};

function componentsToArray() {
    let componentList = [];
    Object.keys(ALL_THE_COMPONENTS).forEach((key) => {
        componentList.push({ name: key, component: ALL_THE_COMPONENTS[key] });
    });

    return componentList;
}

export default defineComponent({
    name: 'App',
    components: {
        ...ALL_THE_COMPONENTS,
        VueDevMenu,
    },
    data() {
        return {
            isPagesUpdating: false,
            persistent: [] as Array<IPageData>,
            overlays: [] as Array<IPageData>,
            pages: [] as Array<IPageData>,
            pageBindings: componentsToArray(),
            devMode: false,
            state: {} as Character,
            accountState: {} as Account,
        };
    },
    computed: {
        getAllPageNames() {
            return Object.keys(ALL_THE_COMPONENTS);
        },
    },
    // Define functions for the main controller.
    methods: {
        overridePages(pageName: string) {
            const foundPages = this.pageBindings.filter((page) => page.name === pageName);
            this.pages = foundPages;
        },
        setDevMode(value: boolean) {
            this.devMode = value;
        },
        isPageUpdateReady(): Promise<void> {
            return new Promise((r: Function) => {
                const interval = setInterval(() => {
                    if (this.isPagesUpdating) {
                        return;
                    }

                    clearInterval(interval);
                    r();
                }, 100);
            });
        },
        isDevMenu() {
            if (!('alt' in window)) {
                return true;
            }

            return false;
        },
        async handleSetPages(pages: Array<{ name: string }>, type: 'pages' | 'overlays' | 'persistent') {
            if (!pages || !Array.isArray(pages)) {
                console.error(`Failed to set any pages.`);
                return;
            }

            if (this.isPagesUpdating) {
                await this.isPageUpdateReady();
            }

            const foundPages = this.pageBindings.filter((page) =>
                pages.find((pageType) => pageType.name === page.name),
            );

            this[type] = foundPages;
            console.log(`[Vue] ${type} -> ${JSON.stringify(foundPages.map((x) => x.name))}`);
        },
        devUpdatePages(pageName: string, isAddingPage: boolean) {
            const currentPages = this['pages'];

            if (isAddingPage) {
                const newPages = currentPages.concat([{ name: pageName }]);
                this.handleSetPages(newPages, 'pages');
                localStorage.setItem('pages', JSON.stringify(newPages));
                return;
            }

            const index = currentPages.findIndex((x) => x.name === pageName);
            if (index <= -1) {
                return;
            }

            currentPages.splice(index, 1);
            this.handleSetPages(currentPages, 'pages');
            localStorage.setItem('pages', JSON.stringify(currentPages));
        },
        setCharacterState(characterData: Character) {
            state.set('characterState', characterData);
        },
        setAccountState(accountData: Account) {
            state.set('accountState', accountData);
        },
    },
    mounted() {
        WebViewEvents.on(SYSTEM_EVENTS.PLAYER_EMIT_STATE, this.setCharacterState);
        WebViewEvents.on(SYSTEM_EVENTS.PLAYER_EMIT_ACCOUNT_STATE, this.setAccountState);

        // What to show when 'alt' is not present.
        // Basically if alt:V isn't running with this page present inside of it.
        if (!('alt' in window)) {
            // Random state generation for testing...
            setInterval(() => {
                this.state.hp = Math.floor(Math.random() * 100) + 100;
                this.state.armour = Math.floor(Math.random() * 100);
                this.state.random = Math.random() * Number.MAX_SAFE_INTEGER;
            }, 100);

            const existingPages = localStorage.getItem('pages');
            if (existingPages && typeof existingPages !== 'undefined') {
                try {
                    this.handleSetPages(JSON.parse(existingPages), 'pages');
                } catch (err) {}
            }

            return;
        }

        alt.on(WebViewEventNames.SET_PAGES, this.handleSetPages);
        alt.emit('view:Ready');
    },
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800;900');

.page {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', 'Arial';
}

.fade-in {
    animation: FadeIn 0.5s;
}

.fade-out {
    animation: FadeOut 0.5s;
}

@keyframes FadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes FadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

.devMode {
    display: flex;
    width: 100%;
    flex-direction: column;
    min-height: 100vh;
    max-height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    box-sizing: border-box;
}

.simple-link {
    color: white;
    padding-top: 3px;
    padding-bottom: 3px !important;
    padding-left: 6px;
    padding-right: 6px;
    font-size: 12px;
    width: 100%;
    box-sizing: border-box;
}

.simple-link:hover {
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
}
</style>
