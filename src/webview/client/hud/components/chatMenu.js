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

const ChatComponent = Vue.component('chat', {
    data() {
        return {
            history: [],
            historyIndex: -1,
            commands: [],
            messages: [],
            chatActive: false,
            showTimestamps: true,
            show: false,
            pageSize: 8,
            page: 1,
            updateCount: 0,
            fontSize: 14,
            matchedCommand: '',
            currentMessage: '',
            suggestions: []
        };
    },
    methods: {
        /**
         * Used to set the messages for state.
         * Messages are stored outside the scope of the CEF.
         *
         * Messages are appended from the front of the array.
         * Means they're inserted in the front.
         * [85, 86, 87, 88, 89... etc]
         * @param {Array<{ message: string, timestamp: string }>} messages
         */
        setMessages(messages, commands) {
            this.messages = messages;
            this.commands = commands;
        },
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
        paginate(array, page, skipFill = false) {
            const results = array.slice((page - 1) * this.pageSize, page * this.pageSize);

            if (!skipFill) {
                if (results.length < this.pageSize) {
                    const appendCount = this.pageSize - results.length;
                    for (let i = 0; i < appendCount; i++) {
                        results.push({ message: '', timestamp: '' });
                    }
                }
            }

            return results;
        },
        /**
         * Determine if the pageup/pagedown keys can be used
         * to display the next set of messages in the
         * array.
         * @return {*}
         */
        canIncrementPage() {
            const result = this.paginate(this.messages, this.page, true);
            if (result.length < this.pageSize) {
                return false;
            }

            return true;
        },
        /**
         * Called when the player presses the chat
         * button on the client-side.
         */
        focusChat() {
            this.chatActive = true;
            document.addEventListener('mousedown', this.unfocusChat);

            if ('alt' in window) {
                alt.emit('commands:Update');
            }
        },
        unfocusChat() {
            document.removeEventListener('mousedown', this.focusChat);
            this.chatActive = false;
            this.historyIndex = -1;
            this.currentMessage = '';

            if ('alt' in window) {
                alt.emit('chat:Send');
            }
        },
        handleSend(e) {
            const message = e.target.value;
            this.unfocusChat();

            // Handle No Message
            if (!message || message === '') {
                if ('alt' in window) {
                    alt.emit('chat:Send');
                }
                return;
            }

            // Append Commands to History
            if (message.charAt(0) === '/') {
                this.history.unshift(message);
                if (this.history.length > 25) {
                    this.history.pop();
                }

                // Handle Chat Commands
                if (this.isLocalCommand(message)) {
                    if ('alt' in window) {
                        alt.emit('chat:Send');
                    }
                    return;
                }

                this.historyIndex = -1;
            }

            // Handle Send Message
            if ('alt' in window) {
                alt.emit('chat:Send', message);
            }
        },
        handleTyping() {
            if (!this.chatActive) {
                this.suggestions = [];
                return;
            }

            if (this.currentMessage.charAt(0) !== '/') {
                this.suggestions = [];
                return;
            }

            const parsedCommand = this.currentMessage
                .replace(tagOrComment, '')
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

                suggestions.push(cmd.description);
            }

            this.suggestions = suggestions;
        },
        handleKeybinds(e) {
            // Escape for chat
            if (e.keyCode === 27) {
                if (!this.chatActive) {
                    return;
                }

                this.unfocusChat();
                return;
            }

            // PageUp
            if (e.keyCode === 33) {
                if (!this.canIncrementPage()) {
                    return;
                }

                this.page += 1;
                return;
            }

            // PageDown
            if (e.keyCode === 34) {
                if (this.page === 1) {
                    return;
                }

                this.page -= 1;
                return;
            }

            if (!this.chatActive) {
                return;
            }

            // Up Arrow
            if (e.keyCode === 38) {
                if (this.historyIndex + 1 >= this.history.length) {
                    return;
                }

                this.historyIndex += 1;
                this.currentMessage = this.history[this.historyIndex];
                return;
            }

            // Down Arrow
            if (e.keyCode === 40) {
                if (this.historyIndex - 1 <= -1) {
                    this.currentMessage = '';
                    this.historyIndex = -1;
                    return;
                }

                this.historyIndex -= 1;
                this.currentMessage = this.history[this.historyIndex];
                return;
            }
        },
        /**
         * Use a local command that changes chat parameters.
         * @param {string} message
         * @return {*}
         */
        isLocalCommand(message) {
            if (message === '/clear') {
                if ('alt' in window) {
                    alt.emit('chat:Clear');
                }
                return true;
            }

            if (message.includes('/size')) {
                const args = message.split(' ');
                const size = args[1];

                if (!size) {
                    return false;
                }

                this.fontSize = size;
                return true;
            }

            if (message === '/timestamp' || message === '/timestamps') {
                this.showTimestamps = !this.showTimestamps;
                return true;
            }

            return false;
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
    directives: {
        focus: {
            inserted: (el) => {
                el.focus();
            }
        }
    },
    computed: {
        getFontSize() {
            return { 'font-size': `${this.fontSize}px` };
        },
        hasMatchingCommand() {
            if (this.currentMessage.charAt(0) !== '/') {
                return false;
            }

            return this.commands.find((x) => this.currentMessage.includes(x.description));
        }
    },
    mounted() {
        window.addEventListener('keyup', this.handleKeybinds);

        if ('alt' in window) {
            alt.on('chat:SetMessages', this.setMessages);
            alt.on('chat:Focus', this.focusChat);
            alt.emit('chat:Ready');
            return;
        }

        // Used for debugging messages in CEF.
        const messages = [];
        for (let i = 0; i < 100; i++) {
            if (i < 25) {
                // Color Tests
                messages.push({
                    message: `{FF0000}Message ${i} lore impsum do stuff long words and this is me screaming internally.`,
                    timestamp: '[00:00:00]'
                });
                continue;
            }

            // Normal Tests
            messages.push({
                message: `Message ${i} lore impsum do stuff long words and this is me screaming internally.`,
                timestamp: '[00:00:00]'
            });
        }

        // Reverse the messages to match the client-side.
        this.setMessages(messages.reverse(), [
            { name: 'timestamp', description: '/timestamp - Toggles Timestamps' },
            { name: 'help', description: '/help - List Available Commands' }
        ]);

        setTimeout(() => {
            this.focusChat();
        }, 1000);
    },
    beforeDestroy() {
        window.removeEventListener('keyup', this.handleKeybinds);

        if (!('alt' in window)) {
            return;
        }

        alt.off('chat:Append', this.appendMessage);
        alt.off('chat:Focus', this.focusChat);
        alt.off('chat:PopulateCommands', this.populateCommands);
    },
    template: `
            <div class="chat">
                <div class="messages" ref="messages" :key="updateCount">
                    <div class="message" v-for="(data, index) in getMessages()" :key="index">
                        <div :style="getFontSize">
                            <template v-if="showTimestamps && data.message">
                                <span>{{ data.timestamp }}</span> <span :inner-html.prop="data.message | colorify" />
                            </template>
                            <template v-else-if="!showTimestamps && data.message">
                                <span :inner-html.prop="data.message | colorify" />
                            </template>
                            <template v-else>
                                &nbsp;
                            </template>
                        </div>
                    </div>
                </div>
                <div class="outerInput" v-if="chatActive">
                    <input
                        class="mainChatInput" 
                        label="Use '/' to type a command." 
                        ref="chatInput"
                        id="chatInput"
                        v-model="currentMessage"
                        @keyup.enter="handleSend" 
                        @keyup="handleTyping"
                        maxlength="128"
                        autofocus
                        v-focus>
                    </input>
                    <div class="suggestions" v-if="suggestions.length >= 1">
                        <div class="option" v-for="(option, index) in suggestions" :key="index">
                            {{ option }}
                        </div>
                    </div>
                </div>
                <div class="outerInput" v-else>
                    <input class="chatInput-hidden" ref="chatInput" disabled></input>
                </div>
            </div>
        `
});
