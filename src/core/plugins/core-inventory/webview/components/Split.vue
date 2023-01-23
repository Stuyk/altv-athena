<template>
    <div class="split-frame">
        <div class="stack">
            <span class="item-info mb-4">{{ name }} - {{ quantity }}x</span>
            <div class="split split-full-width center">
                <Button class="mr-4" color="blue" @click="adjust(-1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <input type="number" class="split-input" v-model="amount" />
                <Button class="ml-4" color="blue" @click="adjust(1)">
                    <Icon :size="14" icon="icon-chevron-right"> </Icon>
                </Button>
            </div>
            <div class="split split-full-width mt-4 space-between">
                <Button class="mr-4" color="green" @click="finish">Split</Button>
                <Button class="" color="red" @click="$emit('cancel-split')">Cancel</Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import WebViewEvents from '@ViewUtility/webViewEvents';
import { INVENTORY_EVENTS } from '@AthenaPlugins/core-inventory/shared/events';

export default defineComponent({
    name: 'Split',
    components: {
        Button: defineAsyncComponent(() => import('@ViewComponents/Button.vue')),
        Icon: defineAsyncComponent(() => import('@ViewComponents/Icon.vue')),
    },
    data() {
        return {
            amount: 1,
        };
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        slot: {
            type: Number,
            required: true,
        },
    },
    methods: {
        adjust(value: number) {
            this.amount += value;
            if (this.amount < 1) {
                this.amount = 1;
            }

            if (this.amount >= this.quantity) {
                this.amount = this.quantity - 1;
            }
        },
        finish() {
            WebViewEvents.emitServer(INVENTORY_EVENTS.TO_SERVER.SPLIT, 'inventory', this.slot, this.amount);
            this.$emit('cancel-split');
        },
    },
});
</script>

<style>
.split-frame {
    display: flex;
    position: absolute;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(5px);
    width: 100%;
    height: 100%;
    z-index: 199;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
}

.split-input {
    padding: 11px;
    min-width: 36px;
    max-width: 36px;
    border: 2px solid rgba(48, 48, 48, 1);
    background: rgba(12, 12, 12, 1);
    color: white;
    font-family: 'Consolas';
}
</style>
