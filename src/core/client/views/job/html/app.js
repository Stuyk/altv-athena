Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            image: './ref.jpg',
            header: 'Hello World',
            summary: `This is a basic summary example.
                You use can this to set new lines. Also write really awesome text.

                <p style="color: yellow">Start work today!</p>`
        };
    },
    computed: {
        getSummary() {
            return this.summary.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
    },
    methods: {
        setData(jobData) {
            this.image = jobData.image;
            this.header = jobData.header;
            this.summary = jobData.summary;
        },
        select() {
            if ('alt' in window) {
                alt.emit('job:Select');
            }
        },
        exit() {
            if ('alt' in window) {
                alt.emit('job:Exit');
            }
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.emit('ready');
            alt.on('job:Data', this.setData);
        }
    }
});
