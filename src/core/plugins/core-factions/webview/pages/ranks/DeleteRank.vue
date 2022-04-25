<template>
    <div class="wrapper">
        <Modal>
            <template v-if="rank">
                <Frame minWidth="30vw" maxWidth="30vw">
                    <template v-slot:toolbar>
                        <Toolbar :hideExit="true">Delete Rank Name? - ({{ rank.name }})</Toolbar>
                    </template>
                    <template v-slot:content>
                        <div class="stack">
                            <p>Are you sure?</p>
                            <div class="split">
                                <div style="width: 100%; display: block"></div>
                                <Button class="mt-2" color="red" :style="'border-radius: 6px;'" @click="close">
                                    <Icon :size="14" icon="icon-cross" />
                                </Button>
                                <Button
                                    class="ml-4 mt-2"
                                    color="green"
                                    :style="'border-radius: 6px;'"
                                    @click="update()"
                                >
                                    <Icon :size="14" icon="icon-checkmark" />
                                </Button>
                            </div>
                        </div>
                    </template>
                </Frame>
            </template>
        </Modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'DeleteRank';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Modal: defineAsyncComponent(() => import('@components/Modal.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
    },
    props: {
        rank: {
            Type: Object,
            default: null,
        },
    },
    methods: {
        close() {
            this.$emit('close');
        },
        update() {
            this.$emit('update');
        },
    },
});
</script>

<style scoped>
input {
    align-self: center;
    font-family: 'Roboto', sans-serif;
    background: rgba(12, 12, 12, 1);
    border: 2px solid rgba(36, 36, 36, 1);
    padding: 6px;
    width: 100%;
    box-sizing: border-box;
    color: white;
}

input:focus {
    border-color: rgba(52, 52, 52, 1);
}
</style>
