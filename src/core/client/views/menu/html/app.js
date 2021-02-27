Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {};
    },
    watch: {},
    methods: {
        setType(name) {
            this.type = name;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.emit('menu:Ready');
            alt.emit('ready');
        }
    }
});
