<template>
    <div class="container">
        <!-- Pop Up for Purchase -->
        <Modal v-if="showDialog">
            <Frame minWidth="30vw" maxWidth="30vw">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">
                        <span class="green--text">{{ getLocaleByName('LABEL_INSTRUCTION_HEADER') }}</span>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="subtitle-2 mb-3 mt-1">{{ getLocaleByName('LABEL_INSTRUCTION') }}</div>
                    <Input
                        :label="getLocaleByName('LABEL_NAME')"
                        :stack="true"
                        :onInput="(text) => inputChange('name', text)"
                        :validateCallback="(valid) => setValidityProp('name', valid)"
                        :value="name"
                        :rules="[
                            (text) => {
                                return new RegExp(/^[a-zA-Z ]+$/gm).test(text)
                                    ? null
                                    : 'Name cannot include special characters';
                            },
                            (text) => {
                                return text.length >= 4 ? null : 'Name must be at least 4 characters';
                            },
                            (text) => {
                                return text.length <= 16 ? null : 'Name must be less than 16 characters';
                            },
                        ]"
                        :placeholder="getLocaleByName('LABEL_HELPER_NAME')"
                        class="mb-3"
                    />
                    <Input
                        :label="getLocaleByName('LABEL_DESC')"
                        :stack="true"
                        :onInput="(text) => inputChange('desc', text)"
                        :validateCallback="(valid) => setValidityProp('desc', valid)"
                        :value="desc"
                        :rules="[
                            (text) => {
                                return new RegExp(/^[a-zA-Z ]+$/gm).test(text)
                                    ? null
                                    : 'Name cannot include special characters';
                            },
                            (text) => {
                                return text.length >= 4 ? null : 'Name must be at least 4 characters';
                            },
                            (text) => {
                                return text.length <= 16 ? null : 'Name must be less than 16 characters';
                            },
                        ]"
                        :placeholder="getLocaleByName('LABEL_HELPER_DESC')"
                        class="mb-3"
                    />
                    <div class="split split-full">
                        <Button class="mt-2" color="red" style="width: 50%" @click="togglePurchaseInterface(false)">
                            {{ getLocaleByName('LABEL_CANCEL') }}
                        </Button>

                        <template v-if="allValid">
                            <Button class="ml-4 mt-2" color="green" style="width: 50%" @click="purchaseComponent">
                                {{ getLocaleByName('LABEL_PURCHASE') }}
                            </Button>
                        </template>
                        <template v-else>
                            <Button class="ml-4 mt-2" color="grey" :disable="true" style="width: 50%">
                                {{ getLocaleByName('LABEL_PURCHASE') }}
                            </Button>
                        </template>
                    </div>
                </template>
            </Frame>
        </Modal>
        <!-- Right Panel -->
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
            <!-- Purchase Options -->
            <div class="footer pa-4">
                <div class="split split-full space-between">
                    <Button class="mr-3" color="green" @click="togglePurchaseInterface(true)">
                        <span class="green--text">{{ getLocaleByName('LABEL_PURCHASE') }}</span>
                    </Button>
                    <span class="price pa-3">$0</span>
                </div>
            </div>
        </div>
        <div class="escape pa-4" @click="handleClose">
            <Icon class="white--text pr-2" :size="24" icon="icon-exit" />
            <span class="overline white--text boldest">ESC</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../../components/Button.vue';
import Icon from '../../components/Icon.vue';
import Modal from '../../components/Modal.vue';
import Toolbar from '../../components/Toolbar.vue';
import Frame from '../../components/Frame.vue';
import Input from '../../components/Input.vue';
import RangeInput from '../../components/RangeInput.vue';
import Option from './components/Option.vue';

import DefaultLocale from './utility/defaultLocales';
import LabelsRef from './utility/labels';
import Template from '../template/Template.vue';

const ComponentName = 'Clothing';
export default defineComponent({
    name: ComponentName,
    props: {
        emit: Function,
    },
    components: {
        Button,
        Frame,
        Icon,
        Input,
        Modal,
        Option,
        RangeInput,
        Toolbar,
        Template,
    },
    data() {
        return {
            update: 0,
            page: 0,
            locales: DefaultLocale,
            showDialog: false,
            name: '',
            desc: '',
            labels: [],
            allValid: false,
            validity: {
                name: false,
                desc: false,
            },
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
        inputChange(prop: string, value: string) {
            this[prop] = value;
        },
        setValidityProp(propName: string, result: boolean) {
            this.validity[propName] = result;

            let allValid = true;
            Object.keys(this.validity).forEach((key) => {
                if (!this.validity[key]) {
                    allValid = false;
                    return;
                }
            });

            this.allValid = allValid;
        },
        togglePurchaseInterface(value: boolean) {
            this.showDialog = value;

            this.name = '';
            this.desc = '';
        },
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
        purchaseComponent() {
            const componentData = JSON.parse(JSON.stringify(this.labels[this.page]));
            delete componentData.maxDrawables;
            delete componentData.maxTextures;
            delete componentData.name;

            if (!('alt' in window)) {
                this.togglePurchaseInterface(false);
                return;
            }

            alt.emit(`${ComponentName}:Purchase`, this.page, componentData, this.name, this.desc);
            this.togglePurchaseInterface(false);
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
    max-width: 400px;
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

.split {
    box-sizing: border-box;
}

.escape {
    top: 2vh;
    left: 2vw;
}

.footer {
    display: flex;
    flex-direction: column;
    min-height: auto;
    max-height: auto;
    box-sizing: border-box;
    width: 100%;
}

.price {
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    text-align: left;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
}
</style>
