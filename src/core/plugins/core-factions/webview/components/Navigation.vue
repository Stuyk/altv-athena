<template>
    <div class="wrapper stack">
        <Button
            class="mr-2 ml-2"
            v-for="(page, index) in pages"
            :key="index"
            :color="getButtonColor(index)"
            :class="getButtonSpacing(index)"
            :raise="false"
            :style="getButtonStyle()"
            @click="navigate(index)"
        >
            {{ page.name }}
        </Button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';

interface iPage {
    name: string;
    page: string;
}

const ComponentName = 'Navigation';
export default defineComponent({
    name: ComponentName,
    props: {
        pages: {
            type: Array as () => Array<iPage>,
        },
        page: {
            type: Number,
        },
    },
    components: {
        Button,
        Icon,
    },
    methods: {
        getButtonStyle() {
            let style = '';

            style += 'background: transparent !important;';
            style += 'border: 0px !important;';

            return style;
        },
        getButtonColor(index: number) {
            if (index === this.page) {
                return 'orange';
            }

            return 'blue';
        },
        getButtonSpacing(index: number) {
            return {
                'mt-2': true,
            };
        },
        navigate(pageIndex: number) {
            this.$emit('navigate', pageIndex);
        },
    },
});
</script>

<style scoped>
.wrapper {
    overflow-y: auto;
    min-height: 100vh;
    max-height: 100vh;
    width: 100%;
    background-color: rgba(12, 12, 12, 1);
}
</style>
