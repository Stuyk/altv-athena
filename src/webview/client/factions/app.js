Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            timeout: 0,
            index: 4,
            response: null,
            locales: {},
            faction: {},
            flags: {},
            components: [
                { name: 'Members', component: MembersComponent },
                { name: 'Ranks', component: RanksComponent },
                { name: 'Bank', component: BankComponent },
                { name: 'Options', component: OptionsComponent },
                { name: 'Logs', component: LogComponent }
            ],
            url: 'http://localhost:9111'
        };
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        showResponse(response) {
            if (!response) {
                return;
            }

            this.response = response;

            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            this.timeout = setTimeout(() => {
                clearTimeout(this.timeout);
                this.response = null;
                this.timeout = null;
            }, 3000);
        },
        setFaction(faction) {
            faction.players = faction.players.sort((a, b) => {
                return a.rank - b.rank;
            });

            this.faction = faction;

            if (!this.$refs.pageComponent) {
                return;
            }

            if (this.$refs.pageComponent.factionUpdate) {
                this.$refs.pageComponent.factionUpdate(faction);
            }
        },
        setFlags(flags) {
            this.flags = flags;
        },
        setPage(index) {
            this.index = index;
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
            alt.on('factions:SetFlags', this.setFlags);
            alt.on('factions:Response', this.showResponse);
            alt.on('url', this.setURL);
            alt.emit('factions:Ready');
            alt.emit('ready');
            alt.emit('url');
        } else {
            let players = [
                {
                    name: 'Jane_Dane',
                    id: '608729d7b1f7d6140ca718ac',
                    rank: 0
                },
                {
                    name: 'Some_Person',
                    id: '608729d7b1f7d6140ca718fd',
                    rank: 1,
                    canBeKicked: true,
                    canRankDown: true
                },
                {
                    name: 'Jobi_Jones',
                    id: '608729d7b1f7d6140ca718ad',
                    rank: 1,
                    canBeKicked: true,
                    canRankDown: true
                }
            ];

            for (let i = 0; i < 5; i++) {
                players.forEach((player) => {
                    players.push(player);
                });
            }

            this.setFaction({
                _id: '610b2583173e6d562c301a9d',
                clientID: '610b2583173e6d562c301a9d',
                canAddRanks: true,
                logs: [`[${new Date(Date.now()).toISOString()}] John_Dane - false - whatever...`],
                name: 'Whatever',
                pos: {
                    x: -802.1275024414062,
                    y: -60.06593322753906,
                    z: 37.75537109375,
                    length: 805.2589115022635
                },
                players,
                ranks: [
                    {
                        name: 'Admin',
                        permissions: 1
                    },
                    {
                        name: 'Moderator',
                        permissions: 7972,
                        canRenameRank: true,
                        canMoveRankDown: true,
                        canChangeRankPerms: true
                    },
                    {
                        name: 'Goon',
                        permissions: 2816,
                        canRenameRank: true,
                        canMoveRankUp: true,
                        canRemoveRank: true,
                        canChangeRankPerms: true
                    }
                ],
                canAddToBank: true,
                canRemoveFromBank: true,
                canChangeName: true,
                bank: 0
            });

            // Example Output from Clientside Enum Send
            this.setFlags({
                1: 'SUPER_ADMIN',
                2: 'CHANGE_NAME',
                4: 'CHANGE_MEMBER_RANK',
                8: 'CHANGE_RANK_ORDER',
                16: 'CHANGE_RANK_NAMES',
                32: 'KICK_MEMBER',
                64: 'CREATE_RANK',
                128: 'PREVENT_FACTION_CHAT',
                256: 'ACCESS_STORAGE',
                512: 'ADD_TO_BANK',
                1024: 'REMOVE_FROM_BANK',
                2048: 'ACCESS_WEAPONS',
                4096: 'ADD_MEMBERS',
                8192: 'CHANGE_RANK_PERMS',
                ACCESS_STORAGE: 256,
                ACCESS_WEAPONS: 2048,
                ADD_MEMBERS: 4096,
                ADD_TO_BANK: 512,
                CHANGE_MEMBER_RANK: 4,
                CHANGE_NAME: 2,
                CHANGE_RANK_NAMES: 16,
                CHANGE_RANK_ORDER: 8,
                CHANGE_RANK_PERMS: 8192,
                CREATE_RANK: 64,
                KICK_MEMBER: 32,
                PREVENT_FACTION_CHAT: 128,
                REMOVE_FROM_BANK: 1024,
                SUPER_ADMIN: 1
            });

            this.showResponse({ status: true, response: 'Hello World' });
        }
    }
});
