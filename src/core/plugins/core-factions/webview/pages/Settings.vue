<template>
    <div class="settings-wrapper pa-4">
        <Module name="Head Quarters">
            <HeadQuarters
                v-bind:faction="faction"
                v-bind:character="character"
                v-bind:is-owner="isOwner"
                v-bind:pos="pos"
                v-bind:rot="rot"
            />
        </Module>
        <br />
        <Module name="Parking">
            <Parking
                v-bind:faction="faction"
                v-bind:character="character"
                v-bind:is-owner="isOwner"
                v-bind:pos="pos"
                v-bind:rot="rot"
            />
        </Module>
        <br />
        <Module v-for="(componentName, index) in getSettingsComponents()" :name="componentName">
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
import { FactionParser } from '../utility/factionParser';

const ComponentName = 'Settings';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
        HeadQuarters: defineAsyncComponent(() => import('./settings/HeadQuarters.vue')),
        Parking: defineAsyncComponent(() => import('./settings/Parking.vue')),
        ...FactionPageInjections.settings,
    },
    props: {
        character: String,
        faction: Object as () => Faction,
        pos: Object as () => Vector3,
        rot: Object as () => Vector3,
        money: Number,
    },
    data() {
        return {
            isOwner: false,
        };
    },
    methods: {
        getSettingsComponents() {
            return Object.keys(FactionPageInjections.settings);
        },
        hasOwnership() {
            const member = FactionParser.getMember(this.faction, this.character);
            if (!member) {
                return false;
            }

            return member.hasOwnership;
        },
    },
    mounted() {
        this.isOwner = this.hasOwnership();
    },
    watch: {
        faction() {
            this.isOwner = this.hasOwnership();
        },
    },
});
</script>

<style scoped>
.settings-wrapper {
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

:deep() .settings-button {
    border-radius: 6px;
    min-width: 150px;
}

:deep() .setting-header {
    font-size: 16px;
    border-bottom: 2px solid rgba(36, 36, 36, 1);
}

:deep() input {
    align-self: center;
    font-family: 'Roboto', sans-serif;
    background: rgba(12, 12, 12, 1);
    border: 2px solid rgba(36, 36, 36, 1);
    padding: 6px;
    box-sizing: border-box;
    color: white;
}

:deep() input:focus {
    border-color: rgba(52, 52, 52, 1);
}

:deep() .label {
    min-width: 125px !important;
}
</style>
