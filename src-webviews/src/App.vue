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
            <component
                v-for="(page, index) in pages"
                :key="index"
                :is="page.component"
                :id="'page-' + page"
                @close-page="closePage"
                v-bind:emit="emit"
                class="fade-in"
            ></component>
        </div>
    </keep-alive>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Interfaces
import IPageData from './interfaces/IPageData';
import components from './pages/components';

// Main Component
export default defineComponent({
    name: 'App',
    components: {
        ...components.componentList,
    },
    data() {
        return {
            pages: [] as Array<IPageData>,
            pageBindings: [...components.generateComponentList()],
        };
    },
    // Define functions for the main controller.
    methods: {
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
            console.log(`FUNCTION NAME: ${functionName}`);

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
        closePage(page: string) {
            this.closePages([page]);

            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${page}:Close`);
        },
        // Turn off all pages
        // Define null or undefined to hide everything.
        closePages(pagesToHide: Array<string> = null) {
            // Hide All Defined Pages
            if (pagesToHide && Array.isArray(pagesToHide)) {
                const currentPages = [...this.pages];
                for (let i = currentPages.length - 1; i >= 0; i--) {
                    if (!pagesToHide.find((x) => x.includes(currentPages[i].name))) {
                        continue;
                    }

                    const element = document.getElementById(`page-${currentPages[i]}`);
                    if (element) {
                        element.classList.replace('fade-in', 'fade-out');
                    }

                    currentPages.splice(i, 1);
                    continue;
                }

                setTimeout(() => {
                    this.pages = currentPages;
                }, 500);
                return;
            }

            // Just Hide All Pages
            this.pages = [];
        },
        setPages(pagesToShow: Array<string>) {
            if (!pagesToShow || !Array.isArray(pagesToShow)) {
                console.error(`Failed to set any pages.`);
                return;
            }

            const foundPages = this.pageBindings.filter((page) =>
                pagesToShow.find((pageName) => pageName === page.name),
            );
            this.pages = foundPages;
        },
    },
    mounted() {
        // What to show when 'alt' is not present.
        // Basically if alt:V isn't running with this page present inside of it.
        if (!('alt' in window)) {
            this.setPages(['Atm']);
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
</style>
