const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
const tagOrComment = new RegExp(
    '<(?:' +
        // Comment body.
        '!--(?:(?:-*[^->])*--+|-?)' +
        // Special "raw text" elements whose content should be elided.
        '|script\\b' +
        tagBody +
        '>[\\s\\S]*?</script\\s*' +
        '|style\\b' +
        tagBody +
        '>[\\s\\S]*?</style\\s*' +
        // Regular name
        '|/?[a-z]' +
        tagBody +
        ')>',
    'gi'
);

const messages = [];
let commands = [
    { name: 'timestamp', description: '/timestamp - Toggles timestamps.' },
    { name: 'help', description: '/help - List all available commands for your permission level.' }
];

const chat = Vue.component('chat', {
    data() {
        return {
            previous: [' ', 'alt:V Athena Chat', 'By Stuyk'],
            currentMessage: '',
            chatActive: false,
            position: 0,
            timestamp: false,
            matchedCommand: null,
            show: false,
            updateCount: 0
        };
    },
    methods: {
        appendMessage(msg) {
            const currentTime = Date.now();
            const date = new Date(currentTime);
            messages.push({
                message: msg,
                time: `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
            });

            // Log Messages to Console
            if ('alt' in window) {
                console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${msg}`);
            }

            if (messages.length >= 50) {
                messages.shift();
            }

            this.updateCount += 1;

            if (!this.chatActive) {
                this.$nextTick(() => {
                    if (!this.$refs || !this.$refs.messages) {
                        return;
                    }

                    this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
                });
            }
        },
        trimDescription(description) {
            if (description.length <= 55) {
                return description;
            }

            return `${description.substr(0, 55)}...`;
        },
        focusChat() {
            this.chatActive = true;
        },
        handleEscape() {
            this.chatActive = false;
            this.position = 0;
            this.currentMessage = '';

            if ('alt' in window) {
                alt.emit('chat:Send');
            }
        },
        prevMessage() {
            if (this.position + 1 > this.previous.length - 1) {
                return;
            }

            this.position += 1;
            this.currentMessage = this.previous[this.position];
        },
        nextMessage() {
            if (this.position - 1 < 0) {
                return;
            }

            this.position -= 1;
            this.currentMessage = this.previous[this.position];
        },
        handleSend(e) {
            const message = e.target.value;
            this.chatActive = false;
            this.position = 0;
            this.currentMessage = '';

            // Handle No Message
            if (!message || message === '') {
                if ('alt' in window) {
                    alt.emit('chat:Send');
                }
                return;
            }

            if (message === '/timestamp') {
                this.timestamp = !this.timestamp;
                this.appendMessage(`You have toggled timestamps.`);

                if ('alt' in window) {
                    alt.emit('chat:Send');
                }
                return;
            }

            if (message === '/help' || message === '/commands') {
                for (let i = 0; i < commands.length; i++) {
                    this.appendMessage(`${commands[i].description}`);
                }

                if ('alt' in window) {
                    alt.emit('chat:Send');
                }
                return;
            }

            // Appends message to front of array.
            if (!this.previous.includes(message)) {
                this.previous = this.previous.filter((x) => x !== '');
                this.previous.unshift(message);
                this.previous.unshift('');
            }

            // Handle Send Message
            if ('alt' in window) {
                alt.emit('chat:Send', message);
            }
        },
        handleTyping(e) {
            if (!this.currentMessage.includes('/')) {
                this.matchedCommand = null;
                return;
            }

            this.currentMessage = this.currentMessage.replace(tagOrComment, '').replace('/</g', '&lt;');

            if (this.currentMessage === '' || this.currentMessage.length <= 2) {
                this.matchedCommand = null;
                return;
            }

            const index = commands.findIndex((x) => x && x.description && x.description.includes(this.currentMessage));

            if (index <= -1) {
                this.matchedCommand = null;
                return;
            }

            if (this.matchedCommand !== null && this.currentMessage.replace('/', '') === commands[index].name) {
                this.matchedCommand = `/${commands[index].name}`;
                return;
            }

            this.matchedName = commands[index].name;
            this.matchedCommand = this.trimDescription(commands[index].description);
        },
        useCommand() {
            if (this.matchedCommand && this.matchedName) {
                this.currentMessage = `/${this.matchedName}`;
            }
        },
        populateCommands(serverCommands) {
            if (!Array.isArray(serverCommands)) {
                return;
            }

            commands = commands.concat(serverCommands);
            this.updateCount += 1;
        }
    },
    directives: {
        focus: {
            inserted: (el) => {
                el.focus();
            }
        }
    },
    watch: {
        currentMessage: (newValue) => {
            this.currentMessage = newValue;
        }
    },
    filters: {
        colorify(text) {
            let matches = [];
            let m = null;
            let curPos = 0;

            if (!text) {
                return;
            }

            do {
                m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substr(curPos));

                if (!m) {
                    break;
                }

                matches.push({
                    found: m[0],
                    index: m['index'] + curPos
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
                        text.length
                    )}`;
                }
            }

            return text;
        }
    },
    template: `
            <div class="chat">
                <help></help>
                <div class="messages" ref="messages" :key="updateCount">
                    <div class="message" v-for="(message, index) in messages" :key="index">
                        <template v-if="timestamp">
                            <span>{{ message.time}}</span> <span :inner-html.prop="message.message | colorify" />
                        </template>
                        <template v-else>
                            <span :inner-html.prop="message.message | colorify" />
                        </template>
                    </div>
                </div>
                <div class="outerInput" v-if="chatActive">
                    <div class="mockInput">{{ matchedCommand !== null ? matchedCommand : '' }}</div>
                    <input
                        class="chatInput" 
                        label="Use '/' to type a command." 
                        ref="chatInput"
                        v-model="currentMessage"
                        @keyup.enter="handleSend" 
                        @keyup.escape="handleEscape"
                        @keyup.up="prevMessage"
                        @keyup.down="nextMessage"
                        @keyup.right="useCommand"
                        @keyup="handleTyping"
                        maxlength="128"
                        v-focus>
                    </input>
                </div>
                <div class="outerInput" v-else>
                    <input class="chatInput-hidden" ref="chatInput" disabled></input>
                </div>
            </div>
        `,
    mounted() {
        if ('alt' in window) {
            alt.on('chat:Append', this.appendMessage);
            alt.on('chat:Focus', this.focusChat);
            alt.on('chat:PopulateCommands', this.populateCommands);
        } else {
            let count = 0;
            setInterval(() => {
                count += 1;
                this.appendMessage(
                    `Message ${count} lore impsum do stuff long words and this is me screaming internally.`
                );
            }, 100);

            setTimeout(() => {
                this.focusChat();
            }, 1000);
        }
    },
    unmounted() {
        alt.log('unmounted functions');

        if ('alt' in window) {
            alt.off('chat:Append', this.appendMessage);
            alt.off('chat:Focus', this.focusChat);
            alt.off('chat:PopulateCommands', this.populateCommands);
        }
    }
});
