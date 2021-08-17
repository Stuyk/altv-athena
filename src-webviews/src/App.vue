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
            <component v-for="(page, index) in pages" :key="index" :is="page.component"></component>
        </div>
    </keep-alive>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Interfaces
import IPageData from './interfaces/IPageData';

// Page Components
import pages from './pages/components';

// Main Component
export default defineComponent({
    name: 'App',
    components: {
        CharacterSelect: pages.CharacterSelect
    },
    data() {
        return {
            pages: [] as Array<IPageData>,
            // This is where you define pages to show / route.
            // Multiple pages can be shown at the same time.
            pageBindings: [{ name: pages.CharacterSelect.name, component: pages.CharacterSelect }]
        };
    },
    // Define functions for the main controller.
    methods: {
        // Call different internal controller functions from client-side with this.
        handleEventCall(functionName: string, args: any[]) {
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
        // Turn off all pages
        // Define null or undefined to hide everything.
        hidePages(pagesToHide: Array<string> = null) {
            // Hide All Defined Pages
            if (pagesToHide && Array.isArray(pagesToHide)) {
                const currentPages = [...this.pages];
                for (let i = currentPages.length - 1; i >= 0; i--) {
                    if (!pagesToHide.find((x) => x.includes(currentPages[i].name))) {
                        continue;
                    }

                    currentPages.splice(i, 1);
                    continue;
                }

                this.pages = currentPages;
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

            const foundPages = this.pageBindings.some(page => {
                if (pagesToShow.find(pageName => pageName === page.name)) {
                  return true;
                }

                return false;
            });

            this.pages = foundPages
        }
    },
    mounted() {
        // What to show when 'alt' is not present.
        // Basically if alt:V isn't running with this page present inside of it.
        if (!('alt' in window)) {
            console.log('adding pages...');
            this.pages = [
                // { name: pages.CharacterSelect.name, component: pages.CharacterSelect }
                { name: pages.Designs.name, component: pages.Designs },
                { name: pages.Login.name, component: pages.Login }
            ];
            return;
        }

        alt.on('view:Call', this.handleEventCall);
    }
});
</script>

<style>
@import './css/core.css';
</style>
