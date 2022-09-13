<template>
    <div class="chat-wrapper">
        <div class="chatbox" v-if="showChat">
            <div class="messages" :key="updateCount">
                <Message
                    v-for="(msg, index) in getMessages"
                    :key="index"
                    :message="msg"
                    :useTimestamps="chatbox.timestamp"
                    :fade="chatbox.shouldFade"
                    :msgSize="chatbox.msgLength"
                />
            </div>
            <div class="new-messages split" v-if="page > 1">
                <Icon class="red--text" icon="icon-arrow-down" :shadow="true" :size="14" />
                <span class="red--text new-messages-text">PGDN</span>
            </div>
            <div class="input-holder" v-if="showInputBox">
                <!-- Chat Input Box -->
                <input
                    ref="chatInput"
                    type="text"
                    class="textbox pa-2"
                    v-model="userInput"
                    :style="getInputStyle"
                    placeholder="Say something... or use a command with /"
                    @input="handleInput"
                />
                <!-- Chat Suggestions -->
                <Suggestions
                    v-if="suggestions.length >= 1"
                    :suggestions="suggestions"
                    @suggestion-select="handleSuggestionSelect"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { defaultCommands, defaultMessages, localCommands } from './utility/defaultData';
import Icon from '../../components/Icon.vue';
import RegexData from './utility/regex';
import Message from './components/Message.vue';
import Suggestions from './components/Suggestions.vue';

export const ComponentName = 'Chat';
export default defineComponent({
    name: ComponentName,
    components: {
        Message,
        Suggestions,
        Icon,
    },
    data() {
        return {
            messages: [],
            commands: [],
            suggestions: [],
            history: [],
            userInput: '',
            chatbox: {
                timestamp: true,
                shouldFade: true,
                msgLength: 64,
            },
            historyIndex: -1,
            updateCount: 0,
            pageSize: 11,
            page: 1,
            showInputBox: false,
            showChat: true,
        };
    },
    computed: {
        /**
         * Gets all the messages from pagination.
         *
         * Should always have the newest message as the last element in
         * the array.
         * @return {*}
         */
        getMessages() {
            const paginated = this.paginate(this.messages, this.page).reverse();
            return paginated;
        },
        getChatHeight() {
            return `${this.chatbox.height}${this.chatbox.unit}`;
        },
        getChatWidth() {
            return `${this.chatbox.width}${this.chatbox.unit}`;
        },
        getFontSize() {
            const clientHeight = document.body.clientHeight;
            let fontSize = this.chatbox.size;

            if (clientHeight > 720) {
                fontSize = 1.7;
            }

            if (clientHeight <= 720 && clientHeight > 600) {
                fontSize = 1.6;
            }

            if (clientHeight <= 600) {
                fontSize = 1.8;
            }

            return fontSize;
        },
        getInputStyle() {
            if (!this.showInputBox) {
                return 'opacity: 0 !important;';
            }

            return 'opacity: 1 !important;';
        },
    },
    methods: {
        /**
         * Used to set the messages for state.
         * Messages are stored outside the scope of the CEF.
         *
         * Messages are appended from the front of the array.
         * Means they're inserted in the front.
         * [85, 86, 87, 88, 89... etc]
         */
        setMessages(messages: string, commands: string, history: string) {
            if (!messages) {
                return;
            }

            let _messages;
            try {
                _messages = JSON.parse(messages);
            } catch (err) {
                console.log(err);
                return;
            }

            let splitMessages = [];

            for (let i = 0; i < _messages.length; i++) {
                const timestamp = _messages[i].timestamp;
                const text = _messages[i].message;
                const content = this.chatbox.timestamp ? `${timestamp} ${text}` : text;

                if (content.length < this.chatbox.msgLength) {
                    splitMessages.push(content);
                    continue;
                }

                let firstHalf = content.slice(0, this.chatbox.msgLength);
                let endHalf = content.slice(this.chatbox.msgLength, this.chatbox.msgLength * 2);
                let lastEight = firstHalf.slice(firstHalf.length - 8, firstHalf.length);

                let whatToAppend: string | null = null;
                if (lastEight.includes('{') && !lastEight.includes('}')) {
                    const whatToSlice = lastEight.match(/{+[^}]*}*(?!.*{)/gm);
                    if (whatToSlice && whatToSlice.length >= 1) {
                        firstHalf = firstHalf.slice(0, firstHalf.length - whatToSlice[0].length);
                        whatToAppend = whatToSlice[0];
                    }
                } else {
                    const lastColor = firstHalf.match(/{+[^}]*}*(?!.*{)/gm);
                    if (lastColor && lastColor.length >= 1) {
                        whatToAppend = lastColor[0];
                    }
                }

                const finalHalf = whatToAppend ? `${whatToAppend}${endHalf}` : endHalf;
                splitMessages.push(`${finalHalf}`);
                splitMessages.push(`${firstHalf}-`);
            }

            this.messages = splitMessages;

            // Append Local Commands to Commands
            const cmds = JSON.parse(commands);
            const _cmds = localCommands();
            for (let i = 0; i < _cmds.length; i++) {
                cmds.unshift(_cmds[i]);
            }

            this.commands = cmds;
            this.history = JSON.parse(history);

            this.updateCount += 1;
        },
        /**
         * Splits the array into a smaller format based on the
         * the page variable. Page implies a group of messages
         * with a size that matches the pageSize.
         *
         * 8 messages per page is the default here.
         *
         * Incrementing the page number will show the next
         * group of messages.
         *
         * @param {*} array
         * @param {*} page
         * @return {*}
         */
        paginate(array: Array<string>, page: number, skipFill = false) {
            if (!array || array.length <= 0) {
                return [];
            }

            const pageSize = this.pageSize;
            const results = array.slice((page - 1) * pageSize, page * pageSize);
            if (!skipFill) {
                if (results.length < pageSize) {
                    const appendCount = pageSize - results.length;
                    for (let i = 0; i < appendCount; i++) {
                        results.push('');
                    }
                }
            }

            return results;
        },
        canIncrementPage() {
            const result = this.paginate(this.messages, this.page, true);
            if (result.length < this.pageSize) {
                return false;
            }

            return true;
        },
        navigatePagination(increase: boolean) {
            this.updateCount += 1;

            if (!increase) {
                if (this.page <= 1) {
                    return;
                }

                this.page -= 1;
                return;
            }

            if (!this.canIncrementPage()) {
                return;
            }

            this.page += 1;
        },
        hideInput() {
            this.userInput = '';
            this.showInputBox = false;
            this.suggestions = [];
            document.removeEventListener('keyup', this.handlePress);

            if ('alt' in window) {
                alt.emit(`${ComponentName}:Send`);
            }
        },
        processInput() {
            const originalMessage = this.userInput;
            this.hideInput();
            this.suggestions = [];
            this.page = 1;

            // Append Commands to History
            if (originalMessage.charAt(0) === '/') {
                // Handle Chat Commands
                if (this.isLocalCommand(originalMessage)) {
                    if ('alt' in window) {
                        alt.emit(`${ComponentName}:Send`);
                    }
                    return;
                }

                this.historyIndex = -1;
            }

            // Handle Send Message
            if ('alt' in window) {
                alt.emit(`${ComponentName}:Send`, originalMessage === '' ? null : originalMessage);
            }
        },
        handleShowInput() {
            this.userInput = '';
            this.showInputBox = true;
            this.updateCount += 1;
            this.page = 1;
            document.addEventListener('keyup', this.handlePress);
            this.$nextTick(() => {
                this.$refs.chatInput.focus();
            });
        },
        handleSuggestionTab() {
            this.userInput = `/${this.suggestions[0].name}`;
            this.handleInput();
        },
        handleSuggestionSelect(selected: string) {
            this.userInput = selected;
            this.handleInput();
        },
        /**
         * Use a local command that changes chat parameters.
         * @param {string} message
         * @return {*}
         */
        isLocalCommand(message: string): boolean {
            if (message === '/chatclear' && 'alt' in window) {
                alt.emit(`${ComponentName}:Clear`);
                this.userInput = '';
                this.handleInput();
                if ('alt' in window) {
                    alt.emit(`${ComponentName}:Clear`);
                }
                return true;
            }

            if (message === '/chattimestamp' || message === '/chattimestamps') {
                this.chatbox.timestamp = !this.chatbox.timestamp;
                this.userInput = '';
                this.handleInput();
                if ('alt' in window) {
                    alt.emit(`${ComponentName}:Refresh`);
                }
                return true;
            }

            if (message === '/chatfade') {
                this.chatbox.shouldFade = !this.chatbox.shouldFade;
                this.userInput = '';
                this.handleInput();
                return true;
            }

            if (message === '/chatprint') {
                for (let i = 0; i < this.messages.length; i++) {
                    console.log(this.messages[i]);
                }
                this.userInput = '';
                this.handleInput();
                return true;
            }

            return false;
        },
        unfocusedPress(key: number) {
            this.updateCount += 1;

            // Page Up && Page Down
            if (key === 33 || key == 34) {
                this.navigatePagination(key !== 34);
                return;
            }
        },
        handlePress(e) {
            this.updateCount += 1;

            // Escape
            if (e.keyCode === 27) {
                this.hideInput();
                return;
            }

            // Enter
            if (e.keyCode === 13) {
                this.processInput();
                return;
            }

            // Tab
            if (e.keyCode === 9) {
                this.handleSuggestionTab();
                return;
            }

            // Up Arrow
            if (e.keyCode === 38) {
                if (this.historyIndex + 1 >= this.history.length) {
                    return;
                }

                this.historyIndex += 1;
                this.userInput = this.history[this.historyIndex];
                this.suggestions = [];
                this.handleInput();
                return;
            }

            // Down Arrow
            if (e.keyCode === 40) {
                if (this.historyIndex - 1 <= -1) {
                    this.userInput = '';
                    this.historyIndex = -1;
                    this.handleInput();
                    return;
                }

                this.historyIndex -= 1;
                this.userInput = this.history[this.historyIndex];
                this.handleInput();
                return;
            }

            if (!('alt' in window)) {
                if (e.keyCode === 33 || e.keyCode == 34) {
                    this.navigatePagination(e.keyCode !== 34);
                    return;
                }
            }
        },
        handleInput() {
            this.updateCount += 1;

            if (this.userInput === '') {
                this.suggestions = [];
                return;
            }

            if (this.userInput.charAt(0) !== '/') {
                this.suggestions = [];
                return;
            }

            let parsedCommand = this.userInput
                .replace(RegexData.tagOrComment, '')
                .replace('/</g', '&lt;')
                .replace('/', '')
                .replace(/<\/?[^>]+(>|$)/gm, '');

            const splitInput = parsedCommand.split(' ');
            if (splitInput.length >= 2) {
                parsedCommand = splitInput[0];
            }

            const suggestions = [];
            for (let i = 0; i < this.commands.length; i++) {
                const cmd = this.commands[i];
                if (!cmd.name.includes(parsedCommand)) {
                    continue;
                }

                if (suggestions.length >= 6) {
                    break;
                }

                suggestions.push(cmd);
            }

            this.suggestions = suggestions;
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on(`${ComponentName}:SetMessages`, this.setMessages);
            alt.on(`${ComponentName}:Focus`, this.handleShowInput);
            alt.on(`${ComponentName}:UnfocusedKeyBind`, this.unfocusedPress);
            alt.emit(`${ComponentName}:Ready`);
        } else {
            this.setMessages(JSON.stringify(defaultMessages()), JSON.stringify(defaultCommands()), JSON.stringify([]));
            this.handleShowInput();
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(`${ComponentName}:SetMessages`, this.setMessages);
            alt.off(`${ComponentName}:Focus`, this.handleShowInput);
            alt.off(`${ComponentName}:UnfocusedKeyBind`, this.unfocusedPress);
        }

        document.removeEventListener('keyup', this.handlePress);
    },
});
</script>

<style scoped>
.chat-wrapper {
    display: flex;
    position: absolute;
    width: 100vw;
    height: 100vh;
    align-content: flex-start;
    box-sizing: border-box;
    overflow: hidden !important;
}

.chatbox {
    display: flex;
    flex-direction: column;
    min-width: 450px;
    min-height: 336px; /* Font Size + Message Margin Bottom * Page Size */
    max-height: 336px; /* Font Size + Message Margin Bottom * Page Size */
    margin-left: 1vw;
    margin-top: 2vh;
    justify-content: flex-end;
    box-sizing: border-box;
    position: relative;
}

.messages {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    height: auto;
    text-align: left;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
}

.new-messages {
    position: absolute;
    left: -5px;
    bottom: -12px;
}

.new-messages-text {
    font-size: 12px !important;
    font-weight: 800;
    text-shadow: 1px 1px black;
}

.input-holder {
    position: absolute;
    min-width: 450px;
    max-width: 450px;
    bottom: -50px;
}

.textbox {
    min-width: 450px;
    max-width: 450px;
    overflow: hidden;
}
</style>
