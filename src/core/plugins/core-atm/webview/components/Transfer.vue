<template>
    <div class="wrapper stack">
        <Input
            :label="locales.LABEL_BANK_TO_TRANSFER"
            :stack="true"
            :onInput="(text) => inputChange(text)"
            :validateCallback="(valid) => setValidityProp('transfer', valid)"
            :value="''"
            :numberOnly="true"
            :rules="[
                (value) => {
                    return value >= 1 ? null : 'Minimum transfer is $1';
                },
                (value) => {
                    return value <= bank ? null : 'Not enough bank balance to transfer.';
                },
            ]"
            :swapIconSide="true"
            icon="icon-dollar"
            class="fill-full-width"
        />
        <Input
            :label="locales.LABEL_USER_ID"
            :stack="true"
            :onInput="(text) => idChange(text)"
            :validateCallback="(valid) => setValidityProp('id', valid)"
            :value="''"
            :numberOnly="true"
            :rules="[
                (value) => {
                    return value >= 0 && value !== null && value !== undefined ? null : 'Minimum ID is zero.';
                },
            ]"
            :swapIconSide="true"
            icon="icon-user"
            class="mt-4 fill-full-width"
        />
        <template v-if="validity.transfer && validity.id">
            <Button class="mt-4 fill-full-width" color="green" @click="action">
                {{ locales.LABEL_TRANSFER }}
            </Button>
        </template>
        <template v-else>
            <Button class="mt-4 fill-full-width" color="grey" :disable="true">
                {{ locales.LABEL_TRANSFER }}
            </Button>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ComponentName as PageName } from '../Atm.vue';

import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Input from '@components/Input.vue';

const ComponentName = 'Transfer';
export default defineComponent({
    name: ComponentName,
    props: {
        bank: Number,
        locales: Object,
    },
    data() {
        return {
            value: 0,
            id: -1,
            validity: {
                id: false,
                transfer: false,
            },
        };
    },
    components: {
        Button,
        Icon,
        Input,
    },
    methods: {
        action() {
            if (!this.validity.transfer || !this.validity.id) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${PageName}:Action`, 'transfer', this.value, this.id);
        },
        idChange(text: number) {
            if (typeof text === 'string') {
                text = parseFloat(text);
            }

            this.id = text;
        },
        inputChange(text: number): void {
            if (typeof text === 'string') {
                text = parseFloat(text);
            }

            this.value = text;
        },
        setValidityProp(prop: string, valid: boolean) {
            this.validity[prop] = valid;
        },
    },
});
</script>

<style>
.fill-full-width {
    width: 100%;
}
</style>
