<template>
    <div class="wrapper">
        <Modal>
            <Frame minWidth="30vw" maxWidth="30vw">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">Add a New Rank</Toolbar>
                </template>
                <template v-slot:content>
                    <div class="stack">
                        <span class="subtitle-2">What is the new rank name?</span>
                        <input class="mb-4" v-model="newRankName" placeholder="New rank name..." />
                        <span class="subtitle-2">Rank Weight (1 - 98)</span>
                        <input class="mb-4" type="number" v-model="newRankWeight" placeholder="Rank weight 0-99" />
                        <div class="split">
                            <div style="width: 100%; display: block"></div>
                            <Button class="mt-2" color="red" :style="'border-radius: 6px;'" @click="close">
                                <Icon :size="14" icon="icon-cross" />
                            </Button>
                            <template v-if="isRankWeightValid">
                                <Button
                                    class="ml-4 mt-2"
                                    color="green"
                                    :style="'border-radius: 6px;'"
                                    @click="update()"
                                >
                                    <Icon :size="14" icon="icon-checkmark" />
                                </Button>
                            </template>
                            <template v-else>
                                <Button class="ml-4 mt-2" :style="'border-radius: 6px;'" :disable="true">
                                    <Icon :size="14" icon="icon-checkmark" />
                                </Button>
                            </template>
                        </div>
                    </div>
                </template>
            </Frame>
        </Modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Faction } from '../../../shared/interfaces';

const ComponentName = 'AddRank';
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
        faction: {
            Type: Object as () => Faction,
            default: null,
        },
    },
    data() {
        return {
            newRankName: '',
            newRankWeight: 50,
            isRankNameValid: false,
            isRankWeightValid: false,
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        update() {
            this.$emit('update', this.newRankName, this.newRankWeight);
        },
    },
    watch: {
        newRankName(newName) {
            if (!newName || newName.length <= 3) {
                this.isRankNameValid = false;
                return;
            }

            this.isRankNameValid = true;
        },
        newRankWeight(newRank, oldRank) {
            if (newRank === '') {
                this.isRankWeightValid = false;
                return;
            }

            if (newRank < 1 || newRank > 98) {
                this.isRankWeightValid = false;
                return;
            }

            const rankIndex = this.faction.ranks.findIndex((x) => x.weight === newRank);

            if (rankIndex === -1) {
                this.isRankWeightValid = true;
            } else {
                this.isRankWeightValid = false;
            }
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
