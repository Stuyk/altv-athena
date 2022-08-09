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
                @mousedown="(e) => drag(e, dragOff, hasItem('equipment', index))"
            >
                <template v-slot:image v-if="hasItem('equipment', index)">
                    <img :src="ResolvePath(getItem('equipment', index).icon)" />
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
import ResolvePath from '../../../../../../src-webviews/src/utility/pathResolver';
import draggable from '../../../../../../src-webviews/src/utility/drag';
import { Item } from '../../../../shared/interfaces/inventory';

export default defineComponent({
    name: 'Character',
    data() {
        return {
            equipmentSlots: EquipmentSlots,
            equipment: [] as Array<Item>,
        };
    },
    components: {
        Slot: defineAsyncComponent(() => import('./Slot.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
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
        hasItem(type: 'equipment', slot: number): boolean {
            if (typeof this[type] === undefined) {
                return false;
            }

            const items = [...this[type]] as Array<Item>;
            return items.findIndex((item) => item && item.slot === slot) !== -1;
        },
        getItem(type: 'equipment', slot: number): Item | undefined {
            if (typeof this[type] === undefined) {
                return undefined;
            }

            const items = [...this[type]] as Array<Item>;
            return items[items.findIndex((item) => item && item.slot === slot)];
        },
        getID(type: 'equipment', index: number): string {
            return type + '-' + index;
        },
    },
    mounted() {},
    unmounted() {},
});
</script>

<style scoped>
.character-frame {
    background: #cbcbcb;
    min-width: 506px;
    max-width: 506px;
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
    background: #a2a2a2;
    overflow-y: hidden;
    align-items: center;
    padding: 8px;
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
    background: #7b7b7b;
    margin-bottom: 8px;
    overflow-x: hidden;
    overflow-y: hidden;
}

.equipment {
    min-width: calc(100% - 60px);
    max-width: calc(100% - 60px);
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
    background: #a2a2a2;
    position: relative;
}

.equipment > div:nth-child(even) {
    margin-left: calc(506px - 60px - 102px * 2);
}
</style>
