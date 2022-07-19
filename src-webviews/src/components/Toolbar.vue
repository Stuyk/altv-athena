<template>
    <div class="toolbar pa-2">
        <div class="split split-full space-between">
            <span class="grey--text overline">
                <slot />
            </span>
            <template v-if="!hideExit">
                <template v-if="!overrideCallback && pageName">
                    <Icon class="red--text red--hover hover" @click="closePage" :size="24" icon="icon-times-circle" />
                </template>
                <template v-if="overrideCallback && !pageName">
                    <Icon
                        class="red--text red--hover hover"
                        @click="$emit('close-click')"
                        :size="24"
                        icon="icon-times-circle"
                    />
                </template>
                <template v-if="!overrideCallback && !pageName">
                    <Icon class="grey--text text--darken-3" :noSelect="true" :size="24" icon="icon-times-circle" />
                </template>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { WebViewEventNames } from '../../../src/core/shared/enums/webViewEvents';
import Icon from './Icon.vue';

const ComponentName = 'Toolbar';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon,
    },
    props: {
        pageName: {
            type: String,
            required: false,
        },
        hideExit: {
            type: Boolean,
            default: false,
        },
        overrideCallback: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        closePage() {
            if ('alt' in window) {
                alt.emit(WebViewEventNames.CLOSE_PAGE);
            }
        },
    },
});
</script>

<style scoped>
.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    justify-items: center;
    align-items: center;
    align-content: center;
    background: rgba(12, 12, 12, 1) !important;
    border-bottom: 2px solid rgba(24, 24, 24, 1);
    width: 100%;
    box-sizing: border-box;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}
</style>
