<template>
    <div class="wrapper">
        <span class="green--text">{{ increment }}</span>
        <Button class="mt-4" color="blue" @click="someMethodName"> Add </Button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../../components/Button.vue';
import Frame from '../../components/Frame.vue';
import Icon from '../../components/Icon.vue';
import Input from '../../components/Input.vue';
import Modal from '../../components/Modal.vue';
import Module from '../../components/Module.vue';
import RangeInput from '../../components/RangeInput.vue';
import Toolbar from '../../components/Toolbar.vue';

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'Template';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        Input,
        Modal,
        Module,
        RangeInput,
        Toolbar,
    },
    // Used to define state
    data() {
        return {
            increment: 0,
        };
    },
    // Used to define functions you can call with 'this.x'
    methods: {
        someMethodName() {
            this.increment += 1;
        },
    },
    // Called when the page is loaded.
    mounted() {
        // Bind Events to Methods
        if ('alt' in window) {
            // alt.on('x', this.whatever);
        }
    },
    // Called when the page is unloaded.
    unmounted() {
        // Unbind Events from the Mounted Function
        if ('alt' in window) {
            // alt.off('x', this.whatever);
        }

        // Make sure to turn off any document events as well.
        // Only if they are present of course.
        // Example:
        // document.removeEventListener('mousemove', this.someFunction)
    },
});
</script>

<style scoped></style>
