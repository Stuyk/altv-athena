<template>
    <input
        class="chatInput pa-1"
        type="text"
        :placeholder="getPlaceholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="forceRefocus"
        @keydown="handleKeyPress"
        ref="chatInput"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const ComponentName = 'ChatInput';
export default defineComponent({
    name: ComponentName,
    props: {
        modelValue: {
            type: String,
            default: '',
            required: true,
        },
    },
    computed: {
        getPlaceholder() {
            return 'Type your message...';
        },
    },
    methods: {
        handleKeyPress(e) {
            if (e.keyCode !== 9) {
                return;
            }

            e.preventDefault();
            this.forceRefocus();

            if (this.modelValue.charAt(0) !== '/') {
                return;
            }

            this.$emit('suggestion-tab');
        },
        forceRefocus(e) {
            if (!e) {
                if (!this.$refs || !this.$refs.chatInput) {
                    return;
                }

                this.$refs.chatInput.focus();
                return;
            }

            e.target.focus();
        },
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$refs || !this.$refs.chatInput) {
                return;
            }

            this.$refs.chatInput.focus();
        });
    },
});
</script>

<style scoped>
.chatInput {
    text-shadow: 1px 1px black;
    display: block;
    font-family: 'Roboto';
    font-size: 16px;
    font-weight: 600;
    color: white;
    background: rgba(0, 0, 0, 0.75);
    border: 2px solid rgba(0, 0, 0, 0.9);
    max-width: 50vw;
}
</style>
