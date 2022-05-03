<template>
    <div class="stack fill-full-width">
        <div class="panel pa-4 mb-4">
            <div class="setting-header subtitle-1 mb-2">Temporary</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Vector3 } from '../../../shared/interfaces/vector';
import { FACTION_EVENTS } from '../../core-factions/shared/factionEvents';
import { FACTION_PFUNC } from '../../core-factions/shared/funcNames';
import { Faction } from '../../core-factions/shared/interfaces';

const ComponentName = 'HeadQuarters';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: Object as () => Faction,
        character: String,
        pos: Object as () => Vector3,
        rot: Object as () => Vector3,
        isOwner: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    data() {
        return {};
    },
    methods: {},
    mounted() {},
});
</script>
