Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            messages: [],
            input: '',
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
        setActive() {
            this.active = true;

            this.$nextTick(() => {
                this.$refs.chatInput.focus();
            });
        },
        handleSend(e) {
            const message = e.target.value;

            // Clear Old Input
            this.$nextTick(() => {
                this.$refs.chatInput = '';
            });

            // Handle No Message
            if (!message || message === '') {
                this.active = false;
                return;
            }

            // Handle Send Message
            if ('alt' in window) {
                alt.emit('chat:Send', message);
            }
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('chat:Append', this.appendMessage);
        } else {
            let count = 0;
            setInterval(() => {
                count += 1;
                this.appendMessage(`Message ${count}`);
            }, 100);

            setTimeout(() => {
                this.setActive();
            }, 500);
        }
    }
});
