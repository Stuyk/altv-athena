Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            title: 'Input Menu',
            menu: [],
            url: 'http://localhost:9111',
            model: {},
            valid: {}
        };
    },
    methods: {
        setURL(url) {
            if (url.includes('assets/webserver')) {
                this.url = url;
                return;
            }

            this.url = `http://${url}`;
        },
        setMenu(title, menu) {
            this.title = title;

            for (let i = 0; i < this.menu.length; i++) {
                this.model[this.menu[i].id] = '';
            }

            this.menu = menu;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            this.exit();
        },
        exit() {
            if ('alt' in window) {
                alt.emit('input:Close');
            } else {
                console.log('Exit button go brr');
            }
        },
        submit() {
            const menuState = [...this.menu];
            this.showError = false;

            const results = [];
            for (let i = 0; i < menuState.length; i++) {
                menuState[i].showError = false;
                const result = document.getElementById(menuState[i].id).value;

                if (menuState[i].regex) {
                    const regex = new RegExp(menuState[i].regex);
                    if (!regex.test(result)) {
                        menuState[i].showError = true;
                        continue;
                    }
                }

                if (result === '') {
                    results.push({ id: menuState[i].id, value: null });
                    continue;
                }

                results.push({ id: menuState[i].id, value: result });
            }

            this.menu = menuState;

            if (results.length < menuState.length) {
                return;
            }

            if ('alt' in window) {
                alt.emit('input:Submit', results);
            } else {
                console.log(results);
            }
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on('input:SetMenu', this.setMenu);
            alt.on('url', this.setURL);
            alt.emit('input:Ready');
            alt.emit('ready');
            alt.emit('url');
        } else {
            // Dummy Menu Display
            this.setMenu('Generic Example', [
                {
                    id: 'name',
                    desc: 'Your Name',
                    type: 'text',
                    placeholder: 'John_Doe',
                    error: 'Must have underscore. Example: John_Doe',
                    regex: /^([A-Z][a-z]+_[A-Z][a-z]+)$/gm // John_Doe
                },
                {
                    id: 'age',
                    desc: 'Your Age',
                    type: 'number',
                    placeholder: 25,
                    error: 'Value must be between 0 and 100',
                    regex: /^(([2-9][0-9]{1})|(1[8-9]))$/gm // 0 - 100
                },
                {
                    id: 'optional',
                    desc: '*Optional',
                    type: 'text',
                    placeholder: 'Whatever'
                }
            ]);
        }
    }
});
