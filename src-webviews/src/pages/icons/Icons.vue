<!--
This is just a way to see all the different .css designs setup already.

Helpful for seeing what default components look like.

-->

<template>
    <div class="stack background">
        <div class="split space-between">
            <Input
                label="Search"
                :numberOnly="false"
                :stack="false"
                :onInput="searchTerm"
                :value="userInput"
                :rules="[]"
                style="width: 100%"
                placeholder="Search icon..."
            />
        </div>
        <div class="icons mt-4">
            <div
                v-for="(icon, index) in getIcons"
                :key="index"
                class="preview-stack mb-12 preview-icon"
                @click="copyToClipboard(icon)"
            >
                <Icon :icon="icon" :size="36" />
                <span class="subtitle-2 center pt-2">{{ icon }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icons from '../../exampleData/Icons';
import Input from '@components/Input.vue';
import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';

const ComponentName = 'Icons';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            userInput: '',
            icons: Icons,
        };
    },
    computed: {
        getIcons() {
            if (this.userInput === '') {
                return this.icons;
            }

            return this.icons.filter((x) => x.toLowerCase().includes(this.userInput));
        },
    },
    components: {
        Button,
        Icon,
        Input,
    },
    methods: {
        searchTerm(value: string) {
            this.userInput = value;
        },
        copyToClipboard(text: string) {
            navigator.clipboard.writeText(text);
        },
    },
});
</script>

<style scoped>
.background {
    display: block;
    position: absolute;
    padding: 24px !important;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(10, 10, 10, 1) !important;
    box-sizing: border-box;
}

.icons {
    display: grid;
    grid-template-columns: repeat(3, auto);
    max-height: 90vh;
    overflow-y: scroll;
}

.preview-icon:hover {
    cursor: pointer;
}
</style>
