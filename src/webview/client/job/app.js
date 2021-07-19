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

                <p style="color: yellow">Start work today!</p>`,
            locales: {
                LABEL_DECLINE: 'Decline',
                LABEL_ACCEPT: 'Accept'
            },
            url: 'http://localhost:9111'
        };
    },
    computed: {
        getSummary() {
            return this.summary.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        setData(jobData) {
            this.image = jobData.image;
            this.header = jobData.header;
            this.summary = jobData.summary;
        },
        select() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('job:Select');
        },
        exit() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('job:Exit');
        },
        setLocales(locale) {
            this.locales = locale;
        }
    },
    mounted() {
        if (!('alt' in window)) {
            return;
        }

        alt.on('job:SetLocales', this.setLocales);
        alt.on('job:Data', this.setData);
        alt.emit('ready');
        alt.emit('play:Sound', 'ATM_WINDOW', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        alt.emit('job:Ready');
        alt.on('url', this.setURL);
        alt.emit('url');
    }
});
