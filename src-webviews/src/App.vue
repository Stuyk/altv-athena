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
            ></component>
            <component
                v-for="(page, index) in overlays"
                :key="index"
                :is="page.component"
                :id="'page-' + page.name"
            ></component>
            <component
                v-for="(page, index) in persistent"
                :key="index"
                :is="page.component"
                :id="'page-' + page.name"
            ></component>
        </div>
    </keep-alive>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CORE_IMPORTS } from './pages/components';
import { PLUGIN_IMPORTS } from './plugins/imports';
import { WebViewEventNames } from '../../src/core/shared/enums/webViewEvents';
import DefaultPages from './defaultPage';

// Interfaces
import IPageData from './interfaces/IPageData';

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
    },
    data() {
        return {
            isPagesUpdating: false,
            persistent: [] as Array<IPageData>,
            overlays: [] as Array<IPageData>,
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
    },
    mounted() {
        // What to show when 'alt' is not present.
        // Basically if alt:V isn't running with this page present inside of it.
        if (!('alt' in window)) {
            this.handleSetPages([...DefaultPages], 'pages');
            return;
        }

        alt.on(WebViewEventNames.SET_PAGES, this.handleSetPages);
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
