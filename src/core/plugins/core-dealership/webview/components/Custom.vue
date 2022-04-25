<template>
    <div class="preview-component">
        <div class="stack pt-2 pl-2 pr-2 dealership-header">
            <div class="split space-between">
                <Button class="mr-2 fill-full-width" color="yellow" @click="goBack"> &lt; {{ LOCALE.BACK }} </Button>
                <template v-if="canPurchase">
                    <Button class="fill-full-width" color="green" @click="purchaseVehicle">
                        {{ LOCALE.PURCHASE }}
                    </Button>
                </template>
                <template v-else>
                    <Button class="fill-full-width" :disable="true">
                        {{ LOCALE.PURCHASE }}
                    </Button>
                </template>
            </div>
        </div>
        <div class="stack pt-2 pl-2 pr-2 dealership-options">
            <div class="split space-between">
                <Button class="mr-2 fill-full-width" color="red" @click="exit">
                    {{ LOCALE.EXIT }}
                </Button>
                <Button class="fill-full-width" color="orange" @click="camera">
                    {{ LOCALE.CAMERA }}
                </Button>
            </div>
        </div>
        <div class="stack pt-4 pl-2 pr-2 dealership-body">
            <div class="split space-between">
                <span class="overline">
                    {{ vehicle.display }}
                </span>
                <span class="overline">${{ vehicle.price }}</span>
            </div>
            <br />
            <span class="overline mt-2 mb-2">Color</span>
            <div class="palette mb-2">
                <div v-for="(colorSet, index) in colors" :key="index">
                    <div class="selectable-box" @click="setColor(colorSet.id)" :style="getStyle(colorSet.color)"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

import { DEALERSHIP_LOCALE } from '../../shared/locale';

export default defineComponent({
    name: 'Preview',
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        SimpleInput: defineAsyncComponent(() => import('@components/SimpleInput.vue')),
    },
    props: {
        money: {
            type: Number,
            required: true,
        },
        vehicle: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            LOCALE: DEALERSHIP_LOCALE,
            colors: [
                { id: 0, color: `#0d1116` }, // Metallic Black
                { id: 5, color: `#c2c4c6` }, // Metallic Blue Silver
                { id: 27, color: `#c00e1a` }, // Metallic Red
                { id: 37, color: `#c2944f` }, // Metallic Gold
                { id: 38, color: `#f78616` }, // Metallic Orange
                { id: 53, color: `#155c2d` }, // Metallic Green
                { id: 55, color: `#66b81f` }, // Lime Green
                { id: 60, color: `#65867f` }, // Sea Wash
                { id: 64, color: `#47578f` }, // Metallic Blue
                { id: 70, color: `#0b9cf1` }, // Metallic Bright Blue
                { id: 106, color: `#402e2b` }, // Metallic Brown
                { id: 106, color: `#dfd5b2` }, // Metallic Bleeched Sand
                { id: 137, color: `#f21f99` }, // Hot Pink
                { id: 145, color: `#621276` }, //Purple
            ],
        };
    },
    computed: {
        canPurchase() {
            return this.vehicle.canPurchase;
        },
    },
    methods: {
        camera() {
            this.$emit('camera');
        },
        purchaseVehicle() {
            this.$emit('purchase');
        },
        goBack() {
            this.$emit('go-back');
        },
        setColor(id: number | string) {
            this.$emit('set-color', id);
        },
        getStyle(hex: string) {
            return {
                'background-color': hex,
            };
        },
        exit() {
            this.$emit('exit-window');
        },
    },
});
</script>

<style scoped>
.dealership-header {
    min-height: 50px;
    max-height: 50px;
}

.dealership-options {
    min-height: 50px;
    max-height: 50px;
}

.dealership-body {
    min-height: calc(100vh - 134px);
    max-height: calc(100vh - 134px);
    overflow-y: scroll;
    border-top: 2px solid rgba(48, 48, 48, 1);
}

.palette {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: auto;
    border: 2px solid rgba(64, 64, 64, 1);
    padding: 12px;
    background: rgba(24, 24, 24, 1);
    align-self: stretch;
    max-height: 45vh;
}

.selectable-box {
    min-width: 26px;
    max-width: 26px;
    min-height: 26px;
    max-height: 26px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    margin: 1px;
    border-radius: 4px;
}

.selectable-box:hover {
    cursor: pointer;
    border: 3px solid rgba(255, 255, 255, 0.75);
    box-sizing: border-box;
}
</style>
