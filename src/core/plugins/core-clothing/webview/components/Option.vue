<template>
    <div class="stack center-page pa-3">
        <div class="component stack pa-3 mb-3" v-for="(id, index) in getPages" :key="index">
            <div class="overline boldest pb-3" v-if="page.addonLocales && page.addonLocales.length >= 1">
                {{ getLocaleByName(page.addonLocales[index]) }}
            </div>
            <div class="overline">
                {{ getLocaleByName('LABEL_DESIGN') }}
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
                <RangeInput
                    :minIndex="page.isProp ? -1 : 0"
                    :maxIndex="page.maxDrawables[index]"
                    :indexValue="page.drawables[index]"
                    :increment="1"
                    @input="
                        (e) => {
                            $emit('update-component', index, 'drawables', parseInt(e.target['value']));
                        }
                    "
                    @mouseup="
                        (e) => {
                            $emit('force-populate');
                        }
                    "
                    class="pl-3 pr-3 fill-full-width"
                    :key="update"
                />
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
                    {{ getLocaleByName('LABEL_TEXTURE') }}
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
                    <RangeInput
                        :minIndex="0"
                        :maxIndex="
                            page.maxTextures[index] && page.maxTextures[index] >= 1 ? page.maxTextures[index] : 1
                        "
                        :indexValue="page.textures[index]"
                        :increment="1"
                        @input="
                            (e) => {
                                $emit('update-component', index, 'textures', parseInt(e.target['value']));
                            }
                        "
                        class="pl-3 pr-3 fill-full-width"
                    />
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

const ComponentName = 'Option';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
        RangeInput: defineAsyncComponent(() => import('@components/RangeInput.vue')),
    },
    props: {
        page: Object,
        locales: Object,
        update: Number,
    },
    methods: {
        getLocaleByName(name: string) {
            if (!this.locales[name]) {
                return `${name} is not a locale. Please fix your code.`;
            }

            return this.locales[name];
        },
        getMaxTextures(index: number) {
            if (!this.page.maxTextures) {
                return 1;
            }

            return this.page.maxTextures[index] - 1;
        },
    },
    computed: {
        getPages() {
            return this.page.ids;
        },
    },
});
</script>

<style scoped>
.component {
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
}

.center-page {
    min-height: calc(100vh - 175px);
    max-height: calc(100vh - 175px);
    overflow-y: scroll;
    box-sizing: border-box;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}
</style>
