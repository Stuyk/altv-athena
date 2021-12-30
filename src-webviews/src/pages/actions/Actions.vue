<template>
    <div class="actionsWrapper">
        <div class="actionMenu pa-3" v-if="getActions() && getActions().length >= 1">
            <div
                class="action pt-2 pb-2 pl-4 pr-4"
                v-for="(action, index) in getActions()"
                :key="index"
                :class="selection === index ? { active: true } : {}"
            >
                <template v-if="selection === index">
                    <span class="amber--text text--lighten-2"> {{ index + 1 }}. </span>
                    <span class="amber--text text--lighten-2">
                        {{ action.menuName }}
                    </span>
                </template>
                <template v-else>
                    <span> {{ index + 1 }}. </span>
                    <span>
                        {{ action.menuName }}
                    </span>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IAction from './interfaces/IAction';
import DefaultData from './utility/defaultData';

const ComponentName = 'Actions';
export default defineComponent({
    name: ComponentName,
    components: {},
    data() {
        return {
            history: [],
            historySelections: [],
            actions: [],
            selection: 0,
        };
    },
    mounted() {
        if ('alt' in window) {
            alt.on(`${ComponentName}:Set`, this.setActions);
            alt.on(`${ComponentName}:KeyPress`, this.handleKeyBinds);
            alt.emit(`${ComponentName}:Ready`);
        } else {
            this.setActions(DefaultData);
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(`${ComponentName}:Set`, this.setActions);
            alt.off(`${ComponentName}:KeyPress`, this.handleKeyBinds);
        }
    },
    methods: {
        setActions(menuStructure: { [key: string]: IAction }) {
            this.history = [];
            this.historySelections = [];
            this.selection = 0;

            window.focus();

            if (!menuStructure) {
                this.actions = [];
                return;
            }

            this.actions = menuStructure;
        },
        populateActions(actionObject) {
            // { eventName: X, args: [] }
            if (actionObject.eventName) {
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
                return [];
            }

            const actions = Object.keys(this.actions).map((name) => {
                if (this.actions[name].eventName) {
                    return { menuName: name, ...this.actions[name] };
                }

                return { menuName: name, ...this.actions[name] };
            });

            return actions;
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
                if ('alt' in window) {
                    alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                    alt.emit(`${ComponentName}:Trigger`, selection);
                }
                return;
            }

            if ('alt' in window) {
                alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
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
        },
        handleKeyBinds(keyCode: number) {
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
                        alt.emit(`${ComponentName}:Close`);
                    }
                    return;
                }

                if ('alt' in window) {
                    alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                }

                this.actions = this.history.pop();
                this.selection = this.historySelections.pop();
                return;
            }

            // UP
            if (keyCode === 38) {
                if ('alt' in window) {
                    alt.emit('play:Sound', 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
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

            // RIGHT - Enter
            if (keyCode === 39 || keyCode === 13) {
                this.processSelection(null);
                return;
            }

            // Down
            if (keyCode === 40) {
                if ('alt' in window) {
                    alt.emit('play:Sound', 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                }

                this.selection += 1;
                if (this.selection >= this.getActions().length) {
                    this.selection = 0;
                }
                return;
            }
        },
    },
});
</script>

<style scoped>
.actionsWrapper {
    position: fixed;
    bottom: 15vh;
    min-width: 100vw;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
}

.actionsWrapper .actionMenu {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    max-width: 600px;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    user-select: none;
    font-family: 'Barlow Semi Condensed', sans-serif;
    font-weight: 600;
    font-size: 16px;
}

.actionsWrapper .actionMenu .action {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.actionsWrapper .actionMenu .active {
    background: rgba(25, 25, 25, 0.25);
}
</style>
