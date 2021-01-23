Vue.config.devtools = true;
Vue.prototype.window = window;

const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
const tagOrComment = new RegExp(
    '<(?:' +
        // Comment body.
        '!--(?:(?:-*[^->])*--+|-?)' +
        // Special "raw text" elements whose content should be elided.
        '|script\\b' +
        tagBody +
        '>[\\s\\S]*?</script\\s*' +
        '|style\\b' +
        tagBody +
        '>[\\s\\S]*?</style\\s*' +
        // Regular name
        '|/?[a-z]' +
        tagBody +
        ')>',
    'gi'
);

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            leaderboard: false,
            players: [],
            previous: [' ', 'alt:V Athena Chat', 'By Stuyk'],
            messages: [],
            commands: [
                { name: 'timestamp', description: '/timestamp - Toggles timestamps.' },
                { name: 'help', description: '/help - List all available commands for your permission level.' }
            ],
            currentMessage: '',
            active: false,
            position: 0,
            timestamp: false,
            matchedCommand: null,
            show: false,
            // Help Text
            helpText: null,
            helpTimeout: null,
            helpState: false
        };
    },
    computed: {
        getHelpTextClasses() {
            const data = {};

            if (this.helpText === null) {
                data['help-row-wrapper-null'] = true;
            } else {
                data['help-row-wrapper'] = true;
            }

            return data;
        }
    },
    methods: {
        appendMessage(msg) {
            const currentTime = Date.now();
            const date = new Date(currentTime);
            this.messages.push({
                message: msg,
                time: `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
            });

            // Log Messages to Console
            if ('alt' in window) {
                console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${msg}`);
            }

            if (this.messages.length >= 50) {
                this.messages.shift();
            }

            if (!this.show) {
                return;
            }

            if (!this.active) {
                this.$nextTick(() => {
                    if (!this.$refs || !this.$refs.messages) {
                        return;
                    }

                    this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
                });
            }
        },
        trimDescription(description) {
            if (description.length <= 55) {
                return description;
            }

            return `${description.substr(0, 55)}...`;
        },
        focusChat() {
            this.active = true;
        },
        handleEscape() {
            this.active = false;
            this.position = 0;
            this.currentMessage = '';

            if ('alt' in window) {
                alt.emit('chat:Send');
            }
        },
        prevMessage() {
            if (this.position + 1 > this.previous.length - 1) {
                return;
            }

            this.position += 1;
            this.currentMessage = this.previous[this.position];
        },
        nextMessage() {
            if (this.position - 1 < 0) {
                return;
            }

            this.position -= 1;
            this.currentMessage = this.previous[this.position];
        },
        handleSend(e) {
            const message = e.target.value;
            this.active = false;
            this.position = 0;
            this.currentMessage = '';

            // Handle No Message
            if (!message || message === '') {
                if ('alt' in window) {
                    alt.emit('chat:Send');
                }
                return;
            }

            if (message === '/timestamp') {
                this.timestamp = !this.timestamp;
                this.appendMessage(`You have toggled timestamps.`);

                if ('alt' in window) {
                    alt.emit('chat:Send');
                }
                return;
            }

            if (message === '/help' || message === '/commands') {
                for (let i = 0; i < this.commands.length; i++) {
                    this.appendMessage(`${this.commands[i].description}`);
                }

                if ('alt' in window) {
                    alt.emit('chat:Send');
                }
                return;
            }

            // Appends message to front of array.
            if (!this.previous.includes(message)) {
                this.previous = this.previous.filter((x) => x !== '');
                this.previous.unshift(message);
                this.previous.unshift('');
            }

            // Handle Send Message
            if ('alt' in window) {
                alt.emit('chat:Send', message);
            }
        },
        handleTyping(e) {
            this.currentMessage = this.currentMessage.replace(tagOrComment, '').replace('/</g', '&lt;');

            if (this.currentMessage === '' || this.currentMessage.length <= 2) {
                this.matchedCommand = null;
                return;
            }

            const index = this.commands.findIndex(
                (x) => x && x.description && x.description.includes(this.currentMessage)
            );

            if (index <= -1) {
                this.matchedCommand = null;
                return;
            }

            if (this.matchedCommand !== null && this.currentMessage.replace('/', '') === this.commands[index].name) {
                this.matchedCommand = `/${this.commands[index].name}`;
                return;
            }

            this.matchedName = this.commands[index].name;
            this.matchedCommand = this.trimDescription(this.commands[index].description);
        },
        useCommand() {
            if (this.matchedCommand && this.matchedName) {
                this.currentMessage = `/${this.matchedName}`;
            }
        },
        populateCommands(commands) {
            if (!Array.isArray(commands)) {
                return;
            }

            this.commands = this.commands.concat(commands);
        },
        toggleLeaderboard(validPlayers) {
            this.players = validPlayers;
            this.leaderboard = !this.leaderboard;

            if ('alt' in window) {
                alt.emit('mouse:Focus', this.leaderboard);
            }
        },
        audio3D(soundName, pan, volume, duration = -1) {
            const audio = new Audio(`./sounds/${soundName}.mp3`);
            const ambientContext = new AudioContext();
            const source = ambientContext.createMediaElementSource(audio);
            const ambientPan = ambientContext.createStereoPanner();
            source.connect(ambientPan);
            ambientPan.connect(ambientContext.destination);
            ambientPan.pan.value = pan;

            if (duration >= 0) {
                audio.loop = true;
            } else {
                audio.loop = false;
            }

            audio.volume = volume;
            audio.autoplay = true;
            audio.play();

            if (duration >= 0) {
                setTimeout(() => {
                    audio.pause();
                }, duration);
            }
        },
        setHelpText(key, shortPress, longPress = null) {
            if (!key && this.helpText) {
                this.helpText = null;
                return;
            }

            if (this.helpTimeout) {
                clearTimeout(this.helpTimeout);
                this.helpTimeout = null;
            }

            this.helpTimeout = setTimeout(this.manageHelpTimeout, 1000);

            if (!this.helpText || this.helpText.shortPress !== shortPress || this.helpText.longPress !== longPress) {
                this.helpText = { key, shortPress, longPress };
            }
        },
        manageHelpTimeout() {
            this.helpText = null;
        },
        setHelpState(value) {
            this.helpState = value;
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
    filters: {
        colorify(text) {
            let matches = [];
            let m = null;
            let curPos = 0;

            if (!text) {
                return;
            }

            do {
                m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substr(curPos));

                if (!m) {
                    break;
                }

                matches.push({
                    found: m[0],
                    index: m['index'] + curPos
                });

                curPos = curPos + m['index'] + m[0].length;
            } while (m != null);

            if (matches.length > 0) {
                text += '</font>';

                for (let i = matches.length - 1; i >= 0; --i) {
                    let color = matches[i].found.substring(1, matches[i].found.length - 1);
                    let insertHtml = `${i !== 0 ? '</font>' : ''}<font color="#${color}">`;
                    text = `${text.slice(0, matches[i].index)}${insertHtml}${text.slice(
                        matches[i].index + matches[i].found.length,
                        text.length
                    )}`;
                }
            }

            return text;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('chat:Append', this.appendMessage);
            alt.on('chat:Focus', this.focusChat);
            alt.on('chat:PopulateCommands', this.populateCommands);
            alt.on('leaderboard:Toggle', this.toggleLeaderboard);
            alt.on('hud:Audio3D', this.audio3D);
            alt.on('hud:HelpText', this.setHelpText);
            alt.on('hud:HelpState', this.setHelpState);
        } else {
            let count = 0;
            setInterval(() => {
                count += 1;
                this.appendMessage(
                    `Message ${count} lore impsum do stuff long words holy moley loook at my nice long sentence.`
                );
            }, 100);

            setTimeout(() => {
                this.focusChat();
            }, 1000);

            this.players = [
                { name: 'Johnny_Joe', ping: 25, id: 0, distance: 25 },
                { name: 'Jobi_Jobanni', ping: 60, id: 1, distance: 30 }
            ];

            for (let i = 0; i < 5; i++) {
                this.players = [...this.players, ...this.players];
            }

            this.setHelpText(69, 'Short press description go brrr');

            (async () => {
                console.log('add');
                this.setHelpState(true);
                await sleep(1500);
                console.log('remove');
                this.setHelpState(false);
            })();

            setInterval(async () => {
                this.setHelpText(69, 'Short press description go brrr', 'Long press description go brrr');

                await sleep(1000);
                this.setHelpState(true);
                await sleep(1000);
                this.setHelpState(false);
            }, 7000);
        }

        this.$nextTick(() => {
            this.show = true;
        });
    }
});
