<template>
    <div class="stack menu" v-if="active">
        <div class="header">Developer Menu - Hotkey: SHIFT + F</div>
        <sub>Selecting a page, will toggle it.</sub>
        <div class="dev-pages" v-if="pages">
            <div class="dev-page-info" v-for="page in currentPages" @click="togglePage(page.name)">
                {{ page.enabled ? '-' : '+' }} {{ page.name }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from './Button.vue';
import Icon from './Icon.vue';

const ComponentName = 'VueDevMenu';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Icon,
    },
    props: {
        pages: {
            type: Array,
            required: true,
        },
        previousPages: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            active: true,
            update: 1,
            enabledPages: {},
            currentPages: [],
            KEYS: {
                LEFT_SHIFT: 16,
                F: 70,
            },
            MODIFIERS: {
                LEFT_SHIFT_DOWN: false,
            },
        };
    },
    methods: {
        updatePages() {
            const sortedPages = this.pages.sort();
            const newPageList = [];

            for (let pageName of sortedPages) {
                if (this.enabledPages[pageName]) {
                    newPageList.push({ name: pageName, enabled: true });
                    continue;
                }

                newPageList.push({ name: pageName, enabled: false });
            }

            this.currentPages = newPageList;
        },
        handleKeyUp(e: KeyboardEvent) {
            if (e.keyCode === this.KEYS.LEFT_SHIFT) {
                this.MODIFIERS.LEFT_SHIFT_DOWN = false;
            }
        },
        handleKeyDown(e: KeyboardEvent) {
            if (e.keyCode === this.KEYS.LEFT_SHIFT) {
                this.MODIFIERS.LEFT_SHIFT_DOWN = true;
            }

            if (this.MODIFIERS.LEFT_SHIFT_DOWN && e.keyCode === this.KEYS.F) {
                this.active = !this.active;
            }
        },
        togglePage(pageName: string) {
            if (this.enabledPages[pageName]) {
                this.enabledPages[pageName] = false;
                this.$emit('dev-update-pages', pageName, false);
            } else {
                this.enabledPages[pageName] = true;
                this.$emit('dev-update-pages', pageName, true);
            }

            this.updatePages();
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handleKeyUp);
        document.addEventListener('keydown', this.handleKeyDown);
        this.updatePages();
        this.$nextTick(() => {
            for (let pageInfo of this.previousPages) {
                this.togglePage(pageInfo.name);
            }
        });
    },
    unmounted() {
        document.removeEventListener('keyup', this.handleKeyUp);
        document.removeEventListener('keydown', this.handleKeyDown);
    },
});
</script>

<style scoped>
.menu {
    background: rgb(40, 50, 50);
    min-width: 600px;
    max-width: 600px;
    padding: 12px;
    box-sizing: border-box;
    z-index: 99;
    position: fixed;
    box-shadow: 0px 0px 10px 3px black;
    border: 4px solid rgba(240, 255, 255, 0.3);
}

.header {
    font-size: 16px;
    padding-bottom: 12px;
}

.menu .dev-pages {
    min-height: 600px;
    max-height: 600px;
    overflow-y: auto;
    padding: 12px;
    box-sizing: border-box;
}

.menu .dev-pages .dev-page-info {
    display: flex;
    align-content: center;
    padding: 6px;
    box-sizing: border-box;
    margin-bottom: 12px;
    margin-top: 3px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
}

.dev-page-info:hover {
    background: rgb(57, 71, 71) !important;
    cursor: pointer;
}
</style>
