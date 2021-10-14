<template>
    <div class="wrapper stack">
        <Input
            :label="locales.LABEL_CASH_TO_WITHDRAW"
            :stack="true"
            :onInput="(text) => inputChange(text)"
            :validateCallback="(valid) => setValidityProp('withdraw', valid)"
            :value="''"
            :numberOnly="true"
            :rules="[
                (value) => {
                    return value >= 1 ? null : 'Minimum to Withdraw is 1';
                },
                (value) => {
                    return value <= bank ? null : 'Not enough bank balance to withdraw.';
                },
            ]"
            :swapIconSide="true"
            icon="icon-arrow-up"
            style="width: 100%"
        />
        <template v-if="validity.withdraw">
            <Button class="mt-4" color="blue" style="width: 100%" @click="action">
                {{ locales.LABEL_WITHDRAW }}
            </Button>
        </template>
        <template v-else>
            <Button class="mt-4" color="grey" style="width: 100%" :disable="true">
                {{ locales.LABEL_WITHDRAW }}
            </Button>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ComponentName as PageName } from '../Atm.vue';

import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';
import Input from '../../../components/Input.vue';

const ComponentName = 'Withdraw';
export default defineComponent({
    name: ComponentName,
    props: {
        bank: Number,
        locales: Object,
    },
    data() {
        return {
            value: 0,
            validity: {
                withdraw: false,
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
            if (!this.validity.withdraw) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${PageName}:Action`, 'withdraw', this.value);
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
