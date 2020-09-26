Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    data() {
        return {
            show: true,
            url: null,
            message: 'hello from vue',
        };
    },
    methods: {
        onReady(url) {
            this.url = url;
            window.open(this.url);
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on('discord:Ready', this.onReady);
            alt.emit('discord:Load');
        }
    },
});
