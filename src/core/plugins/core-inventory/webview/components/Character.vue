<template>
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
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { EquipmentSlots } from '../../shared/equipment';

export default defineComponent({
    name: 'Character',
    data() {
        return {
            equipmentSlots: EquipmentSlots,
        };
    },
    methods: {},
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
