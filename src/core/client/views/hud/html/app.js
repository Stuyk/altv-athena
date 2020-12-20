Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    data() {
        return {
            show: false,
            messages: ["alt:V Athena has Started."]
        };
    },
    computed: {
    },
    methods: {
        appendMessage(message) {
            this.messages.push(message);
            this.scrollToEnd();
        },
        scrollToEnd() {
            const chat = this.$refs.chat;
            if (!chat) {
                return;
            }

            console.log('go bottom');

            chat.scrollTop = chat.scrollHeight;
        }
    },
    mounted() {
        this.$nextTick(() => {
            if ('alt' in window) {
                alt.on('chat:Ready', this.setReady);
            } else {
                this.show = true;

                for (let i = 0; i < 50; i++) {
                    this.appendMessage(`${i} Hello world testing blah blah super long fancy ass message that has some words in it and stuffs.`);
                }
            }

            
        });
    },
    updated() {
        this.scrollToEnd();
    }
});
