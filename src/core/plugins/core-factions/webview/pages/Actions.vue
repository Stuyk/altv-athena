<template>
    <div class="actions-wrapper pa-4">
        <Module v-for="(componentName, index) in getActionsComponents()" :name="componentName">
            <component
                :is="componentName"
                class="fade-in"
                :key="index"
                v-bind:faction="faction"
                v-bind:character="character"
                v-bind:money="money"
                v-bind:pos="pos"
                v-bind:rot="rot"
            />
        </Module>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Vector3 } from '../../../../shared/interfaces/vector';
import { Faction } from '../../shared/interfaces';
import { FactionPageInjections } from '../injections';

const ComponentName = 'Actions';
export default defineComponent({
    name: ComponentName,
    props: {
        character: String,
        faction: Object as () => Faction,
        pos: Object as () => Vector3,
        rot: Object as () => Vector3,
        money: Number,
    },
    components: {
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        ...FactionPageInjections.actions,
    },
    methods: {
        getActionsComponents() {
            return Object.keys(FactionPageInjections.actions);
        },
    },
});
</script>

<style scoped>
.actions-wrapper {
    width: 100%;
    min-height: 75vh;
    max-height: 75vh;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
}

:deep() .panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: rgba(48, 48, 48, 1);
    border: 2px solid rgba(28, 28, 28, 1);
    border-radius: 6px;
    box-sizing: border-box;
}

:deep() .actions-button {
    border-radius: 6px;
    min-width: 150px;
}
</style>
