const actions = Vue.component('actions', {
    data() {
        return {
            history: [],
            historySelections: [],
            actions: [],
            selection: 0
        };
    },
    methods: {
        setActions(menuStructure) {
            this.history = [];
            this.historySelections = [];
            this.selection = 0;

            if (!menuStructure) {
                this.actions = [];
                window.removeEventListener('keydown', this.handleKeyBinds);
                return;
            }

            this.actions = menuStructure;
            window.addEventListener('keydown', this.handleKeyBinds);
        },
        populateActions(actionObject) {
            // { eventName: X, args: [] }
            if (actionObject.eventName) {
                console.log(`${actionObject.eventName} is an action object.`);
                return actionObject;
            }

            const actions = {};
            Object.keys(actionObject).forEach((key) => {
                if (key === 'menuName') {
                    return;
                }

                actions[key] = this.populateActions(actionObject[key]);
            });

            return actions;
        },
        getActions() {
            if (!this.actions) {
                return;
            }

            const actions = Object.keys(this.actions).map((name) => {
                if (this.actions[name].eventName) {
                    return { menuName: name, ...this.actions[name] };
                }

                return { menuName: name, ...this.actions[name] };
            });

            return actions;
        },
        handleKeyBinds(key) {
            const keyCode = key.keyCode;

            // 1 - 9
            if (keyCode >= 49 && keyCode <= 57) {
                const verticalSelection = parseInt(String.fromCharCode(keyCode));
                if (isNaN(verticalSelection)) {
                    return;
                }

                // Subtract 1 for arrays.
                this.processSelection(verticalSelection - 1);
                return;
            }

            // LEFT - Backspace
            if (keyCode === 37 || keyCode === 8) {
                if (this.history.length <= 0) {
                    this.setActions(null);

                    if ('alt' in window) {
                        alt.emit('actions:Close');
                    }
                    return;
                }

                if ('alt' in window) {
                    alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                    alt.emit('actions:Navigate');
                }

                this.actions = this.history.pop();
                this.selection = this.historySelections.pop();
                return;
            }

            // UP
            if (keyCode === 38) {
                if ('alt' in window) {
                    alt.emit('play:Sound', 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                    alt.emit('actions:Navigate');
                }

                this.selection -= 1;
                if (this.selection <= -1) {
                    const actions = this.getActions();

                    if (!actions) {
                        return;
                    }

                    this.selection = actions.length - 1;
                }
                return;
            }

            // RIGHT
            if (keyCode === 39 || keyCode === 13) {
                this.processSelection(null);
                return;
            }

            // Down
            if (keyCode === 40) {
                if ('alt' in window) {
                    alt.emit('play:Sound', 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                    alt.emit('actions:Navigate');
                }

                this.selection += 1;
                if (this.selection >= this.getActions().length) {
                    this.selection = 0;
                }
                return;
            }
        },
        processSelection(keyValue) {
            // When you press the right arrow key.
            // It takes the previous menu and adds pushes it to the back of the array.
            // When you press left it goes through menu history until none are left.
            // Also handles 0 - 9 key press.
            let verticalSelection = keyValue === null ? this.selection : keyValue;
            const actions = this.getActions();
            if (!actions) {
                return;
            }

            const selection = actions[verticalSelection];

            try {
                delete actions[verticalSelection].menuName;
            } catch (err) {
                // Ignore
            }

            if (selection && selection.eventName) {
                this.setActions(null);

                setTimeout(() => {
                    if ('alt' in window) {
                        alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                        alt.emit('actions:Trigger', selection);
                    } else {
                        console.log(selection);
                    }
                }, 200);

                return;
            }

            if ('alt' in window) {
                alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                alt.emit('actions:LeftRight');
            }

            if (verticalSelection <= 0) {
                this.history.push(this.actions);
                this.historySelections.push(verticalSelection);
                this.actions = actions[verticalSelection];
                this.selection = 0;
                return;
            }

            if (!actions[verticalSelection]) {
                return;
            }

            this.history.push(this.actions);
            this.historySelections.push(verticalSelection);
            this.actions = actions[verticalSelection];
            this.selection = 0;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('actions:Set', this.setActions);
        } else {
            this.setActions({
                Vehicle: {
                    'Driver Seat': {
                        eventName: 'seat:Enter',
                        args: [],
                        isServer: true
                    },
                    Doors: {
                        'Driver Door': {
                            eventName: 'door:Open',
                            args: [-1]
                        },
                        'MORE DOORS': {
                            'Driver Door': {
                                eventName: 'door:Open',
                                args: [-1]
                            },
                            'MORE MORE DOORS': {
                                'Driver Door': {
                                    eventName: 'door:Open',
                                    args: [-1]
                                },
                                'MORE MORE MORE DOORS': {
                                    'Driver Door': {
                                        eventName: 'door:Open',
                                        args: [-1]
                                    },
                                    'MORE MORE MORE MORE DOORS': {
                                        'Driver Door': {
                                            eventName: 'door:Open',
                                            args: [-1]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                'Fuel Pump': {
                    'Fill Closest Vehicle': {
                        eventName: 'fuel:Fill',
                        args: []
                    }
                },
                House: {
                    'Enter House': {
                        eventName: 'enter:House',
                        args: []
                    }
                }
            });
        }
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeyBinds);

        if (!('alt' in window)) {
            return;
        }

        alt.off('actions:Set', this.setActions);
    },
    template: `
        <div class="actionsWrapper">
            <div class="actionMenu pa-3" v-if="getActions() && getActions().length >= 1">
                <div class="action pt-2 pb-2 pl-4 pr-4" v-for="(action, index) in getActions()" :key="index" :class="selection === index ? { 'active': true } : {}">
                    <template v-if="selection === index">
                        <span class="light-blue--text text--lighten-2 overline">
                            {{ index + 1 }}.
                        </span>
                        <span class="light-blue--text text--lighten-2 overline">
                            {{ action.menuName }}
                        </span>
                    </template>
                    <template v-else>
                        <span class="overline">
                            {{ index + 1 }}.
                        </span>
                        <span class="overline">
                            {{ action.menuName }}
                        </span>
                    </template>
                </div>
            </div>
        </div>
    `
});
