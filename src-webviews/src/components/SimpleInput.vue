<template>
    <input
        class="textbox pa-2"
        v-model="text"
        :type="numberOnly ? 'number' : 'text'"
        :placeholder="placeholder"
        @input="handleInput"
    />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Icon from './Icon.vue';

const ComponentName = 'Input';
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
        numberOnly: {
            type: Boolean,
            required: false,
        },
        placeholder: {
            type: String,
            required: false,
        },
        value: [String, Number] as PropType<string | number>,
    },
    methods: {
        handleInput(e: Event) {
            this.$emit('update', this.text);
        },
    },
    mounted() {
        if (this.value) {
            this.text = this.value;
        }
    },
});
</script>
