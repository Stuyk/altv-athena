<template>
    <div class="context-frame" :style="getPosition">
        <div class="context-title">
            {{ contextTitle }}
        </div>
        <div class="context-list">
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
.context-frame {
    position: fixed;
    display: flex;
    flex-direction: column;
    z-index: 99;
    background: #585858;
    border: 2px solid #3e3e3e;
    box-sizing: border-box;
    min-width: 200px;
    font-size: 14px;
    text-align: left;
    border-radius: 3px;
}

.context-title {
    padding: 6px;
    background: #7b7b7b;
    color: aquamarine;
}

.context-list {
    display: flex;
    flex-direction: column;
}

.context-list > div {
    padding: 6px;
    text-align: left;
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.1s ease-in-out;
}

.context-list > div:hover {
    background: #353535;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0px 0px 5px white;
}

.context-list > div:active {
    background: #9a9a9a;
    text-shadow: 0px 0px 10px white;
}
</style>
