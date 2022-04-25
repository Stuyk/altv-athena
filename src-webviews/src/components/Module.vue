<template>
    <div class="stack" :class="getClass" :style="getStyle">
        <div :class="getSplitClass" class="fill-full-width">
            <template v-if="buttonLeftSide">
                <Button class="mr-2" :color="!show ? 'blue' : 'amber'" @click="show = !show">
                    <Icon :size="14" :icon="show ? 'icon-minus' : 'icon-plus'"></Icon>
                </Button>
            </template>
            <span class="overline module-text" :class="show ? 'amber--text' : 'grey--text'">
                {{ name }}
            </span>
            <template v-if="!buttonLeftSide">
                <Button class="ml-2" :color="!show ? 'blue' : 'amber'" @click="show = !show">
                    <Icon :size="14" :icon="show ? 'icon-minus' : 'icon-plus'"></Icon>
                </Button>
            </template>
        </div>
        <div class="border-slot pa-4 mt-2" v-if="show">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from './Button.vue';
import Icon from './Icon.vue';

const ComponentName = 'Module';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Icon,
    },
    props: {
        name: {
            type: String,
            required: false,
        },
        autoWidth: {
            type: Boolean,
            required: false,
        },
        buttonLeftSide: {
            type: Boolean,
            required: false,
        },
        maxWidth: {
            type: Number,
            required: false,
        },
        minWidth: {
            type: Number,
            required: false,
        },
        alignLeft: {
            type: Boolean,
            required: false,
        },
    },
    data() {
        return {
            show: false,
        };
    },
    computed: {
        getClass() {
            if (this.autoWidth) {
                return { 'module-auto': true };
            }

            return { module: true };
        },
        getStyle() {
            let style = '';

            if (this.maxWidth) {
                style += `max-width: ${this.maxWidth}px;`;
            }

            if (this.minWidth) {
                style += `min-width: ${this.minWidth}px;`;
            }

            return style;
        },
        getSplitClass() {
            let classes = {};

            if (!this.alignLeft) {
                classes['split'] = true;
                classes['space-between'] = true;
            } else {
                classes['split'] = true;
            }

            return classes;
        },
    },
});
</script>

<style scoped>
.module {
    width: 100%;
}

.module-auto {
    width: auto;
}

.border-slot {
    width: 100%;
    border: 2px solid rgba(32, 32, 32, 1);
    box-sizing: border-box;
    border-radius: 6px;
}

.module-text {
    display: flex;
    align-items: center;
}

.fill-full-width {
    width: 100%;
}
</style>
