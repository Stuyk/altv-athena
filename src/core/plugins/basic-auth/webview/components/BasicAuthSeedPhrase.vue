<template>
    <div class="stack full-width">
        <h3 class="no-top">Seed Phrase</h3>
        <p class="justify pb-4">
            Write down this phrase to recover your account. Skipping this may result in your account being lost.
        </p>
        <div class="seed-group">
            <span v-for="(word, index) in props.seedphrase.split(' ')">{{ `${index + 1}. ${word}` }}</span>
        </div>
        <div class="btn-group split space-between">
            <button class="btn-normal full-width" @click="submit">Okay, I stored it somewhere safe.</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { AuthEvents } from '@AthenaPlugins/basic-auth/shared/events';
import WebViewEvents from '@utility/webViewEvents';
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{ seedphrase: string }>();

function submit() {
    WebViewEvents.emitServer(AuthEvents.toServer.finishLogin);
}
</script>

<style scoped>
.full-width {
    width: 100%;
}

.seed-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 24px;
    max-height: 200px;
    overflow-y: scroll;
    margin-bottom: 24px;
    background: var(--auth-bg-light);
    border-radius: 6px;
    padding-top: 24px;
    padding-bottom: 24px;
}

.seed-group span {
    background: var(--auth-bg-lighter);
    padding: 12px;
    font-size: 12px;
    min-width: 100px;
    filter: blur(3px);
    border-radius: 6px;
}

.seed-group span:hover {
    filter: unset !important;
}

.justify {
    text-align: justify;
    padding-top: 0px;
    margin-top: 0px;
    font-size: 12px;
}
</style>
