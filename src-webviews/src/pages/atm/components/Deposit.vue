<template>
    <div class="wrapper stack mt-2">
        <Input
            :label="locales.LABEL_CASH_TO_DEPOSIT"
            :stack="true"
            :onInput="(text) => inputChange(text)"
            :validateCallback="(valid) => setValidityProp('deposit', valid)"
            :value="''"
            :numberOnly="true"
            :rules="[
                (value) => {
                    return value >= 1 ? null : 'Minimum deposit is 1';
                },
                (value) => {
                    return value <= cash ? null : 'Not enough cash to deposit.';
                },
            ]"
            :swapIconSide="true"
            icon="icon-arrow-down"
            style="width: 100%"
        />
        <template v-if="validity.deposit">
            <Button class="mt-4" color="green" style="width: 100%" @click="action">
                {{ locales.LABEL_DEPOSIT }}
            </Button>
        </template>
        <template v-else>
            <Button class="mt-4" color="grey" style="width: 100%" :disable="true">
                {{ locales.LABEL_DEPOSIT }}
            </Button>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';
import Input from '../../../components/Input.vue';

const ComponentName = 'Deposit';
export default defineComponent({
    name: ComponentName,
    props: {
        cash: Number,
        locales: Object,
    },
    data() {
        return {
            value: 0,
            validity: {
                deposit: false,
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
            if (!this.validity.deposit) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit('atm:Action', 'deposit', this.value);
        },
        inputChange(text: number) {
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
