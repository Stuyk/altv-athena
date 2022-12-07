<template>
    <div class="character-frame">
        <div class="equipment">
            <Slot
                v-for="(slot, index) in equipmentSlots"
                class="slot"
                location="equipment"
                :key="index"
                :hasItem="true"
                :slot="index"
                :id="getID('equipment', index)"
                @mousedown="(e) => drag(e, { endDrag, canBeDragged: hasItem('equipment', index) })"
                @contextmenu="(e) => unequip(e, index)"
            >
                <template v-slot:image v-if="hasItem('equipment', index)">
                    <img :src="getImagePath(getItem('equipment', index))" />
                </template>
                <template v-slot:index v-else>
                    {{ slot.name }}
                </template>
            </Slot>
        </div>
        <div class="give-to">
            <div class="player">J_T</div>
            <div class="player">D_J</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { EquipmentSlots } from '../../shared/equipment';
import { makeDraggable } from '@ViewUtility/drag';
import { Item } from '@AthenaShared/interfaces/inventory';
import WebViewEvents from '@ViewUtility/webViewEvents';
import { INVENTORY_EVENTS } from '../../shared/events';
import { ClothingComponent } from '@AthenaShared/interfaces/clothing';
import { exampleEquipment } from '../utility/exampleEquipment';
import { getImagePath } from '../utility/inventoryIcon';
import { InventoryTypes } from '../utility/interfaces';

export default defineComponent({
    name: 'Character',
    data() {
        return {
            equipmentSlots: EquipmentSlots,
            equipment: [] as Array<Item<ClothingComponent>>,
        };
    },
    components: {
        Slot: defineAsyncComponent(() => import('./Slot.vue')),
        Icon: defineAsyncComponent(() => import('@ViewComponents/Icon.vue')),
    },
    methods: {
        getImagePath,
        drag: makeDraggable,
        endDrag(startType: InventoryTypes, startIndex: number, endType: InventoryTypes, endIndex: number) {
            if (!('alt' in window)) {
                console.log('ref');
                console.log(startType, startIndex);
                console.log(endType, endIndex);
                return;
            }

            // Call server-side swap / stack
        },
        hasItem(type: 'equipment', slot: number): boolean {
            if (typeof this[type] === undefined) {
                return false;
            }

            const items = [...this[type]] as Array<Item<ClothingComponent>>;
            return items.findIndex((item) => item && item.slot === slot) !== -1;
        },
        getItem(type: 'equipment', slot: number): Item<ClothingComponent> | undefined {
            if (typeof this[type] === undefined) {
                return undefined;
            }

            const items = [...this[type]] as Array<Item<ClothingComponent>>;
            return items[items.findIndex((item) => item && item.slot === slot)];
        },
        getID(type: 'equipment', index: number): string {
            return type + '-' + index;
        },
        unequip(e: Event, slot: number) {
            e.preventDefault();
            if (!this.hasItem('equipment', slot)) {
                return;
            }

            if (!('alt' in window)) {
                console.log('It should unequip equipment item @ ' + slot);
                return;
            }

            // Send Event to Server to Unequip
            WebViewEvents.emitServer(INVENTORY_EVENTS.TO_SERVER.DROP, 'equipment', slot);
        },
        setEquipment(equipment: Array<Item>) {
            this.equipment = equipment;
        },
    },
    mounted() {
        if ('alt' in window) {
            WebViewEvents.on(INVENTORY_EVENTS.TO_WEBVIEW.SET_EQUIPMENT, this.setEquipment);
            return;
        }

        this.setEquipment(exampleEquipment);
    },
});
</script>

<style scoped>
.character-frame {
    background: rgba(0, 0, 0, 0.75);
    min-width: 530px;
    max-width: 530px;
    border-radius: 6px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
}

.character-frame {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.give-to {
    display: flex;
    flex-direction: column;
    min-width: 80px;
    max-width: 80px;
    overflow-y: hidden;
    align-items: center;
    padding: 8px;
    padding-top: 12px;
    box-sizing: border-box;
}

.give-to .player {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 60px;
    max-width: 60px;
    min-height: 60px;
    max-height: 60px;
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    margin-bottom: 8px;
    overflow-x: hidden;
    overflow-y: hidden;
}

.equipment {
    min-width: calc(100% - 80px);
    max-width: calc(100% - 80px);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 12px;
    overflow-y: auto;
    overflow-x: hidden;
    background: url('plugins/images/core-inventory/outline.png');
    position: relative;
}

.equipment .slot {
    min-width: 90px;
    max-width: 90px;
    min-height: 90px;
    max-height: 90px;
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
}

.equipment > div:nth-child(even) {
    margin-left: calc(506px - 60px - 102px * 2);
}
</style>
