<template>
    <div class="chat-wrapper">
        <div class="chatbox" v-if="showChat">
            <div class="messages pb-2" :style="getChatBoxStyle" :key="updateCount">
                <Message
                    v-for="(msg, index) in getMessages"
                    :key="index"
                    :message="msg.message"
                    :timestamp="msg.timestamp"
                    :useTimestamps="showTimestamp"
                    :fontSize="`${getFontSize}${chatbox.unit}`"
                    :msgSize="msgSize"
                />
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
import { defaultCommands, defaultMessages } from './utility/defaultData';
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
    },
    data() {
        return {
            messages: [],
            commands: [],
            suggestions: [],
            history: [],
            userInput: '',
            chatbox: {
                size: 1.5,
                height: 45,
                width: 45,
                unit: 'vh',
            },
            updateCount: 0,
            pageSize: 5, // Do not exceed 5. 5 is already pushing it.
            page: 1,
            msgSize: 256, // Try not to do anything larger. It won't display right.
            showTimestamp: true,
            showInputBox: false,
            showChat: true,
        };
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
        } else {
            this.setMessages(defaultMessages(), defaultCommands());
            this.showInputBox = true;
        }
    },
    unmounted() {
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
            this.commands = commands;
            this.updateCount += 1;

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

            // Reshow Input Box for Debugging
            if (!('alt' in window)) {
                setTimeout(() => {
                    this.showInputBox = true;
                }, 2000);
            }
        },
        processInput() {
            let message = this.userInput;
            this.userInput = '';
        },
        handleSuggestionTab() {
            this.userInput = `/${this.suggestions[0].name}`;
            this.handleInput();
        },
        handleSuggestionSelect(selected: string) {
            this.userInput = selected;
            this.handleInput();
        },
        handlePress(e) {
            this.updateCount += 1;

            // Escape
            if (e.keyCode === 27) {
                this.hideInput();
            }

            // Enter
            if (e.keyCode === 13) {
                this.processInput();
            }

            // Page Up && Page Down
            if (e.keyCode === 33 || e.keyCode == 34) {
                this.navigatePagination(e.keyCode !== 34);
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
</style>
