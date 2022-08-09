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
                @mousedown="(e) => drag(e, dragOff, hasItem('toolbar', index))"
                @contextmenu="(e) => unequip(e, index)"
            >
                <template v-slot:image v-if="hasItem('toolbar', index)">
                    <img :src="ResolvePath(getItem('toolbar', index).icon)" />
                </template>
                <template v-slot:index v-else>
                    {{ slot }}
                </template>
            </Slot>
        </div>
        <div class="inventory-description">
            <span class="item-name">Stupid Hat</span>
            <span class="item-description">It's a big stupid hat.</span>
        </div>
        <div class="inventory-slots">
            <Slot
                v-for="(slot, index) in maxSlots"
                class="slot"
                location="inventory"
                :key="index"
                :hasItem="true"
                :slot="index"
                :id="getID('inventory', index)"
                @contextmenu="(e) => contextMenu(e, index)"
                @mousedown="(e) => drag(e, dragOff, hasItem('inventory', index))"
            >
                <template v-slot:image v-if="hasItem('inventory', index)">
                    <img :src="ResolvePath(getItem('inventory', index).icon)" />
                </template>
                <template v-slot:index v-else>
                    {{ index }}
                </template>
            </Slot>
        </div>
        <Context :contextTitle="title" :x="context.x" :y="context.y" v-if="context">
            <div @click="contextAction('use')">Use</div>
            <div @click="contextAction('split')">Split</div>
            <div @click="contextAction('drop')">Drop</div>
        </Context>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Item } from '../../../../shared/interfaces/inventory';
import ResolvePath from '../../../../../../src-webviews/src/utility/pathResolver';
import draggable from '../../../../../../src-webviews/src/utility/drag';

export default defineComponent({
    name: 'Inventory',
    components: {
        Slot: defineAsyncComponent(() => import('./Slot.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Context: defineAsyncComponent(() => import('@components/Context.vue')),
    },
    data() {
        return {
            toolbar: [] as Array<Item>,
            inventory: [] as Array<Item>,
            maxSlots: 28,
            maxToolbarSlots: 4,
            title: '',
            context: undefined as { x: number; y: number } | undefined,
            slot: -1,
        };
    },
    methods: {
        ResolvePath,
        drag: draggable.makeDraggable,
        dragOff(
            startType: 'inventory' | 'toolbar' | 'equipment',
            startIndex: number,
            endType: 'inventory' | 'toolbar' | 'equipment',
            endIndex: number,
        ) {
            if (!('alt' in window)) {
                console.log('ref');
                console.log(startType, startIndex);
                console.log(endType, endIndex);
                return;
            }

            // Call server-side swap / stack
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
        getItem(type: 'toolbar' | 'inventory', slot: number): Item | undefined {
            if (typeof this[type] === undefined) {
                return undefined;
            }

            const items = [...this[type]] as Array<Item>;
            return items[items.findIndex((item) => item && item.slot === slot)];
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
        contextAction(type: 'use' | 'split' | 'drop') {
            this.context = undefined;

            if (!('alt' in window)) {
                console.log(`It should do ${type} on slot: ` + this.slot);
                return;
            }

            // Send Event to do the thing it describes
        },
        unequip(e: Event, slot: number) {
            e.preventDefault();
            if (!this.hasItem('toolbar', slot)) {
                return;
            }

            if (!('alt' in window)) {
                console.log('It should unequip: ' + slot);
                return;
            }

            // Send Event to Server to Unequip
        },
    },
    mounted() {
        if ('alt' in window) {
            // go fetch
            // inventory
            // toolbar
            return;
        }

        const exampleItem: Item = {
            name: 'Big Box',
            base: 'box',
            flags: 0,
            quantity: 2,
            slot: 0,
            data: {},
            version: 0,
            weight: 1,
            icon: 'assets/icons/crate.png',
        };

        this.setItems([exampleItem, { ...exampleItem, slot: 24 }], [exampleItem]);
    },
});
</script>

<style scoped>
.inventory-frame {
    background: #cbcbcb;
    min-width: 430px;
    max-width: 430px;
}

.inventory-frame .inventory-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    background: #a2a2a2;
    min-height: 106px;
    max-height: 106px;
}

.inventory-toolbar .slot {
    background: #cbcbcb;
}

.inventory-description {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 60px;
    max-height: 60px;
    background: #7b7b7b;
    font-size: 12px;
}

.inventory-slots {
    display: flex;
    flex-flow: row wrap;
    padding-top: 8px;
    box-sizing: border-box;
    overflow-y: scroll;
    min-height: 554px;
    max-height: 554px;
    justify-content: space-evenly;
}

.inventory-slots .slot {
    background: #a2a2a2;
    margin-bottom: 12px;
    margin-right: 5px;
    margin-left: 5px;
}
</style>
