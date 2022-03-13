<template>
    <div class="wrapper">
        <component :is="pages[pageIndex]" class="fade-in" :key="pageIndex" @next-page="nextPage" @prev-page="prevPage"></component>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Pages from './pages/exports';
import Button from '../../components/Button.vue';
import Frame from '../../components/Frame.vue';
import Icon from '../../components/Icon.vue';
import Input from '../../components/Input.vue';
import Modal from '../../components/Modal.vue';
import Module from '../../components/Module.vue';
import RangeInput from '../../components/RangeInput.vue';
import Toolbar from '../../components/Toolbar.vue';

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'MultiPageExample';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        Input,
        Modal,
        Module,
        RangeInput,
        Toolbar,
        ...Pages, // Page1, Page2, Page3
    },
    data() {
        return {
            pageIndex: 0,
            pages: ['YourFirstPage', 'YourSecondPage', 'YourThirdPage'],
        };
    },
    mounted() {},
    unmounted() {},
    methods: {
        nextPage() {
            this.pageIndex += 1;

            if (this.pageIndex >= this.pages.length) {
                this.pageIndex = 0;
            }
        },
        prevPage() {
            this.pageIndex -= 1;

            if (this.pageIndex <= -1) {
                this.pageIndex = this.pages.length - 1;
            }
        },
    },
});
</script>

<style scoped></style>
