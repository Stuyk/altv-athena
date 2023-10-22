<template>
    <div class="basicauth-login">
        <div class="align-center mb-8">
            <img src="/assets/images/athena.png" width="150" />
        </div>
        <p class="error" v-if="errorMessage">Error: {{ errorMessage }}</p>
        <component :is="Components[step]" :seedphrase="seedPhrase" @select-option="selectOption" />
    </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, onMounted } from 'vue';
import WebViewEvents from '@utility/webViewEvents.js';
import { AuthEvents } from '../shared/events.js';

// Never actually use this, it's just an example pulled from NPM.
const ExampleSeedPhrase =
    'apology paper violin fruit tobacco oil gym west skate club empower fatigue scatter cup slight tobacco rookie output castle load tennis glimpse pumpkin reject';

const Components = {
    CHOICE: defineAsyncComponent(() => import('./components/BasicAuthChoice.vue')),
    LOGIN: defineAsyncComponent(() => import('./components/BasicAuthLogin.vue')),
    REGISTER: defineAsyncComponent(() => import('./components/BasicAuthRegister.vue')),
    RECOVER: defineAsyncComponent(() => import('./components/BasicAuthRecover.vue')),
    RECOVERY_PHRASE: defineAsyncComponent(() => import('./components/BasicAuthSeedPhrase.vue')),
};

let step = ref<keyof typeof Components>('LOGIN');
let seedPhrase = ref<string>(ExampleSeedPhrase);
let errorMessage = ref<string | undefined>(undefined);

function selectOption(option: keyof typeof Components) {
    step.value = option;
}

function showSeedPhrase(newSeedPhrase: string) {
    console.log(newSeedPhrase);
    // Just for debugging quickly.

    step.value = 'RECOVERY_PHRASE';
    seedPhrase.value = newSeedPhrase;
}

function showErrorMessage(newErrorMessage: string) {
    errorMessage.value = newErrorMessage;
}

onMounted(() => {
    WebViewEvents.on(AuthEvents.toWebview.showSeedPhrase, showSeedPhrase);
    WebViewEvents.on(AuthEvents.toWebview.showErrorMessage, showErrorMessage);
});
</script>

<style>
:root {
    --auth-bg: #272a37;
    --auth-bg-light: #323644;
    --auth-bg-lighter: #414658;
    --auth-bg-brand: #63b9f2;
    --auth-bg-brand-warning: #f2af63;
}

.basicauth-login .align-center {
    display: flex;
    justify-content: center;
}

.basicauth-login {
    display: flex;
    flex-direction: column;
    min-width: 400px;
    max-width: 400px;
    background: var(--auth-bg);
    color: white;
    padding: 36px;
    border-radius: 6px;
    box-sizing: border-box;
    font-family: 'Inter' !important;
}

.basicauth-login .error {
    color: var(--auth-bg-brand-warning);
}

.basicauth-login input {
    background: transparent;
    border: 0px;
    color: white;
    border-radius: 6px;
    box-sizing: border-box;
}

.basicauth-login .error-group {
    min-height: 25px;
    max-height: 25px;
}

.basicauth-login .input-group {
    display: flex;
    flex-direction: column;
    background: var(--auth-bg-light);
    padding: 6px;
    border-radius: 6px;
    border: 2px solid transparent;
}

.basicauth-login .input-group label {
    font-size: 12px;
    font-family: 'Inter';
    opacity: 0.5;
}

.basicauth-login .input-group input {
    font-family: 'Inter';
    font-size: 16px;
}

.basicauth-login .input-group:focus-within {
    border: 2px solid var(--auth-bg-brand);
}

.basicauth-login .errorMessage {
    text-align: center;
    font-size: 14px;
    color: var(--auth-bg-brand-warning);
    font-weight: 600;
}

.basicauth-login .btn-group .btn-disabled {
    background: var(--auth-bg-light);
    border: 0px;
    color: rgba(255, 255, 255, 0.2);
    font-family: 'Inter';
    padding: 12px;
    border-radius: 6px;
    min-width: 150px;
    font-weight: 500;
    font-size: 14px;
}

.basicauth-login .btn-group .btn-normal {
    background: var(--auth-bg-light);
    border: 0px;
    color: var(--auth-bg-brand);
    font-family: 'Inter';
    padding: 12px;
    border-radius: 6px;
    min-width: 150px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.05s;
}

.basicauth-login .btn-group .btn-warning {
    background: var(--auth-bg-light);
    border: 0px;
    color: var(--auth-bg-brand-warning);
    font-family: 'Inter';
    padding: 12px;
    border-radius: 6px;
    min-width: 150px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.05s;
}

.basicauth-login .btn-group .btn-normal:hover,
.basicauth-login .btn-group .btn-warning:hover {
    background: var(--auth-bg-lighter);
}

.basicauth-login .btn-group .btn-normal:active,
.basicauth-login .btn-group .btn-warning:active {
    transform: scale(0.98);
}

.basicauth-login .no-top {
    padding-top: 0px;
    margin-top: 0px;
}
</style>
