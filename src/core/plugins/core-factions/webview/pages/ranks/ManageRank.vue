<template>
    <div class="wrapper">
        <Modal>
            <Frame minWidth="30vw" maxWidth="30vw" maxHeight="800px">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">Permissions - {{ rank.name }}</Toolbar>
                </template>
                <template v-slot:content>
                    <div class="stack">
                        <Button
                            class="permission mb-4"
                            v-for="(permission, index) in getPermissions"
                            :key="index"
                            :color="getButtonColor(permission.value)"
                            @click="togglePermission(permission.key)"
                        >
                            <div class="split space-between">
                                <span class="key">{{ permission.key }}</span>
                                <template v-if="permission.value">
                                    <Icon :size="12" icon="icon-checkmark" />
                                </template>
                                <template v-else>
                                    <Icon :size="14" icon="icon-cross" />
                                </template>
                            </div>
                        </Button>
                        <div class="split">
                            <div style="width: 100%; display: block"></div>
                            <Button class="mt-2" color="red" :style="'border-radius: 6px;'" @click="close">
                                <Icon :size="14" icon="icon-cross" />
                            </Button>
                            <Button class="ml-4 mt-2" color="green" :style="'border-radius: 6px;'" @click="update()">
                                <Icon :size="14" icon="icon-save" />
                            </Button>
                        </div>
                    </div>
                </template>
            </Frame>
        </Modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { FactionRank } from '../../../shared/interfaces';
import { AllRankPermissions } from '../../../shared/defaultData';

const ComponentName = 'ManageRank';
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
            Type: Object as () => FactionRank,
            default: null,
        },
    },
    data() {
        return {
            rankCopy: {} as FactionRank,
        };
    },
    computed: {
        getPermissions() {
            const permissionsAsArray = [];

            if (!this.rankCopy || !this.rankCopy.rankPermissions) {
                return permissionsAsArray;
            }

            const allPermissions = { ...AllRankPermissions, ...this.rankCopy.rankPermissions };

            Object.keys(allPermissions).forEach((key) => {
                permissionsAsArray.push({ key, value: allPermissions[key] });
            });

            return permissionsAsArray;
        },
    },
    methods: {
        togglePermission(key: string) {
            const copyClone = { ...this.rankCopy } as FactionRank;
            copyClone.rankPermissions[key] = !copyClone.rankPermissions[key];
            this.rankCopy = copyClone;
        },
        getButtonColor(value: boolean) {
            if (value) {
                return 'green';
            }

            return 'red';
        },
        close() {
            this.$emit('close');
        },
        update() {
            this.$emit('update', this.rankCopy.rankPermissions);
        },
    },
    mounted() {
        this.rankCopy = this.rank;
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
