<template>
    <div class="stat-wrapper">
        <Icon :shadow="true" class="green--text text--accent-3 mr-1" icon="icon-dollar" :size="24" />
        <span class="cash green--text text--accent-3">{{ value.toLocaleString() }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@components/Icon.vue';

const ComponentName = 'Cash';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon,
    },
    props: {
        value: {
            type: Number,
            default: 199,
        },
    },
});
</script>

<style scoped>
.stat-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
    position: relative;
}

.cash {
    font-family: 'Roboto';
    font-size: 26px;
    font-weight: 600;
    text-shadow: 1px 1px black;
}
</style>
