<template>
    <div class="icon" :class="dynamicClass" :style="dynamicStyle" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const ComponentName = 'Icon';
export default defineComponent({
    name: ComponentName,
    props: {
        icon: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        noSelect: {
            type: Boolean,
            required: false,
        },
        shadow: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        dynamicClass() {
            const classes = {};

            if (!this.icon) {
                classes['icon-not-found'] = true;
                return classes;
            }

            if (this.noSelect) {
                classes['icon-no-select'] = true;
            } else {
                classes['icon-active'] = true;
            }

            classes[`${this.icon}`] = true;
            return classes;
        },
        dynamicStyle() {
            let style = 'text-align: center !important;';

            if (!this.size) {
                style += ' font-size: 16px !important;';
            } else {
                style += ` font-size: ${this.size}px !important;`;
            }

            if (this.shadow) {
                style += `text-shadow: 1px 1px black !important;`;
            }

            return style;
        },
    },
});
</script>
