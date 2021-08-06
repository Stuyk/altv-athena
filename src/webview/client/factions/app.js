Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            index: 0,
            locales: {},
            faction: {},
            components: [
                { name: 'Members', component: MembersComponent },
                { name: 'Ranks', component: RanksComponent },
                { name: 'Bank', component: BankComponent }
            ],
            url: 'http://localhost:9111'
        };
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        setFaction(faction) {
            faction.players = faction.players.sort((a, b) => {
                return a.rank - b.rank;
            });

            this.faction = faction;
        },
        setPage(index) {
            this.index = index;
            console.log(index);
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
        },
        isNavSelected(index) {
            if (this.index === index) {
                return { navitem: true, navselected: true, overline: true };
            }

            return { navitem: true, overline: true };
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
        } else {
            this.setFaction({
                _id: '610b2583173e6d562c301a9d',
                name: 'Whatever',
                logs: [],
                pos: { x: -802.1275024414062, y: -60.06593322753906, z: 37.75537109375, length: 805.2589115022635 },
                players: [
                    { name: 'Jane_Dane', id: '608729d7b1f7d6140ca718aa', rank: 0 },
                    { name: 'Jobi_Jones', id: '608729d7b1f7d6140ca718ac', rank: 2 },
                    { name: 'Jobi_Johan', id: '608729d7b1f7d6140ca718ab', rank: 1 }
                ],
                ranks: [
                    { name: 'Admin', permissions: 1 },
                    { name: 'Moderator', permissions: 1 },
                    { name: 'Goon', permissions: 1 }
                ],
                bank: 0
            });
        }
    }
});
