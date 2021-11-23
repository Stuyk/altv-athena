<template>
    <div class="container">
        <div class="creator stack" v-if="labels && labels.length >= 1">
            <!-- Navigation -->
            <div class="split split-full navigation space-between pa-6">
                <Button color="blue" @click="prevPage">
                    <Icon class="blue--text" :size="24" icon="icon-chevron-left" />
                </Button>

                <span class="overline">
                    {{ getLocaleByName(labels[page].name) }}
                </span>

                <Button color="blue" @click="nextPage">
                    <Icon class="blue--text" :size="24" icon="icon-chevron-right" />
                </Button>
            </div>
            <!-- Customization -->
            <Option
                v-bind:page="labels[page]"
                v-bind:locales="locales"
                @force-populate="forcePopulate"
                @update-component="updateComponent"
            ></Option>
        </div>
        <div class="escape pa-4" @click="handleClose">
            <Icon class="white--text pr-2" :size="24" icon="icon-exit" />
            <span class="overline white--text boldest">ESC</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Button from '../../components/Button.vue';
import Icon from '../../components/Icon.vue';
import Modal from '../../components/Modal.vue';
import Toolbar from '../../components/Toolbar.vue';
import Frame from '../../components/Frame.vue';
import RangeInput from '../../components/RangeInput.vue';
import Option from './components/Option.vue';

import DefaultLocale from './utility/defaultLocales';
import LabelsRef from './utility/labels';

const ComponentName = 'Clothing';
export default defineComponent({
    name: ComponentName,
    props: {
        emit: Function,
    },
    components: {
        Button,
        Icon,
        Modal,
        Toolbar,
        Frame,
        RangeInput,
        Option,
    },
    data() {
        return {
            update: 0,
            page: 0,
            locales: DefaultLocale,
            labels: [],
        };
    },
    computed: {
        getLabels() {
            return this.labels[this.page];
        },
        getIDs() {
            return this.labels[this.page].ids;
        },
    },
    methods: {
        getData(dataName: string, index: number) {
            return this.labels[this.page][dataName][index];
        },
        sendPageUpdate() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${ComponentName}:PageUpdate`, this.page);
        },
        nextPage() {
            if (this.page + 1 >= this.labels.length) {
                this.page = 0;
            } else {
                this.page += 1;
            }

            this.update += 1;
            this.sendPageUpdate();
        },
        prevPage() {
            if (this.page - 1 <= -1) {
                this.page = this.labels.length - 1;
            } else {
                this.page -= 1;
            }

            this.update += 1;
            this.sendPageUpdate();
        },
        setLocales(data) {
            this.locales = data;
        },
        getLocaleByName(name: string) {
            if (!this.locales[name]) {
                return `${name} is not a locale. Please fix your code.`;
            }

            return this.locales[name];
        },
        forcePopulate() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${ComponentName}:Populate`, JSON.stringify(this.labels));
        },
        updateComponent(index: number, dataName: string, value: number, isIncrement = false) {
            const labels = [...this.labels];
            let shouldPopulate = false;

            // This will always set the texture back to zero if the drawable id changes.
            if (dataName === 'drawables') {
                labels[this.page].textures[index] = 0;
                shouldPopulate = true;
            }

            // Determine how we update this data.
            if (isIncrement) {
                labels[this.page][dataName][index] += value;
            } else {
                // is A Range Input
                labels[this.page][dataName][index] = value;
                shouldPopulate = false;
            }

            // This ensures min and max values are not exceeded.
            const maxValue =
                dataName === 'drawables' ? labels[this.page].maxDrawables[index] : labels[this.page].maxTextures[index];
            if (labels[this.page][dataName][index] > maxValue) {
                labels[this.page][dataName][index] = 0;
            }

            const minValue = dataName === 'drawables' ? -2 : -1;
            if (labels[this.page][dataName][index] <= minValue) {
                labels[this.page][dataName][index] = maxValue;
            }

            if (!('alt' in window)) {
                this.labels = labels;
                return;
            }

            // Determine if we should update the labels / components based on what changed.
            alt.emit(`${ComponentName}:Update`, JSON.stringify(labels), false, shouldPopulate);
        },
        async setLabels(newLabels) {
            this.labels = newLabels;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            this.handleClose();
        },
        handleClose() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${ComponentName}:Close`);
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        this.labels = [...LabelsRef];

        if ('alt' in window) {
            alt.on(`${ComponentName}:SetLocales`, this.setLocales);
            alt.on(`${ComponentName}:Propagate`, this.setLabels);
            alt.emit(`${ComponentName}:Populate`, JSON.stringify(this.labels));
            alt.emit(`${ComponentName}:Ready`);
        }

        this.sendPageUpdate();
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.off(`${ComponentName}:SetLocales`, this.setLocales);
            alt.off(`${ComponentName}:Propagate`, this.setLabels);
        }
    },
});
</script>

<style scoped>
/* This style is applied to only this page */
.container {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, rgba(0, 0, 0, 1), transparent 35%);
}

.creator {
    position: fixed;
    min-width: 400px;
    min-height: 100vh;
    max-height: 100vh;
    background: rgba(12, 12, 12, 1) !important;
    right: 0;
    border-left: 2px solid rgba(64, 64, 64, 1);
}

.navigation {
    min-height: 100px;
    max-height: 100px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.center-page {
    min-height: calc(100vh - 100px);
    max-height: calc(100vh - 100px);
    overflow-y: scroll;
    box-sizing: border-box;
}

.split {
    box-sizing: border-box;
}

.escape {
    top: 2vh;
    left: 2vw;
}
</style>
