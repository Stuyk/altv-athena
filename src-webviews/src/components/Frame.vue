<template>
    <div class="frame" :style="computedStyle">
        <slot name="toolbar"></slot>
        <div class="wrapper" :class="computedWrapper" :style="computedInnerWrapperStyle">
            <div class="content">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const ComponentName = 'Frame';
export default defineComponent({
    name: ComponentName,
    props: {
        minWidth: {
            type: String,
            required: true,
        },
        maxWidth: {
            type: String,
            required: true,
        },
        maxHeight: {
            type: String,
            required: false,
        },
        noPadding: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        computedStyle() {
            let style = '';

            if (this.minWidth) {
                style += `min-width: ${this.minWidth} !important;`;
            }

            if (this.maxWidth) {
                style += `max-width: ${this.maxWidth} !important;`;
            }

            return style;
        },
        computedInnerWrapperStyle() {
            let style = '';

            if (this.maxHeight) {
                style += `max-height: ${this.maxHeight} !important; overflow-y: scroll;`;
            }

            return style;
        },
        computedWrapper() {
            let style = {};

            if (!this.noPadding) {
                style['pa-4'] = true;
            }

            return style;
        },
    },
});
</script>

<style scoped>
.frame {
    position: absolute;
    display: flex;
    flex-direction: column;
    user-select: none;
    min-width: 30vw;
    max-width: 30vw;
    backface-visibility: hidden;
    box-sizing: border-box;
    box-shadow: 0px 0px 50px black;
    border: 2px solid rgba(28, 28, 28, 1);
    border-radius: 6px;
}

.frame .content {
    overflow-y: auto;
    box-sizing: border-box;
}

.frame .wrapper {
    background: rgba(12, 12, 12, 1);
}
</style>
