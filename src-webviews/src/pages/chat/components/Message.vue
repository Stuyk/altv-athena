<template>
    <div class="message" :class="getClass">
        <span v-html="getMessage"></span>
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
        useTimestamps: {
            type: Boolean,
            required: false,
            default: false,
        },
        msgSize: {
            type: Number,
            default: 128,
        },
        fade: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        getMessage() {
            return this.colorify(this.message);

            if (!this.message) {
                return '&nbsp;';
            }

            return this.message;

            if (this.message.length <= this.msgSize && this.message.length <= this.splitLength) {
                return this.colorify(this.message);
            }

            let a = this.message.slice(0, this.splitLength);
            let b = '<br />';
            let c = this.message.slice(
                this.splitLength + 1,
                this.message.length > this.msgSize ? this.msgSize : this.message.length,
            );

            return this.colorify(`${a}${b}${c}`);
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
    text-shadow: 1px 1px black;
    direction: ltr;
    user-select: none;
    font-family: 'Arial';
    font-size: 14px;
    font-weight: 600;
    overflow-wrap: break-word;
    overflow: visible;
    text-align: left;
    width: 100%;
    margin-bottom: 14px;
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
