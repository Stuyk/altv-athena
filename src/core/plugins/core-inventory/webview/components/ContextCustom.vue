<template>
    <div class="context-custom-frame" :style="getPosition">
        <div class="context-custom-title">
            {{ contextTitle }}
        </div>
        <div class="context-custom-list">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

export default defineComponent({
    name: 'Context',
    props: {
        contextTitle: {
            type: String,
            required: true,
            default: '',
        },
        x: {
            type: Number,
            required: true,
            default: 0,
        },
        y: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    methods: {},
    computed: {
        getPosition() {
            let style = '';

            style += `left: ${this.x}px; top: ${this.y}px;`;

            return style;
        },
    },
    mounted() {
        //
    },
    unmounted() {
        //
    },
});
</script>

<style>
.context-custom-frame {
    position: fixed;
    display: flex;
    flex-direction: column;
    z-index: 99;
    border: 2px solid #3e3e3e;
    border-radius: 6px;
    box-sizing: border-box;
    min-width: 200px;
    font-size: 14px;
    text-align: left;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.9);
}

.context-custom-title {
    padding: 6px;
    color: aquamarine;
}

.context-custom-list {
    display: flex;
    flex-direction: column;
}

.context-custom-list > div {
    padding: 6px;
    text-align: left;
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.1s ease-in-out;
}

.context-custom-list > div:hover {
    background: #353535;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.9);
}

.context-custom-list > div:active {
    background: #9a9a9a;
    text-shadow: 0px 0px 10px white;
}
</style>
