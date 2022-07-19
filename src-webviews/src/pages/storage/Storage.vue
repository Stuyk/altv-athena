<template>
    <Frame minWidth="75vw" maxWidth="75vw">
        <template v-slot:toolbar>
            <Toolbar @close-page="relayClosePage" pageName="Storage">{{ name }}</Toolbar>
        </template>
        <template v-slot:content>
            <div class="split split-full space-between">
                <div class="scroll mr-2 pa-2">
                    <div class="item mb-2" v-for="(item, index) in storage" :key="index">
                        <div class="stack card pa-2" style="width: 100%">
                            <!-- Top Half of Item -->
                            <div class="item-split">
                                <div class="icon-wrap pr-2">
                                    <img :src="ResolvePath(`../../assets/icons/${item.icon}.png`)" />
                                </div>
                                <span style="width: 100%">{{ item.name }} ({{ item.quantity }}x)</span>
                                <Button
                                    class="mr-2"
                                    color="orange"
                                    @click="startSplit('storage', index)"
                                    v-if="item.quantity >= 2"
                                >
                                    <Icon class="stat-icon" :size="18" icon="icon-filter_list"></Icon>
                                </Button>
                                <Button color="green" @click="moveFromStorage(index)">
                                    <Icon class="stat-icon" :size="18" icon="icon-chevron-right"></Icon>
                                </Button>
                            </div>
                            <!-- Bottom Half / Split Functionality -->
                            <template v-if="split && split.name === 'storage' && split.index === index">
                                <span class="center pt-4">{{ locales.LABEL_SPLIT_TEXT }}</span>
                                <span class="center pt-2">{{ splitAmount }}x</span>

                                <div
                                    class="split split-full center pt-4"
                                    v-if="getItem() && getItem().quantity - 1 >= 2"
                                >
                                    <Button color="blue" @click="setIncrementAmount(null, -1)">
                                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                                    </Button>
                                    <RangeInput
                                        :minIndex="1"
                                        :maxIndex="getItem().quantity - 1"
                                        :indexValue="splitAmount"
                                        :increment="1"
                                        @input="(e) => setIncrementAmount(e, null)"
                                        style="width: 100%"
                                        class="pl-1 pr-1"
                                    />
                                    <Button color="blue" @click="setIncrementAmount(null, 1)">
                                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                                    </Button>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="scroll ml-2 pa-2">
                    <div class="item mb-2" v-for="(item, index) in inventory" :key="index">
                        <div class="stack card pa-2" style="width: 100%">
                            <!-- Top Half of Item -->
                            <div class="item-split">
                                <Button color="green" @click="moveFromPlayer(index)">
                                    <Icon class="stat-icon" :size="18" icon="icon-chevron-left"></Icon>
                                </Button>
                                <Button
                                    class="mr-2"
                                    color="orange"
                                    v-if="item.quantity >= 2"
                                    @click="startSplit('inventory', index)"
                                >
                                    <Icon class="stat-icon" :size="18" icon="icon-filter_list"></Icon>
                                </Button>
                                <span style="width: 100%; text-align: right"
                                    >{{ item.name }} ({{ item.quantity }}x)</span
                                >
                                <div class="icon-wrap pl-2">
                                    <img :src="ResolvePath(`../../assets/icons/${item.icon}.png`)" />
                                </div>
                            </div>
                            <template v-if="split && split.name === 'inventory' && split.index === index">
                                <span class="center pt-4">{{ locales.LABEL_SPLIT_TEXT }}</span>
                                <span class="center pt-2">{{ splitAmount }}x</span>

                                <div
                                    class="split split-full center pt-4"
                                    v-if="getItem() && getItem().quantity - 1 >= 2"
                                >
                                    <Button color="blue" @click="setIncrementAmount(null, -1)">
                                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                                    </Button>
                                    <RangeInput
                                        :minIndex="1"
                                        :maxIndex="getItem().quantity - 1"
                                        :indexValue="splitAmount"
                                        :increment="1"
                                        @input="(e) => setIncrementAmount(e, null)"
                                        style="width: 100%"
                                        class="pl-1 pr-1"
                                    />
                                    <Button color="blue" @click="setIncrementAmount(null, 1)">
                                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                                    </Button>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Frame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '../../components/Icon.vue';
import Button from '../../components/Button.vue';
import Toolbar from '../../components/Toolbar.vue';
import Frame from '../../components/Frame.vue';
import RangeInput from '../../components/RangeInput.vue';
import { inventory, storage } from './utility/testData';
import DefaultLocale from './utility/defaultLocale';
import ResolvePath from '../../utility/pathResolver';

export const ComponentName = 'Storage';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        RangeInput,
        Toolbar,
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            name: 'Some Storage Box',
            locales: DefaultLocale,
            inventory: [],
            storage: [],
            split: null,
            splitAmount: 1,
        };
    },
    methods: {
        ResolvePath,
        setIncrementAmount(e, amount) {
            // Clicked a button
            if (!e) {
                if (amount <= -1 && this.splitAmount - 1 >= 1) {
                    this.splitAmount -= 1;
                    return;
                }

                if (amount >= 1 && this.splitAmount + 1 <= this.getItem().quantity - 1) {
                    this.splitAmount += 1;
                    return;
                }
                return;
            }

            const value = parseFloat(e.target['value']);
            this.splitAmount = value;
        },
        getItem() {
            if (!this.split) {
                return null;
            }

            return this[this.split.name][this.split.index];
        },
        relayClosePage() {
            this.$emit('close-page', `${ComponentName}:Close`);
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${ComponentName}:Close`);
        },
        startSplit(name: string, index: number) {
            if (this.split && this.split.name === name && this.split.index === index) {
                this.split = null;
                return;
            }

            this.split = {
                name,
                index,
            };
        },
        clearSplit() {
            this.split = null;
            this.splitAmount = 1;
        },
        setName(name: string) {
            this.name = name;
        },
        setStorage(storage) {
            this.storage = storage;
        },
        setInventory(inventory) {
            this.inventory = inventory;
        },
        condenseItemData(item, flipQuantity = false) {
            let actualName;

            if (item.name.length >= 12) {
                actualName = `${item.name.substring(0, 15)}...`;
            } else {
                actualName = item.name;
            }

            if (flipQuantity) {
                return `(${item.quantity}x) ${actualName}`;
            }

            return `${actualName} (${item.quantity}x)`;
        },
        moveFromPlayer(index: number | string) {
            if (!('alt' in window)) {
                return;
            }

            if (index === null || index === undefined) {
                return;
            }

            const amount = this.split && `${this.split.index}` === `${index}` ? this.splitAmount : null;
            alt.emit(`${ComponentName}:MoveFromPlayer`, index, amount);
            this.clearSplit();
        },
        moveFromStorage(index: number | string) {
            if (!('alt' in window)) {
                return;
            }

            if (index === null || index === undefined) {
                return;
            }

            const amount = this.split && `${this.split.index}` === `${index}` ? this.splitAmount : null;
            alt.emit(`${ComponentName}:MoveFromStorage`, index, amount);
            this.clearSplit();
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on(`${ComponentName}:SetName`, this.setName);
            alt.on(`${ComponentName}:SetStorage`, this.setStorage);
            alt.on(`${ComponentName}:SetInventory`, this.setInventory);
            alt.emit(`${ComponentName}:Ready`);
        } else {
            this.setInventory(inventory);
            this.setStorage(storage);
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(`${ComponentName}:SetName`, this.setName);
            alt.off(`${ComponentName}:SetStorage`, this.setStorage);
            alt.off(`${ComponentName}:SetInventory`, this.setInventory);
        }
    },
});
</script>

<style scoped>
.scroll {
    display: flex;
    flex-direction: column;
    min-height: 400px;
    max-height: 400px;
    width: 100%;
    overflow-y: scroll;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.card {
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.item {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    box-sizing: border-box;
    align-items: center;
}

.item-split {
    display: flex;
    width: 100%;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
}

.icon-wrap {
    max-width: 35px;
    max-height: 35px !important;
    object-fit: cover;
}

.icon-wrap img {
    width: 100%;
    height: 100%;
}
</style>
