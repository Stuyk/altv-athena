<template>
    <div>
        <div :class="inputClass" class="input">
            <div class="split">
                <Icon v-if="icon && swapIconSide" class="grey--text pr-4" :size="24" :icon="icon" />
                <div :class="labelClass" class="label overline" v-if="label">
                    {{ label }}
                </div>
                <Icon v-if="icon && !swapIconSide" class="grey--text pr-4" :size="24" :icon="icon" />
            </div>
            <select
                :class="textboxClass"
                class="textbox pa-2"
                v-model="text"
                :placeholder="placeholder"
                @change="handleChange"
            >
                <option v-for="option in options" v-bind:value="option['value']" v-bind:key="option['value']">
                    {{ option['text'] }}
                </option>
            </select>

            <div v-if="errorMessage && stack" class="red--text text--lighten-2 text--subtitle-2 pt-2">
                {{ errorMessage }}
            </div>
        </div>
        <div v-if="errorMessage && !stack" class="red--text text--lighten-2 text--subtitle-2 pt-2">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Icon from './Icon.vue';

const ComponentName = 'Choice';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon,
    },
    data() {
        return {
            text: '',
            errorMessage: null,
        };
    },
    props: {
        options: {
            type: Array,
            required: true,
        },
        placeholder: {
            type: String,
            required: false,
        },
        onInput: {
            type: Function,
            required: true,
        },
        label: {
            type: String,
            required: false,
            default: null,
        },
        stack: {
            type: Boolean,
            required: false,
        },
        icon: {
            type: String,
            required: false,
        },
        rules: {
            type: Array,
            required: false,
        },
        validateCallback: {
            type: Function,
            required: false,
        },
        swapIconSide: {
            type: Boolean,
            required: false,
        },
        value: [String, Number] as PropType<string | number>,
    },
    methods: {
        handleChange() {
            if (!this.onInput) {
                return;
            }

            // Validate Rules
            if (this.rules && Array.isArray(this.rules)) {
                this.errorMessage = null;
                let didPassAll = true;

                for (let i = 0; i < this.rules.length; i++) {
                    const ruleToTest = this.rules[i];
                    if (typeof ruleToTest !== 'function') {
                        continue;
                    }

                    // If there is something returned...
                    // Then give this input an error message and break.
                    const result = ruleToTest(this.text);
                    if (result) {
                        this.errorMessage = result;
                        didPassAll = false;
                        break;
                    }
                }

                //TODO: Choice validation
                if (this.validateCallback && typeof this.validateCallback === 'function') {
                    this.validateCallback(didPassAll);
                }
            }

            this.onInput(this.text);
        },
    },
    computed: {
        inputClass() {
            const classes = {};

            if (this.stack) {
                classes['input-stack'] = true;
            } else {
                classes['input-full-width'] = true;
            }

            return classes;
        },
        labelClass() {
            const classes = {};

            if (!this.stack) {
                classes['pr-2'] = true;
            }

            return classes;
        },
        textboxClass() {
            const classes = {};

            if (!this.stack) {
                classes['textbox-full-width'] = true;
            }

            if (this.stack) {
                classes['mt-2'] = true;
            }

            return classes;
        },
    },
    mounted() {
        if (this.value) {
            this.text = this.value;
        }
    },
});
</script>
