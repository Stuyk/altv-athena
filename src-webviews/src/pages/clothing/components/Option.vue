<template>
    <div class="stack center-page pa-6">
        <div class="component stack" v-for="(id, index) in page.ids" :key="index">
            <!-- <div class="overline">
                {{ getLocaleByName('LABEL_DESIGN') }}
            </div> -->
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
                    :minIndex="-1"
                    :maxIndex="page.maxDrawables[index]"
                    :indexValue="page.drawables[index]"
                    :increment="1"
                    @input="
                        (e) => {
                            $emit('update-component', index, 'drawables', parseInt(e.target.value));
                        }
                    "
                    style="width: 100%"
                    class="pl-3 pr-3"
                    :key="page"
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
            <template v-if="page.maxTextures[index] >= 1">
                <!-- <div class="overline">
                    {{ getLocaleByName('LABEL_TEXTURE') }}
                </div> -->
                <div class="split split-full center pt-6 pb-6">
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
                        :minIndex="-1"
                        :maxIndex="page.maxTextures[index]"
                        :indexValue="page.textures[index]"
                        :increment="1"
                        @input="
                            (e) => {
                                $emit('update-component', index, 'textures', parseInt(e.target.value));
                            }
                        "
                        style="width: 100%"
                        class="pl-3 pr-3"
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
import { defineComponent } from 'vue';

import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';
import Module from '../../../components/Module.vue';
import RangeInput from '../../../components/RangeInput.vue';

const ComponentName = 'Option';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Icon,
        Module,
        RangeInput,
    },
    props: {
        page: Object,
    },
    data() {
        return {
            // Used to prevent certain hair values
            greylist: {
                masculine: [23],
                feminine: [24],
            },
        };
    },
    methods: {},
});
</script>
