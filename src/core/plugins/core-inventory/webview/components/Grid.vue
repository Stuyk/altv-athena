<template>
    <div class="inventory-frame">
        <div class="inventory-toolbar slot">
            <Slot
                v-for="(slot, index) in maxToolbarSlots"
                class="slot"
                location="toolbar"
                :key="index"
                :hasItem="true"
                :slot="index"
                :id="getID('toolbar', index)"
                :quantity="getQuantity('toolbar', index)"
                :name="getName('toolbar', index)"
                @mouseenter="updateDescriptor('toolbar', index)"
                @mouseleave="updateDescriptor(undefined, undefined)"
                @mousedown="(e) => drag(e, { endDrag, canBeDragged: hasItem('toolbar', index), startDrag })"
                @contextmenu="(e) => unequip(e, index)"
            >
                <template v-slot:image v-if="hasItem('toolbar', index)">
                    <img :src="getImagePath(getItem('toolbar', index))" />
                </template>
                <template v-slot:index v-else>
                    <template v-if="showToolbarNumbers">
                        {{ slot }}
                    </template>
                </template>
            </Slot>
        </div>
        <div class="inventory-slots">
            <Slot
                v-for="(slot, index) in maxSlots"
                class="slot"
                :class="getSelectedItemClass('inventory', index)"
                location="inventory"
                :key="index"
                :hasItem="true"
                :slot="index"
                :id="getID('inventory', index)"
                :quantity="getQuantity('inventory', index)"
                :name="getName('inventory', index)"
                @mouseenter="updateDescriptor('inventory', index)"
                @mouseleave="updateDescriptor(undefined, undefined)"
                @contextmenu="(e) => contextMenu(e, index)"
                @mousedown="
                    (e) => drag(e, { endDrag, canBeDragged: hasItem('inventory', index), singleClick, startDrag })
                "
            >
                <template v-slot:image v-if="hasItem('inventory', index)">
                    <img :src="getImagePath(getItem('inventory', index))" />
                </template>
                <template v-slot:index v-else>
                    <template v-if="showGridNumbers">
                        {{ slot }}
                    </template>
                </template>
            </Slot>
        </div>
        <Context :contextTitle="title" :x="context.x" :y="context.y" v-if="context">
            <div @click="contextAction('use')">Use</div>
            <div @click="contextAction('split')">Split</div>
            <div @click="contextAction('drop')">Drop</div>
            <div @click="contextAction('give')">Give</div>
            <div @click="contextAction('cancel')">Cancel</div>
        </Context>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Item } from '@AthenaShared/interfaces/item';
import { makeDraggable } from '@ViewUtility/drag';
import WebViewEvents from '@ViewUtility/webViewEvents';
import { INVENTORY_EVENTS } from '../../shared/events';
import { getImagePath } from '../utility/inventoryIcon';
import { InventoryTypes } from '../utility/interfaces';
import { INVENTORY_CONFIG } from '../../shared/config';
import { debounceReady } from '../utility/debounce';

export default defineComponent({
    name: 'Inventory',
    components: {
        Slot: defineAsyncComponent(() => import('./Slot.vue')),
        Icon: defineAsyncComponent(() => import('@ViewComponents/Icon.vue')),
        Context: defineAsyncComponent(() => import('@ViewComponents/Context.vue')),
    },
    props: {
        offclick: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            toolbar: [] as Array<Item>,
            inventory: [] as Array<Item>,
            maxSlots: 25,
            maxToolbarSlots: 5,
            title: '',
            context: undefined as { x: number; y: number } | undefined,
            slot: -1,
            itemSingleClick: undefined as { type: InventoryTypes; index: number },
            itemName: '',
            itemDescription: '',
            showGridNumbers: INVENTORY_CONFIG.WEBVIEW.GRID.SHOW_NUMBERS,
            showToolbarNumbers: INVENTORY_CONFIG.WEBVIEW.TOOLBAR.SHOW_NUMBERS,
        };
    },
    methods: {
        getImagePath,
        drag: makeDraggable,
        updateDescriptor(type: InventoryTypes, index: number) {
            if (typeof type === 'undefined') {
                this.itemName = '';
                this.itemDescription = '';
                return;
            }

            const item = this.getItem(type, index);
            if (!item) {
                this.itemName = '';
                this.itemDescription = '';
                return;
            }

            this.itemName = item.name;
            this.itemDescription = item.description;
        },
        startDrag() {
            this.itemSingleClick = undefined;
        },
        singleClick(type: InventoryTypes, index: number) {
            if (typeof this.itemSingleClick !== 'undefined') {
                // Ignore same inventory slot
                if (this.itemSingleClick.type === type && this.itemSingleClick.index === index) {
                    return;
                }

                // Ignore inventory types that do not match.
                // Combining should be done inside of inventory only.
                if (this.itemSingleClick.type !== type) {
                    return;
                }

                if (!('alt' in window)) {
                    const secondItem = `${type}-${index}`;
                    const firstItem = `${this.itemSingleClick.type}-${this.itemSingleClick.index}`;
                    console.log(`Combine Event:`, firstItem, secondItem);
                    this.itemSingleClick = undefined;
                    return;
                }

                WebViewEvents.emitServer(
                    INVENTORY_EVENTS.TO_SERVER.COMBINE,
                    this.itemSingleClick.type,
                    this.itemSingleClick.index,
                    type,
                    index,
                );
                this.itemSingleClick = undefined;
                return;
            }

            this.itemSingleClick = { type, index };
        },
        endDrag(startType: InventoryTypes, startIndex: number, endType: InventoryTypes, endIndex: number) {
            if (!('alt' in window)) {
                console.log(`Should Perform SWAP or Stack of items.`);
                console.log(startType, startIndex);
                console.log(endType, endIndex);
                return;
            }

            if (!debounceReady()) {
                return;
            }

            // Call server-side swap / stack
            WebViewEvents.playSound(`@plugins/sounds/${INVENTORY_CONFIG.PLUGIN_FOLDER_NAME}/inv_move.ogg`, 0.2);
            WebViewEvents.emitServer(INVENTORY_EVENTS.TO_SERVER.SWAP, startType, startIndex, endType, endIndex);
        },
        /**
         * Determines if a specific data type has a matching slot item.
         * @param type
         * @param slot
         */
        hasItem(type: 'toolbar' | 'inventory', slot: number): boolean {
            if (typeof this[type] === undefined) {
                return false;
            }

            const items = [...this[type]] as Array<Item>;
            return items.findIndex((item) => item && item.slot === slot) !== -1;
        },
        getQuantity(type: 'toolbar' | 'inventory', slot: number): number {
            if (typeof this[type] === undefined) {
                return 0;
            }

            const items = [...this[type]] as Array<Item>;
            const index = items.findIndex((item) => item && item.slot === slot);
            if (index <= -1) {
                return 0;
            }

            return items[index].quantity;
        },
        getName(type: 'toolbar' | 'inventory', slot: number): string {
            if (typeof this[type] === undefined) {
                return '';
            }

            const items = [...this[type]] as Array<Item>;
            const index = items.findIndex((item) => item && item.slot === slot);
            if (index <= -1) {
                return '';
            }

            return items[index].name;
        },
        getItem(type: 'toolbar' | 'inventory', slot: number): Item | undefined {
            if (typeof this[type] === undefined) {
                return undefined;
            }

            const items = [...this[type]] as Array<Item>;
            return items[items.findIndex((item) => item && item.slot === slot)];
        },
        getSelectedItemClass(type: InventoryTypes, index: number) {
            if (typeof this.itemSingleClick === 'undefined') {
                return {};
            }

            if (this.itemSingleClick.type !== type || this.itemSingleClick.index !== index) {
                return {};
            }

            return { 'item-outline': true };
        },
        getID(type: 'toolbar' | 'inventory', index: number): string {
            return type + '-' + index;
        },
        setMaxSlots(value: number) {
            this.maxSlots = value;
        },
        setItems(inventory: Array<Item>, toolbar: Array<Item>) {
            this.inventory = inventory;
            this.toolbar = toolbar;
        },
        contextMenu(e: MouseEvent, slot: number) {
            e.preventDefault();
            if (!this.hasItem('inventory', slot)) {
                return;
            }

            const item = this.getItem('inventory', slot);
            this.title = item.name;
            this.slot = item.slot;
            this.context = {
                x: e.clientX,
                y: e.clientY,
            };
        },
        contextAction(type: 'use' | 'split' | 'drop' | 'give' | 'cancel') {
            this.context = undefined;

            if (!('alt' in window)) {
                console.log(`It should do ${type} on slot: ` + this.slot);
                return;
            }

            if (type === 'cancel') {
                return;
            }

            if (!debounceReady()) {
                return;
            }

            // Send Event to do the thing it describes
            if (type === 'use') {
                WebViewEvents.emitServer(INVENTORY_EVENTS.TO_SERVER.USE, type, this.slot);
                return;
            }

            if (type === 'split') {
                WebViewEvents.emitServer(INVENTORY_EVENTS.TO_SERVER.SPLIT, type, this.slot);
                return;
            }

            if (type === 'drop') {
                WebViewEvents.emitServer(INVENTORY_EVENTS.TO_SERVER.DROP, type, this.slot);
                return;
            }

            if (type === 'give') {
                console.log('Opening give event...');
                return;
            }
        },
        unequip(e: Event, slot: number) {
            e.preventDefault();
            if (!this.hasItem('toolbar', slot)) {
                return;
            }

            if (!('alt' in window)) {
                console.log('It should unequip toolbar item @ ' + slot);
                return;
            }

            // Send Event to Server to Unequip
            WebViewEvents.emitServer(INVENTORY_EVENTS.TO_SERVER.UNEQUIP, 'toolbar', slot);
        },
    },
    mounted() {
        if ('alt' in window) {
            WebViewEvents.on(INVENTORY_EVENTS.TO_WEBVIEW.SET_INVENTORY, this.setItems);
            return;
        }

        const exampleItem: Item = {
            name: 'Big Box',
            dbName: 'box',
            quantity: 2,
            slot: 0,
            data: {},
            version: 0,
            weight: 1,
            icon: 'assets/icons/crate.png',
        };

        this.setItems(
            [
                exampleItem,
                { ...exampleItem, slot: 2, icon: 'burger', name: 'Burger' },
                { ...exampleItem, slot: 5, icon: 'burger', quantity: 5, name: 'Burger' },
                { ...exampleItem, slot: 24, icon: 'pistol50', name: 'Pistol .50' },
            ],
            [{ ...exampleItem, icon: 'assaultrifle', name: 'Assault Rifle' }],
        );
    },
    watch: {
        offclick() {
            this.context = undefined;
        },
    },
});
</script>

<style scoped>
.inventory-frame {
    background: rgba(0, 0, 0, 0.75);
    min-width: 512px;
    max-width: 512px;
    box-sizing: border-box;
    border-radius: 6px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
}

.inventory-frame .inventory-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    min-height: 106px;
    max-height: 106px;
}

.inventory-toolbar .slot {
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
}

.inventory-toolbar {
    padding-right: 8px;
}

.inventory-slots {
    display: flex;
    flex-flow: row wrap;
    box-sizing: border-box;
    overflow-y: scroll;
    justify-content: space-evenly;
    max-height: 610px;
    padding-top: 12px;
}

.inventory-slots .slot {
    margin-bottom: 5px;
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
}

.item-outline {
    border: 2px solid rgba(255, 255, 255, 0.5) !important;
}
</style>
