Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            previous: [' ', 'alt:V Athena Chat', 'By Stuyk'],
            messages: [],
            currentMessage: '',
            active: false,
            position: 0,
            timestamp: true
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
                alt.emit('chat:Send', message);
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
    mounted() {
        if ('alt' in window) {
            alt.on('chat:Append', this.appendMessage);
            alt.on('chat:Focus', this.focusChat);
        } else {
            let count = 0;
            setInterval(() => {
                count += 1;
                this.appendMessage(
                    `Message ${count} lore impsum do stuff long words holy moley loook at my nice long sentence.`
                );
            }, 100);

            setTimeout(() => {
                this.focusChat();
            }, 500);
        }
    }
});
