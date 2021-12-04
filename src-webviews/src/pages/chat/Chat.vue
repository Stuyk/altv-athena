<template>
    <div class="chat-wrapper">
        <div class="chatbox" v-if="showChat">
            <div class="messages pb-2" :style="getChatBoxStyle" :key="updateCount">
                <Message
                    v-for="(msg, index) in getMessages"
                    :key="index"
                    :message="msg.message"
                    :timestamp="msg.timestamp"
                    :useTimestamps="chatbox.timestamp"
                    :fontSize="`${getFontSize}${chatbox.unit}`"
                    :fade="chatbox.shouldFade"
                    :msgSize="chatbox.msgLength"
                />
            </div>
            <!-- Icons for Chat -->
            <div class="chat-info pa-1" v-if="showInputBox">
                <Icon v-if="chatbox.timestamp" icon="icon-watch" :size="16" class="white--text" />
                <Icon v-if="chatbox.shouldFade" icon="icon-sun" :size="16" class="white--text" />
            </div>
            <!-- Chat Input Box -->
            <Input v-if="showInputBox" @input="handleInput" v-model="userInput" @suggestion-tab="handleSuggestionTab" />
            <!-- Chat Suggestions -->
            <Suggestions
                v-if="suggestions.length >= 1"
                :suggestions="suggestions"
                @suggestion-select="handleSuggestionSelect"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { defaultCommands, defaultMessages, localCommands } from './utility/defaultData';
import Icon from '../../components/Icon.vue';
import RegexData from './utility/regex';
import IMessage from './interfaces/IMessage';
import ICommand from './interfaces/ICommand';
import Input from './components/Input.vue';
import Message from './components/Message.vue';
import Suggestions from './components/Suggestions.vue';

export const ComponentName = 'Chat';
export default defineComponent({
    name: ComponentName,
    components: {
        Input,
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
                size: 1.5,
                height: 45,
                width: 45,
                unit: 'vh',
                msgLength: 256,
            },
            historyIndex: -1,
            updateCount: 0,
            pageSize: 5, // Do not exceed 5. 5 is already pushing it.
            page: 1,
            showInputBox: false,
            showChat: true,
        };
    },
    mounted() {
        if ('alt' in window) {
            alt.on(`${ComponentName}:SetMessages`, this.setMessages);
            alt.on(`${ComponentName}:Focus`, this.handleShowInput);
            alt.emit(`${ComponentName}:Ready`);
        } else {
            this.setMessages(defaultMessages(), defaultCommands());
            this.handleShowInput();
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(`${ComponentName}:SetMessages`, this.setMessages);
            alt.off(`${ComponentName}:Focus`, this.handleShowInput);
        }

        document.removeEventListener('keyup', this.handlePress);
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
            return this.paginate(this.messages, this.page).reverse();
        },
        getChatHeight() {
            return `${this.chatbox.height}${this.chatbox.unit}`;
        },
        getChatWidth() {
            return `${this.chatbox.width}${this.chatbox.unit}`;
        },
        getChatBoxStyle() {
            let style = '';

            style += `min-height: ${this.getChatHeight}; max-height: ${this.getChatHeight} !important;`;
            style += `min-width: ${this.getChatWidth}; max-width: ${this.getChatWidth} !important;`;

            return style;
        },
        getFontSize() {
            const clientHeight = document.body.clientHeight;
            let fontSize = this.chatbox.size;

            if (clientHeight <= 720 && clientHeight > 600) {
                fontSize = 1.6;
            }

            if (clientHeight <= 600) {
                fontSize = 1.8;
            }

            return fontSize;
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
        setMessages(messages: Array<IMessage>, commands: Array<ICommand>) {
            this.messages = messages;

            // Append Local Commands to Commands
            const _cmds = localCommands();
            for (let i = 0; i < _cmds.length; i++) {
                commands.unshift(_cmds[i]);
            }

            this.commands = commands;

            let clientHeight = document.body.clientHeight;

            if (clientHeight > 1280) {
                this.pageSize = 5;
            }

            if (clientHeight <= 720 && clientHeight > 600) {
                this.pageSize = 4;
            }

            if (clientHeight <= 600) {
                this.pageSize = 3;
            }

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
        paginate(array: Array<IMessage>, page: number, skipFill = false) {
            if (!array || array.length <= 0) {
                return [];
            }

            const pageSize = this.pageSize;
            const results = array.slice((page - 1) * pageSize, page * pageSize);
            if (!skipFill) {
                if (results.length < pageSize) {
                    const appendCount = pageSize - results.length;
                    for (let i = 0; i < appendCount; i++) {
                        results.push({ message: '', timestamp: '' });
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

            document.removeEventListener('keyup', this.handlePress);
        },
        processInput() {
            const originalMessage = this.userInput;
            this.hideInput();

            // Append Commands to History
            if (originalMessage.charAt(0) === '/') {
                this.history.unshift(originalMessage);
                if (this.history.length > 25) {
                    this.history.pop();
                }

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
            this.showInputBox = true;
            document.addEventListener('keyup', this.handlePress);
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
                alt.emit('chat:Clear');
                this.userInput = '';
                this.handleInput();
                return true;
            }

            if (message === '/chattimestamp' || message === '/chattimestamps') {
                this.chatbox.timestamp = !this.chatbox.timestamp;
                this.userInput = '';
                this.handleInput();
                return true;
            }

            if (message == '/chatfade') {
                this.chatbox.shouldFade = !this.chatbox.shouldFade;
                this.userInput = '';
                this.handleInput();
                return true;
            }

            return false;
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

            // Page Up && Page Down
            if (e.keyCode === 33 || e.keyCode == 34) {
                this.navigatePagination(e.keyCode !== 34);
                return;
            }

            // Up Arrow
            if (e.keyCode === 38) {
                if (this.historyIndex + 1 >= this.history.length) {
                    return;
                }

                this.historyIndex += 1;
                this.userInput = this.history[this.historyIndex];
                this.handleInput();
                return;
            }

            // Down Arrow
            if (e.keyCode === 40) {
                if (this.historyIndex - 1 <= -1) {
                    this.userInput = '';
                    this.historyIndex = -1;
                    return;
                }

                this.historyIndex -= 1;
                this.userInput = this.history[this.historyIndex];
                this.handleInput();
                return;
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

            const parsedCommand = this.userInput
                .replace(RegexData.tagOrComment, '')
                .replace('/</g', '&lt;')
                .replace('/', '');

            const suggestions = [];

            for (let i = 0; i < this.commands.length; i++) {
                const cmd = this.commands[i];
                if (!cmd.description.includes(parsedCommand)) {
                    continue;
                }

                if (suggestions.length >= 6) {
                    break;
                }

                if (cmd.name === parsedCommand) {
                    this.suggestions = [];
                    return;
                }

                suggestions.push(cmd);
            }

            this.suggestions = suggestions;
        },
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
    position: fixed;
    left: 10px;
    top: 150px;
    flex-direction: column;
}

.messages {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow-y: visible;
    box-sizing: border-box;
    flex-grow: 1;
    justify-content: flex-end;
}

.chat-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: center;
    position: absolute;
    background: rgba(0, 0, 0, 0.2);
    bottom: -32px;
    border-radius: 3px;
}
</style>
