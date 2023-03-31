<template>
    <div class="stack increased-size">
        <div class="item">Are you sure?</div>
        <div class="split item-splitter">
            <div @mouseover="hover" @click="$emit('yes-delete')" class="yes item">Yes</div>
            <div @mouseover="hover" @click="$emit('no-delete')" class="no item">No</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import WebViewEvents from '@utility/webViewEvents';

function hover() {
    WebViewEvents.playSoundFrontend('HIGHLIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
}
</script>

<style scoped>
.stack {
    opacity: 0.7;
}

.split {
    display: flex;
    justify-content: space-between;
}

.item-splitter {
    min-width: 200px;
    max-width: 200px;
    margin-top: 32px;
}

.yes {
    color: lime;
    font-size: 28px !important;
}

.yes:hover,
.no:hover {
    opacity: 0.5;
    transform: scale(0.98);
    cursor: pointer;
}

.no {
    color: red;
    font-size: 28px !important;
}
</style>
