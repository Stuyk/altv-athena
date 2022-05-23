<template>
    <div class="wrapper pl-2">
        <span class="subtitle-1 name">{{ getName }}</span>
        <span class="subtitle-2 motd">{{ getMotd }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import { Faction } from '../../shared/interfaces';

const ComponentName = 'Header';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: Object as () => Faction,
    },
    components: {
        Button,
        Icon,
    },
    computed: {
        getName() {
            return this.faction.name;
        },
        getMotd() {
            if (!this.faction.motd) {
                return `Message of the day has not been set by faction owner.`;
            }

            return this.faction.motd;
        },
    },
    methods: {},
});
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-items: center;
    align-content: center;
    justify-content: center;
    overflow: hidden;
    min-height: 75px;
    max-height: 75px;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border-bottom: 2px solid rgba(23, 23, 23, 1);
}

.motd {
    font-size: 12px !important;
}
</style>
