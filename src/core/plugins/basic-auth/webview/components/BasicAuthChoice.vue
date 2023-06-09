<template>
    <div class="stack full-width">
        <div class="btn-group stack">
            <button class="btn-normal mt-1" @click="emit('select-option', 'LOGIN')">Login</button>
            <button class="btn-normal mt-4" @click="emit('select-option', 'REGISTER')">Register</button>
            <button class="btn-normal mt-4" @click="emit('select-option', 'RECOVER')">Recover</button>
            <button class="btn-warning mt-4" @click="quit">Quit</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { AuthEvents } from '@AthenaPlugins/basic-auth/shared/events';
import WebViewEvents from '@utility/webViewEvents';

const emit = defineEmits<{ (e: 'select-option', selection: string): void }>();

function quit() {
    WebViewEvents.emitClient(AuthEvents.toClient.fromWebview.quit);
}
</script>

<style>
.full-width {
    width: 100%;
}
</style>
