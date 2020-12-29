Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            messages: [],
            currentMessage: '',
            active: false
        };
    },
    methods: {
        appendMessage(msg) {
            this.messages.push(msg);

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
            this.$nextTick(() => {
                this.$refs.currentMessage = '';
            });

            this.active = false;

            if ('alt' in window) {
                alt.emit('chat:Send');
            }
        },
        handleSend(e) {
            const message = e.target.value;
            this.active = false;

            // Clear Old Input
            this.$nextTick(() => {
                this.currentMessage = '';
            });

            // Handle No Message
            if (!message || message === '') {
                alt.emit('chat:Send');
                return;
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
                this.appendMessage(`Message ${count}`);
            }, 100);

            setTimeout(() => {
                this.focusChat();
            }, 500);
        }
    }
});
