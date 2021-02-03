const help = Vue.component('help', {
    data() {
        return {
            helpText: null,
            helpTimeout: null,
            helpState: false
        };
    },
    methods: {
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
    mounted() {
        if ('alt' in window) {
            alt.on('hud:HelpText', this.setHelpText);
            alt.on('hud:HelpState', this.setHelpState);
        } else {
            this.setHelpText(69, 'Short press description go brrr');

            (async () => {
                this.setHelpState(true);
                await sleep(1500);
                this.setHelpState(false);
            })();

            setInterval(async () => {
                this.setHelpText(69, 'Short press description go brrr', 'Long press description go brrr');
                await sleep(250);
                this.setHelpState(true);
                await sleep(1000);
                this.setHelpState(false);
            }, 5000);
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off('hud:HelpText', this.setHelpText);
            alt.off('hud:HelpState', this.setHelpState);
        }
    },
    template: `
        <div class="helpWrapper">
            <template v-if="helpText && helpText.longPress && helpText.longPress !== '' && helpText.longPress !== null">
                <div :class="!helpState ? {'help-fill-bye': true } : { 'help-fill': true }"></div>
            </template>
            <div :class="getHelpTextClasses">
                <div class="help-row" v-if="helpText && helpText.key">
                    <div class="keypress">{{ String.fromCharCode(helpText.key) }}</div>
                    <div class="descriptors">
                        <div class="message" v-if="helpText.shortPress">Press - {{ helpText.shortPress }}</div>
                        <div class="message" v-if="helpText.longPress">Hold - {{ helpText.longPress }}</div>
                    </div> 
                </div>
            </div>
        </div>    
        `
});
