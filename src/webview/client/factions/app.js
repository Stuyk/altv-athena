Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            locales: {},
            faction: {},
            url: 'http://localhost:9111'
        };
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        setFaction(faction) {
            this.faction = faction;
        },
        exit() {
            if ('alt' in window) {
                alt.emit('factions:Close');
            } else {
                console.log('Exit button go brr');
            }
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            this.exit();
        }
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on('factions:SetFaction', this.setFaction);
            alt.on('factions:SetLocale', this.setLocales);
            alt.on('url', this.setURL);
            alt.emit('factions:Ready');
            alt.emit('ready');
            alt.emit('url');
        }
    }
});
