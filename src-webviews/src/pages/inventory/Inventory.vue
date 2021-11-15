<template>
    <div class="split-three-way">
        <div class="equipment">
            <div class="equipment-grid">
                <div
                    v-for="(item, index) in equipment"
                    :id="`e-${index}`"
                    :class="getItemClass(item, index, equipmentSize)"
                    :key="index"
                    v-on="!item ? null : { mousedown: selectItem, mouseenter: selectItemInfo, mouseleave: setItemInfo }"
                >
                    <template v-if="item">
                        <div class="icon no-pointer">
                            <img :src="`../../assets/icons/${item.icon}.png`" />
                        </div>
                        <div class="stats no-pointer">
                            <div class="quantity">{{ item.quantity }}x</div>
                            <div class="weight" v-if="item && item.data && item.data.weight">
                                {{ item.data.weight }}u
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="grey--text text-caption no-pointer descriptor">
                            {{ locales.ITEM_SLOTS[index] }}
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="character">
            <div class="toolbar-grid">
                <div
                    v-for="(item, index) in toolbar"
                    :key="index"
                    :id="`t-${index}`"
                    :class="!item ? { 'is-null-item': true } : { item: true }"
                    v-on="!item ? null : { mousedown: selectItem, mouseenter: selectItemInfo, mouseleave: setItemInfo }"
                >
                    <template v-if="item">
                        <div class="icon no-pointer">
                            <img :src="`../../assets/icons/${item.icon}.png`" />
                        </div>
                        <div class="stats no-pointer">
                            <div class="quantity">{{ item.quantity }}x</div>
                            <div class="weight" v-if="item && item.data && item.data.weight">
                                {{ item.data.weight }}u
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="grey--text text--darken-2 no-pointer descriptor">
                            {{ index + 1 }}
                        </div>
                    </template>
                </div>
            </div>
            <h4 class="white--text boldest overline weight-holder" v-if="getCurrentWeight() >= 1">
                Weight | {{ getCurrentWeight() }}u
            </h4>
        </div>
        <div class="inventory">
            <div class="inventory-grid">
                <div
                    v-for="(item, index) in inventory"
                    :id="`i-${index}`"
                    :key="index"
                    :class="getItemClass(item, index, inventorySize)"
                    v-on="!item ? null : { mousedown: selectItem, mouseenter: selectItemInfo, mouseleave: setItemInfo }"
                >
                    <template v-if="item">
                        <div class="icon">
                            <img :src="`../../assets/icons/${item.icon}.png`" />
                        </div>
                        <div class="consume" v-if="item && item.data && item.data.event">
                            <v-icon color="light-blue accent-3" small>icon-arrow-down</v-icon>
                        </div>
                        <div class="quantity">{{ item.quantity }}x</div>
                        <div class="weight" v-if="item && item.data && item.data.weight">{{ item.data.weight }}u</div>
                    </template>
                    <template v-if="!item && index >= size" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DefaultLocales from './utility/defaultLocale';

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'Inventory';
export default defineComponent({
    name: ComponentName,
    // Used to define state
    data() {
        return {
            inventorySize: 28,
            equipmentSize: 11,
            toolbarSize: 4,
            inventory: [],
            equipment: [],
            toolbar: [],
            locales: DefaultLocales,
        };
    },
    // Used to define functions you can call with 'this.x'
    methods: {
        getCurrentWeight() {
            let weight = 0;

            const arraysToUse = [this.inventory, this.equipment, this.toolbar];

            for (let i = 0; i < arraysToUse.length; i++) {
                const array = arraysToUse[i];
                for (let x = 0; x < array.length; x++) {
                    const item = array[x];
                    if (!item) {
                        continue;
                    }

                    if (!item.data) {
                        continue;
                    }

                    if (item.data.weight) {
                        weight += parseFloat(item.data.weight);
                    }
                }
            }

            return weight;
        },
        getItemClass(item: Object | null, index: number, sizeToCheck: number) {
            if (!item && index >= sizeToCheck) {
                return { 'is-unusable-slot': true };
            }

            if (!item) {
                return { 'is-null-item': true };
            }

            return { item: true };
        },
        updateInventory(items: Array<{ slot: number }>, size = 28) {
            // Establishing the initial inventory size.
            // Based on a server-side setting.
            // However, the size will handle expanded inventory size automatically.
            const sizeToUse = items.length > size ? items.length : size;
            const inventory = new Array(sizeToUse).fill(null);

            for (let i = 0; i < items.length; i++) {
                const slot = items[i].slot;
                inventory[slot] = items[i];
            }

            while (inventory.length % 3 !== 0) {
                inventory.push(null);
            }

            this.inventorySize = size;
            this.inventory = inventory;
        },
        updateEquipment(equipmentItems: Array<{ slot: number }>) {
            // Normal equipment is 11. 12 is to make it even.
            const newEquipment = new Array(12).fill(null);
            equipmentItems.forEach((item) => {
                if (!item) {
                    return;
                }

                newEquipment[item.slot] = item;
            });

            this.equipment = newEquipment;
        },
        updateToolbar(items: Array<{ slot: number }>, size = 4) {
            const sizeToUse = items.length > size ? items.length : size;
            const toolbar = new Array(sizeToUse).fill(null);

            items.forEach((item) => {
                if (!item) {
                    return;
                }

                toolbar[item.slot] = item;
            });

            this.toolbar = toolbar;
        },
    },
    // Called when the page is loaded.
    mounted() {
        if (!('alt' in window)) {
            // Normal equipment is 11. 12 is to make it even.
            this.equipment = new Array(12).fill(null);
            this.inventory = new Array(28).fill(null);
            this.toolbar = new Array(4).fill(null);

            this.updateEquipment([
                {
                    name: `Hat`,
                    uuid: `some_hash_thing_ground`,
                    description: `What a cozy hat! Wow. Much cozy. Many comforts.`,
                    icon: 'hat',
                    slot: 0,
                    quantity: 1,
                    data: {
                        weight: 1,
                        event: 'test',
                    },
                },
                {
                    name: `Hat`,
                    uuid: `some_hash_thing_ground`,
                    description: `What a cozy hat! Wow. Much cozy. Many comforts.`,
                    icon: 'glasses',
                    slot: 5,
                    quantity: 1,
                    data: {
                        event: 'test',
                    },
                },
            ]);

            this.updateToolbar([
                {
                    name: `Pistol`,
                    uuid: `some_hash_thing_ground`,
                    description: `bang`,
                    icon: 'pistol50',
                    slot: 0,
                    quantity: 1,
                    data: {
                        weight: Math.floor(Math.random() * 5) + 1,
                    },
                },
            ]);

            this.updateInventory([
                {
                    name: `Box`,
                    uuid: `some_hash_thing_ground`,
                    description: `It is a box.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 28),
                    quantity: 1,
                    weight: Math.floor(Math.random() * 5),
                    data: {
                        weight: 1,
                    },
                },
                {
                    name: `Box`,
                    uuid: `some_hash_thing_ground`,
                    description: `It is a box.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 28),
                    quantity: 1,
                    weight: Math.floor(Math.random() * 5),
                    data: {
                        weight: 1,
                    },
                },
                {
                    name: `Box`,
                    uuid: `some_hash_thing_ground`,
                    description: `It is a box.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 28),
                    quantity: 1,
                    weight: Math.floor(Math.random() * 5),
                    data: {
                        weight: 1,
                    },
                },
            ]);
            return;
        }

        // Bind Events to Methods
        if ('alt' in window) {
            // alt.on('x', this.whatever);
        }
    },
    // Called when the page is unloaded.
    unmounted() {
        // Unbind Events from the Mounted Function
        if ('alt' in window) {
            // alt.off('x', this.whatever);
        }

        // Make sure to turn off any document events as well.
        // Only if they are present of course.
        // Example:
        // document.removeEventListener('mousemove', this.someFunction)
    },
});
</script>

<style scoped>
.split-three-way {
    display: flex;
    min-width: 100vw;
    max-width: 100vw;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    justify-content: space-evenly;
}

.equipment,
.inventory {
    width: auto;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    align-self: flex-start;
    align-items: center;
    flex-direction: column;
    margin-top: 12px !important;
    margin-left: 12px;
    margin-right: 12px;
}

.character {
    width: 50vw;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-top: 12px;
    padding-bottom: 12px;
    align-self: flex-start;
    flex-direction: column;
}

.inventory-grid,
.toolbar-grid,
.equipment-grid {
    display: grid;
    box-sizing: border-box;
    grid-template-columns: repeat(3, 10vh);
    grid-auto-rows: 10vh;
    grid-gap: 0.5vh;
    user-select: none;
    position: relative;
    padding: 5px !important;
    box-sizing: border-box;
    border: 2px solid rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
}

.inventory-grid {
    max-height: calc(100vh - 24px);
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 5px !important;
    box-sizing: border-box;
    border: 2px solid rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
}

.toolbar-grid {
    grid-template-columns: repeat(4, 10vh);
}

.item {
    display: block;
    position: relative;
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
    border: 2px solid rgba(0, 0, 0, 0.5);
    background: rgba(0, 0, 0, 0.75);
}

.item:hover {
    background: rgba(0, 0, 0, 0.85);
}

.icon {
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    font-family: 'Roboto';
    overflow: hidden;
    user-select: none !important;
    pointer-events: none !important;
}

.icon img {
    min-width: 6.6666666666667vh;
    max-width: 6.6666666666667vh;
    user-select: none !important;
    pointer-events: none !important;
}

.is-null-item {
    position: relative;
    direction: ltr;
    cursor: pointer;
    border: 2px solid transparent;
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    border: 2px solid rgba(0, 0, 0, 0.5);
    cursor: auto;
}

.is-unusable-slot {
    position: relative;
    direction: ltr;
    cursor: pointer;
    border: 2px solid transparent;
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
    background: rgba(255, 0, 0, 0.5);
    border: 2px dotted rgba(0, 0, 0, 0.5);
    cursor: auto;
}

.quantity {
    position: absolute;
    text-shadow: 1px 1px black;
    font-size: 11px;
    color: yellow;
    right: 0.5vh;
    bottom: 0;
    font-family: monospace;
    pointer-events: none !important;
}

.weight {
    position: absolute;
    text-shadow: 1px 1px black;
    font-size: 11px;
    color: yellow;
    left: 0.2vh;
    top: 0;
    font-family: monospace;
    pointer-events: none !important;
}

.descriptor {
    display: flex;
    text-align: center;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
    height: 100%;
}

.weight-holder {
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(0, 0, 0, 0.4) 30%,
        rgba(0, 0, 0, 0.4) 60%,
        rgba(255, 255, 255, 0) 100%
    );
    width: 50%;
    text-align: center;
    padding-top: 5px;
    padding-bottom: 5px;
}
</style>
