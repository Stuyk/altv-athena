<template>
    <div class="main-frame">
        <div class="character-frame">
            <div class="equipment">
                <div class="slot" v-for="(slot, index) in equipmentSlots">
                    {{ slot.name }}
                </div>
            </div>
            <div class="give-to">
                <div class="player">J_T</div>
                <div class="player">D_J</div>
            </div>
        </div>
        <div class="spacer" />
        <div class="inventory-frame">
            <div class="inventory-toolbar">
                <div class="slot">1</div>
                <div class="slot">2</div>
                <div class="slot">3</div>
                <div class="slot">4</div>
            </div>
            <div class="inventory-description">
                <span class="item-name">Stupid Hat</span>
                <span class="item-description">It's a big stupid hat.</span>
            </div>
            <div class="inventory-slots">
                <div class="slot" v-for="(slot, index) in 27">
                    <span>{{ index }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { EquipmentSlots } from '../shared/equipment';

export const ComponentName = 'Inventory2';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    data() {
        return {
            equipmentSlots: EquipmentSlots,
        };
    },
    methods: {
        //
    },
    mounted() {
        //
    },
    unmounted() {
        //
    },
});
</script>

<style scoped>
.main-frame {
    display: flex;
    flex-direction: row;
    min-width: 1280px;
    max-width: 1280px;
    min-height: 720px;
    max-height: 720px;
    justify-content: space-between;
}

.character-frame {
    background: #cbcbcb;
    min-width: 506px;
    max-width: 506px;
}

.inventory-frame {
    background: #cbcbcb;
    min-width: 550px;
    max-width: 550px;
}

.inventory-frame .inventory-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    background: #a2a2a2;
    min-height: 130px;
    max-height: 130px;
}

.inventory-toolbar .slot {
    background: #cbcbcb;
}

.slot {
    display: flex;
    min-width: 90px;
    max-width: 90px;
    min-height: 90px;
    max-height: 90px;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border: 4px solid rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: bold;
    letter-spacing: 1px;
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
    min-height: 530px;
    max-height: 530px;
    justify-content: space-evenly;
}

.inventory-slots .slot {
    background: #a2a2a2;
    margin-bottom: 12px;
    margin-right: 5px;
    margin-left: 5px;
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
}

.equipment .slot {
    min-width: 90px;
    max-width: 90px;
    min-height: 90px;
    max-height: 90px;
    background: #a2a2a2;
}

.equipment :nth-child(even) {
    margin-left: calc(506px - 60px - 102px * 2);
}
</style>
