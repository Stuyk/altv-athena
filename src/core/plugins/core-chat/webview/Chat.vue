<template>
    <div class="messages" v-if="display">
        <div class="message" :style="style" v-for="(messageData, index) in getMessages" :key="index">
            <span v-html="colorify(truncate(messageData.msg))"></span>
        </div>
    </div>
</template>

<script lang="ts">
import WebViewEvents from '@utility/webViewEvents';
import { defineComponent } from 'vue';
import { CHAT_CONFIG } from '../shared/config';
import { CHAT_WEBVIEW_EVENTS } from '../shared/events';
import { generateBytes } from './utility/generateBytes';
import { padNumber } from './utility/padNumber';

const PAGE_UP = 33;
const PAGE_DOWN = 34;

const ComponentName = 'Chat';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            index: 0,
            display: true,
            messages: [] as Array<{ timestamp: number; msg: string }>,
            behavior: {
                ...CHAT_CONFIG.behavior,
            },
            style: {
                ...CHAT_CONFIG.style,
            },
        };
    },
    computed: {
        // Scrapes the total messages that can be displayed based on the current index.
        getMessages() {
            const originalMessages = JSON.parse(JSON.stringify([...this.messages]));
            const newMessages = originalMessages.slice(this.index, this.index + this.behavior.display);

            for (let i = 0; i < newMessages.length; i++) {
                if (this.behavior.messageIndexes) {
                    const actualIndex = this.index === 0 ? i : this.index + i;
                    newMessages[i].msg = `[${actualIndex}] ` + newMessages[i].msg;
                }

                if (this.behavior.timestamps) {
                    const time = new Date(newMessages[i].timestamp);
                    const hour = padNumber(time.getHours());
                    const minute = padNumber(time.getMinutes());
                    const second = padNumber(time.getSeconds());
                    const timestampText = `[${hour}:${minute}:${second}]`;
                    newMessages[i].msg = timestampText + ' ' + newMessages[i].msg;
                }
            }

            return newMessages.reverse();
        },
    },
    methods: {
        async updateMessageRendering() {
            this.display = false;

            await this.$nextTick();

            this.display = true;
        },
        setMessages(messages: Array<{ timestamp: number; msg: string }>) {
            this.messages = messages;

            if (this.behavior.scroll) {
                this.index = 0;
            }

            this.updateMessageRendering();
        },
        truncate(message: string) {
            if (message.length > this.behavior.length) {
                return message.slice(0, this.behavior.length) + '...';
            }

            return message;
        },
        colorify(text: string | null) {
            let matches = [];
            let m = null;
            let curPos = 0;
            if (!text) {
                return null;
            }
            do {
                m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substring(curPos));
                if (!m) {
                    break;
                }
                matches.push({
                    found: m[0],
                    index: m['index'] + curPos,
                });
                curPos = curPos + m['index'] + m[0].length;
            } while (m != null);

            if (matches.length > 0) {
                text += '</font>';
                for (let i = matches.length - 1; i >= 0; --i) {
                    let color = matches[i].found.substring(1, matches[i].found.length - 1);
                    let insertHtml = `${i !== 0 ? '</font>' : ''}<font color="#${color}">`;
                    text = `${text.slice(0, matches[i].index)}${insertHtml}${text.slice(
                        matches[i].index + matches[i].found.length,
                        text.length,
                    )}`;
                }
            }
            return text;
        },
        pageUp() {
            let newIndex = this.index + this.behavior.display;
            if (newIndex > this.messages.length - 1) {
                newIndex = this.messages.length - 1;
            }

            this.index = newIndex;
            this.updateMessageRendering();
        },
        pageDown() {
            let newIndex = this.index - this.behavior.display;
            if (newIndex < 0) {
                newIndex = 0;
            }

            this.index = newIndex;
            this.updateMessageRendering();
        },
        handleKeyCode(keyCode: number) {
            if (keyCode === PAGE_UP) {
                this.pageUp();
            }

            if (keyCode === PAGE_DOWN) {
                this.pageDown();
            }
        },
        debug() {
            // Generates dummy messages, and gives them random colors.
            const messages = [];
            for (let i = 0; i < 128; i++) {
                const color = Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, '0');

                messages.push({ timestamp: Date.now(), msg: `{${color}}${generateBytes(255)}` });
            }

            this.setMessages(messages);

            // Create temporary key bindings for document
            document.addEventListener('keyup', (ev: KeyboardEvent) => {
                if (ev.key === 'PageUp') {
                    this.pageUp();
                }

                if (ev.key === 'PageDown') {
                    this.pageDown();
                }
            });

            setInterval(() => {
                const copyOfMessages = [...this.messages];
                copyOfMessages.unshift({ timestamp: Date.now(), msg: `a new message has arrived :)` });
                this.setMessages(copyOfMessages);
            }, 5000);
        },
    },
    mounted() {
        if ('alt' in window) {
            WebViewEvents.on(CHAT_WEBVIEW_EVENTS.SET_MESSAGES, this.setMessages);
            WebViewEvents.on(CHAT_WEBVIEW_EVENTS.PASS_KEY_PRESS, this.handleKeyCode);
            WebViewEvents.emitReady(ComponentName);
        } else {
            this.debug();
        }
    },
});
</script>

<style scoped>
.messages {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 20px;
    top: 60px;
}

.message {
    opacity: 0.95;
    font-weight: 600;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
    margin-bottom: 12px;
    word-wrap: break-word;
    word-break: break-all;
    line-height: 14pt;
    text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.85), 0 1px 1px rgba(0, 0, 0, 0.85), -1px 0px 1px rgba(0, 0, 0, 0.85),
        1px 0px 1px rgba(0, 0, 0, 0.85);
}
</style>
