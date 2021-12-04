<template>
    <div class="message pt-2 pb-2 pl-2 pr-4 mt-1" :style="getStyle" :class="getClass">
        <span v-if="useTimestamps">{{ timestamp }}</span> <span v-html="getMessage"></span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const ComponentName = 'Message';
export default defineComponent({
    name: ComponentName,
    props: {
        message: {
            type: String,
            required: true,
        },
        timestamp: {
            type: String,
            required: false,
        },
        useTimestamps: {
            type: Boolean,
            required: false,
            default: false,
        },
        msgSize: {
            type: Number,
            default: 128,
        },
        fontSize: {
            type: String,
            default: 14,
        },
        fade: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        getMessage() {
            if (!this.message) {
                return '&nbsp;';
            }

            if (this.message.length <= this.msgSize) {
                return this.colorify(this.message);
            }

            return this.colorify(`${this.message.slice(0, 128)}...`);
        },
        getStyle() {
            let style = '';

            style += `font-size: ${this.fontSize};`;

            return style;
        },
        getClass() {
            if (this.fade) {
                return { 'message-fade': true };
            }

            return {};
        },
    },
    methods: {
        colorify(text: string | null) {
            let matches = [];
            let m = null;
            let curPos = 0;

            if (!text) {
                return null;
            }

            do {
                m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substr(curPos));

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
    },
});
</script>

<style scoped>
.message {
    display: block;
    color: white;
    user-select: none;
    font-family: 'Roboto';
    font-weight: 500;
    overflow-wrap: break-word;
    text-align: left;
    text-shadow: 1px 1px black;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    letter-spacing: 0.05em;
    text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000,
        -1px 1px 0 #000, -1px 0 0 #000;
    -webkit-font-smoothing: antialiased;
}

.message-fade {
    opacity: 0;
    animation: longFade 20s;
}

@keyframes longFade {
    0% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>
