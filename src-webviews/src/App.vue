<!--
=== Athena Framework Interfaces ===

Hi, this is your entry point for all things interfaces for Athena.
It's going to look confusing and it's going to be intimidating.

However, I promise you that this will be much easier than you think.

Each 'page' is a 'component'.

A component is a file that can be loaded below and 
injected into the main page.

Components can be added or removed based on their name.
Simply import your component file in the 'components' object below.

=== The Terms in this Page ===

A 'template' is where you define 'HTML'.

A 'script' is where you define a traditional Vue 3 application / component.

A 'style' is where you define css. If you wish to use global css place it in the style below.
Otherwise each component can have their own scoped style assigned to it.

=== Development Mode! ===

Rather than trying to open up these funky files in your browser, you can simply
run an npm command to start development mode for vue.

'npm run vue-dev'

Open up the local url it gives you and that will let you see changes live.

You do not need to run this development mode when running Athena in dev mode.

Athena already takes care of that for you.

This is if you want to design out-of-game and just work on some design.

-->

<template>
    <keep-alive>
        <div class="page">
            <!-- Developer Menu for Local Host -->
            <div class="devMenu" v-if="isDevMenu()" @mouseenter="setDevMode(true)" @mouseleave="setDevMode(false)">
                <div class="devMode" v-if="devMode">
                    <template v-for="(pageName, index) in getAllPageNames" :key="index">
                        <span class="simple-link" @click="overridePages(pageName)">
                            {{ pageName }}
                        </span>
                    </template>
                </div>
            </div>
            <!-- Displays Individual Pages -->
            <component
                v-for="(page, index) in pages"
                :key="index"
                :is="page.component"
                :id="'page-' + page.name"
                @set-page="setPages"
                @close-page="closePage"
                v-bind:emit="emit"
                class="fade-in"
            ></component>
        </div>
    </keep-alive>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PLUGIN_IMPORTS } from '../../src/core/plugins/athena/webview/imports';
import DefaultPage from './defaultPage';

// Interfaces
import IPageData from './interfaces/IPageData';
import { CORE_IMPORTS } from './pages/components';
// import components from './pages/components';

const ALL_THE_COMPONENTS = {
    ...PLUGIN_IMPORTS,
    ...CORE_IMPORTS,
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
    },
    data() {
        return {
            isClosingPage: false,
            pages: [] as Array<IPageData>,
            pageBindings: componentsToArray(),
            devMode: false,
        };
    },
    computed: {
        getAllPageNames() {
            return Object.keys(ALL_THE_COMPONENTS);
        },
    },
    // Define functions for the main controller.
    methods: {
        setDevMode(value: boolean) {
            this.devMode = value;
        },
        emit(value: string, ...args: any[]) {
            if (!('alt' in window)) {
                return;
            }

            for (let i = 0; i < args.length; i++) {
                if (typeof args === 'object') {
                    args[i] = JSON.parse(JSON.stringify(args[i]));
                }
            }

            alt.emit(value, ...args);
        },
        // Call different internal controller functions from client-side with this.
        handleEventCall(functionName: string, ...args: any[]) {
            if (!this[functionName] || typeof this[functionName] !== 'function') {
                console.log(`Function: ${functionName} does not exist.`);
                return;
            }

            this[functionName](...args);
        },
        // Returns the active pages.
        activePages() {
            const currentPages: Array<IPageData> = this.pages;
            const activePages = currentPages.map((x) => x.name);

            if (!('alt' in window)) {
                console.log(activePages);
                return;
            }

            alt.emit('activePages', activePages);
        },
        isPageCloseReady(): Promise<void> {
            return new Promise((r: Function) => {
                const interval = setInterval(() => {
                    if (this.isClosingPage) {
                        return;
                    }

                    clearInterval(interval);
                    r();
                }, 100);
            });
        },
        closePage(page: string) {
            this.closePages([page]);

            console.log(`[Vue] Closed Page -> ${page}`);

            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${page}:Close`);
        },
        // Turn off all pages
        // Define null or undefined to hide everything.
        async closePages(pagesToHide: Array<string> = null) {
            if (this.isClosingPage) {
                await this.isPageCloseReady();
            }

            this.isClosingPage = true;

            // Hide All Defined Pages
            if (pagesToHide && Array.isArray(pagesToHide)) {
                const currentPages = [...this.pages];
                for (let i = currentPages.length - 1; i >= 0; i--) {
                    if (!pagesToHide.find((x) => x.includes(currentPages[i].name))) {
                        continue;
                    }

                    const element = document.getElementById(`page-${currentPages[i].name}`);
                    if (element) {
                        element.classList.replace('fade-in', 'fade-out');
                    }

                    console.log(`[Vue] Closed Page -> ${currentPages[i].name}`);
                    currentPages.splice(i, 1);
                    continue;
                }

                this.pages = currentPages;
                this.isClosingPage = false;
                return;
            }

            // Just Hide All Pages
            this.pages = [];
            this.isClosingPage = false;
        },
        overridePages(pageName: string) {
            const foundPages = this.pageBindings.filter((page) => page.name === pageName);
            if (!foundPages || foundPages.length <= 0) {
                this.pages = [];
                return;
            }

            this.pages = foundPages;
        },
        async setPages(pagesToShow: Array<string>) {
            if (!pagesToShow || !Array.isArray(pagesToShow)) {
                console.error(`Failed to set any pages.`);
                return;
            }

            if (this.isClosingPage) {
                await this.isPageCloseReady();
            }

            const foundPages = this.pageBindings.filter((page) =>
                pagesToShow.find((pageName) => pageName === page.name),
            );

            let newPagesArray = [];
            const combined = this.pages.concat(foundPages);
            for (let i = 0; i < combined.length; i++) {
                const page = combined[i];
                if (newPagesArray.findIndex((x) => x.name === page.name) >= 0) {
                    continue;
                }

                newPagesArray.push(page);
            }

            console.log(`[Vue] Opened Pages -> ${JSON.stringify(newPagesArray.map((x) => x.name))}`);
            this.pages = newPagesArray;
        },
        isDevMenu() {
            if (!('alt' in window)) {
                return true;
            }

            return false;
        },
    },
    mounted() {
        // What to show when 'alt' is not present.
        // Basically if alt:V isn't running with this page present inside of it.
        if (!('alt' in window)) {
            this.setPages([DefaultPage]);
            return;
        }

        alt.on('view:Call', this.handleEventCall);
        alt.emit('view:Ready');
    },
});
</script>

<style>
@import './css/core.css';

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

.devMenu {
    position: absolute;
    left: 0px;
    top: 0px;
    min-width: 5px;
    max-width: 5px;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
    text-decoration: none;
    color: transparent;
    z-index: 99;
}

.devMenu:hover {
    background: rgba(0, 0, 0, 0.5) !important;
    max-width: 300px;
    text-decoration: unset;
    color: black;
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
