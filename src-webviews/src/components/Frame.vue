<template>
    <div class="frame" :style="computedStyle">
        <slot name="toolbar"></slot>
        <div class="wrapper pa-4">
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
}

.frame .content {
    overflow-y: auto;
    box-sizing: border-box;
}

.frame .wrapper {
    background: rgba(12, 12, 12, 1);
}
</style>
