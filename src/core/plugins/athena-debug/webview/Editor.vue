<template>
    <div class="container-editor">
        <div class="tabs">
            <div class="left">
                <div class="tab" @click="select('server')" :class="selected === 'server' ? { isSelected: true } : {}">
                    Server
                </div>
                <div class="tab" @click="select('client')" :class="selected === 'client' ? { isSelected: true } : {}">
                    Client
                </div>
            </div>
            <div class="right">
                <div class="tab" @click="close">Close</div>
            </div>
        </div>
        <div class="monaco-container">
            <div class="monaco" @keyup="update" id="monaco" ref="editor"></div>
        </div>
        <div class="tabs">
            <div class="right">
                <div class="tab" @click="execute('server')">Exec Server</div>
                <div class="tab" @click="execute('client')">Exec Client</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { AthenaTypeDef } from './typedefs';
import WebViewEvents from '@utility/webViewEvents';
import * as monaco from 'monaco-editor';
import * as state from '@ViewUtility/state';
import { ATHENA_DEBUG_EVENTS } from '../shared/events';

const serverKey = 'editorServer';
const clientKey = 'editorClient';

const defaultServerCode =
    `import * as alt from 'alt-server'; // Do Not Remove` +
    `\r\nimport * as Athena from 'src/core/server/api/index';  // Do Not Remove` +
    `\r\n// Reminder that this is JavaScript, do not write TypeScript`;

const defaultClientCode =
    `import * as alt from 'alt-client'; // Do Not Remove` +
    `\r\nimport * as native from 'natives'; // Do Not Remove` +
    `\r\nimport * as AthenaClient from 'src/core/client/api/index'; // Do Not Remove` +
    `\r\n// Reminder that this is JavaScript, do not write TypeScript`;

let serverCode = ref(defaultServerCode);
let clientCode = ref(defaultClientCode);

let selected = ref('server');
let editor = ref(null);

function select(value) {
    selected.value = value;
    updateTab();
}

function update() {
    const result = window.editor.getValue();
    const stateKey = selected.value === 'server' ? serverKey : clientKey;

    if (selected.value === 'server') {
        serverCode.value = result;
    } else {
        clientCode.value = result;
    }

    state.set(stateKey, result);
}

function updateTab() {
    const dataKey = selected.value === 'server' ? serverKey : clientKey;
    let data = state.get(dataKey);
    if (typeof data === 'undefined') {
        state.set(serverKey, defaultServerCode);
        state.set(clientKey, defaultClientCode);
        data = state.get(dataKey);
    }

    window.editor.setValue(data);
}

function execute(type) {
    const code = type === 'server' ? serverCode.value : clientCode.value;
    const codeSplit = code.split('\n');
    const amountToShift = type === 'server' ? 3 : 4;

    for (let i = 0; i < amountToShift; i++) {
        codeSplit.shift();
    }

    const codeToExecute = codeSplit.join('\n');
    WebViewEvents.emitServer(ATHENA_DEBUG_EVENTS.toServer.exec, type, codeToExecute);
}

function close() {
    WebViewEvents.emitClient(ATHENA_DEBUG_EVENTS.toClient.closePage);
}

async function injectTypeDefs(file, name) {
    const result = await fetch(file).catch((err) => {
        return undefined;
    });

    if (!result || !result.ok) {
        return;
    }

    const data = await result.text();
    monaco.languages.typescript.typescriptDefaults.addExtraLib(data, name);
}

onMounted(async () => {
    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if (editor.value === null) {
                return;
            }

            clearInterval(interval);
            resolve();
        });
    });

    await injectTypeDefs('https://raw.githubusercontent.com/altmp/altv-types/master/shared/index.d.ts', 'alt-shared');
    await injectTypeDefs('https://raw.githubusercontent.com/altmp/altv-types/master/server/index.d.ts', 'alt-server');
    await injectTypeDefs('https://raw.githubusercontent.com/altmp/altv-types/master/client/index.d.ts', 'alt-client');
    await injectTypeDefs('https://raw.githubusercontent.com/altmp/altv-types/master/natives/index.d.ts', 'natives');

    monaco.languages.typescript.typescriptDefaults.addExtraLib(AthenaTypeDef, 'athena');
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2016,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    });

    window.editor = monaco.editor.create(editor.value, {
        value: '',
        language: 'typescript',
        theme: 'vs-dark',
        minimap: {
            enabled: false,
        },
        automaticLayout: true,
    });

    updateTab();
});
</script>

<style scoped>
.container-editor {
    width: 800px;
    height: 600px;
    display: flex;
    flex-direction: column;
}

.hidden {
    display: none;
    visibility: hidden;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding-top: 12px;
    overflow-x: hidden;
}

.tabs {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}

.format-text {
    width: calc(100vw - 48px);
    user-select: none;
}

.format-text p {
    margin-bottom: 12px;
    text-align: left;
}

.isSelected {
    background-color: rgba(0, 0, 0, 0.2) !important;
}

.left {
    display: flex;
    flex-direction: row;
}

.right {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: flex-end;
}

.tab {
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    min-width: 100px;
    text-align: center;
    user-select: none !important;
    background: rgba(0, 0, 0, 0.5);
}

.tab:hover {
    cursor: pointer;
    opacity: 0.5;
}

.monaco {
    height: calc(600px - 48px);
    opacity: 0.75;
}

.monaco-container {
    background: rgba(0, 0, 0, 0.5);
}
</style>
