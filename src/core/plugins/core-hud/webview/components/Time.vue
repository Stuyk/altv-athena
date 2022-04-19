<template>
    <div class="stat-wrapper">
        <span class="time">{{ value.toLocaleString() }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const ComponentName = 'Time';
export default defineComponent({
    name: ComponentName,
    props: {
        value: {
            type: String,
            default: '0:00 PM',
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

.time {
    font-family: 'Roboto';
    font-size: 14px;
    font-weight: 500;
    text-shadow: 1px 1px black;
}
</style>
