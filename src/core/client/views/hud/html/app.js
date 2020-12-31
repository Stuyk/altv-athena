Vue.config.devtools = true;
Vue.prototype.window = window;

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

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            previous: [' ', 'alt:V Athena Chat', 'By Stuyk'],
            messages: [],
            commands: [
                { name: 'timestamp', description: '/timestamp - Toggles timestamps.' },
                { name: 'help', description: '/help - List available commands.' }
            ],
            currentMessage: '',
            active: false,
            position: 0,
            timestamp: false,
            matchedCommand: null
        };
    },
    methods: {
        appendMessage(msg) {
            const currentTime = Date.now();
            const date = new Date(currentTime);
            this.messages.push({
                message: msg,
                time: `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
            });

            if (this.messages.length >= 50) {
                this.messages.shift();
            }

            if (!this.active) {
                this.$nextTick(() => {
                    this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
                });
            }
        },
        focusChat() {
            this.active = true;
        },
        handleEscape() {
            this.active = false;
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
            this.active = false;
            this.position = 0;
            this.currentMessage = '';

            // Handle No Message
            if (!message || message === '') {
                alt.emit('chat:Send');
                return;
            }

            if (message === '/timestamp') {
                this.timestamp = !this.timestamp;
                alt.emit('chat:Send');
                this.appendMessage(`You have toggled timestamps.`);
                return;
            }

            if (message === '/help' || message === '/commands') {
                alt.emit('chat:Send');
                for (let i = 0; i < this.commands.length; i++) {
                    this.appendMessage(`${this.commands[i].description}`);
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
            this.currentMessage = this.currentMessage.replace(tagOrComment, '').replace('/</g', '&lt;');

            console.log(this.currentMessage);

            if (this.currentMessage === '' || this.currentMessage.length <= 2) {
                this.matchedCommand = null;
                return;
            }

            const index = this.commands.findIndex(
                (x) => x && x.description && x.description.includes(this.currentMessage)
            );

            if (index <= -1) {
                this.matchedCommand = null;
                return;
            }

            if (this.matchedCommand !== null && this.currentMessage.replace('/', '') === this.commands[index].name) {
                this.matchedCommand = `/${this.commands[index].name}`;
                return;
            }

            this.matchedName = this.commands[index].name;
            this.matchedCommand = this.commands[index].description;
        },
        useCommand() {
            if (this.matchedCommand && this.matchedName) {
                this.currentMessage = `/${this.matchedName}`;
            }
        },
        inject(commands) {
            if (!Array.isArray(commands)) {
                return;
            }

            this.commands = this.commands.concat(commands);
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
    mounted() {
        if ('alt' in window) {
            alt.on('chat:Append', this.appendMessage);
            alt.on('chat:Focus', this.focusChat);
            alt.on('chat:Inject', this.inject);
            alt.emit('chat:Inject');
        } else {
            let count = 0;
            setInterval(() => {
                count += 1;
                this.appendMessage(
                    `{FF0000} Message ${count} lore impsum do {00FF00}stuff long words holy moley {0000FF}loook at my nice long sentence.`
                );
            }, 100);

            setTimeout(() => {
                this.focusChat();
            }, 500);
        }
    }
});
