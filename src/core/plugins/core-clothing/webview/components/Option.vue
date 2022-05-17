<template>
    <div class="stack center-page pa-3">
        <div class="component stack pa-3 mb-3" v-for="(id, index) in page.ids" :key="index">
            <div class="overline boldest pb-3">
                {{ Array.isArray(page.names) ? page.names[index] : page.pageName }}
            </div>
            <!-- Texture -->
            <div class="overline">
                {{ getDesignText }}
            </div>
            <div class="split split-full center pt-6 pb-6">
                <Button
                    color="blue"
                    @click="
                        (e) => {
                            $emit('update-component', index, 'drawables', -1, true);
                        }
                    "
                >
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <template v-if="getMaximumDrawables(page, index)">
                    <span class="counter ml-4 mr-4 overline blue--text">
                        {{ page.drawables[index] }}
                    </span>
                    <input
                        type="range"
                        :min="page.isProp ? -1 : 0"
                        :max="getMaximumDrawables(page, index)"
                        :value="page.drawables[index]"
                        @input="
                            (e) => {
                                $emit('update-component', index, 'drawables', parseInt(e.target['value']));
                            }
                        "
                    />
                    <span class="counter ml-4 mr-4 overline blue--text">
                        {{ getMaximumDrawables(page, index) }}
                    </span>
                </template>
                <Button
                    color="blue"
                    @click="
                        (e) => {
                            $emit('update-component', index, 'drawables', +1, true);
                        }
                    "
                >
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
            <template v-if="page.maxTextures[index] >= 2">
                <div class="overline">
                    {{ getTextureText }}
                </div>
                <div class="split split-full center pt-6">
                    <Button
                        color="blue"
                        @click="
                            (e) => {
                                $emit('update-component', index, 'textures', -1, true);
                            }
                        "
                    >
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <template v-if="getMaximumDrawables(page, index)">
                        <span class="counter ml-4 mr-4 overline blue--text">
                            {{ page.textures[index] }}
                        </span>
                        <input
                            type="range"
                            :min="page.isProp ? -1 : 0"
                            :max="getMaximumTextures(page, index)"
                            :value="page.textures[index]"
                            @input="
                                (e) => {
                                    $emit('update-component', index, 'textures', parseInt(e.target['value']));
                                }
                            "
                        />
                        <span class="counter ml-4 mr-4 overline blue--text">
                            {{ getMaximumTextures(page, index) }}
                        </span>
                    </template>
                    <Button
                        color="blue"
                        @click="
                            (e) => {
                                $emit('update-component', index, 'textures', +1, true);
                            }
                        "
                    >
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { LOCALE_CLOTHING } from '../../shared/locales';

const ComponentName = 'Option';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
        RangeInput: defineAsyncComponent(() => import('@components/RangeInput.vue')),
    },
    data() {
        return {
            update: Date.now(),
        };
    },
    props: {
        page: Object,
    },
    methods: {
        getLocaleByName(name: string) {
            if (!this.locales[name]) {
                return `${name} is not a locale. Please fix your code.`;
            }

            return this.locales[name];
        },
        getMaximumTextures(page, index: number) {
            if (!this.page.maxTextures) {
                return 1;
            }

            return page.maxTextures[index] - 1;
        },
        getMaximumDrawables(page, index) {
            if (!this.page.maxDrawables) {
                return 1;
            }

            return page.maxDrawables[index];
        },
    },
    computed: {
        getDesignText() {
            return LOCALE_CLOTHING.LABEL_DESIGN;
        },
        getTextureText() {
            return LOCALE_CLOTHING.LABEL_TEXTURE;
        },
    },
});
</script>

<style scoped>
.component {
    border: 2px solid rgba(28, 28, 28, 1);
    box-sizing: border-box;
    background: url('../../../../../../src-webviews/public/assets/images/bg.png');
    border-radius: 12px;
}

.center-page {
    min-height: calc(100vh - 175px);
    max-height: calc(100vh - 175px);
    overflow-y: scroll;
    box-sizing: border-box;
    border-bottom: 2px solid rgba(28, 28, 28, 1);
}

.counter {
    min-width: 25px;
}
</style>
