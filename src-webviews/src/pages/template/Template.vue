<template>
    <h1>Hello from Template!</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'Template';
export default defineComponent({
    name: ComponentName,
    // Used to add Custom Components
    // Used to define state
    data() {
        return {
            //
        };
    },
    // Called when the page is loaded.
    mounted() {
        // Bind Events to Methods
        if ('alt' in window) {
            // alt.on('x', this.whatever);
            alt.on(`${ComponentName}:SendSomeData`, this.sendSomeData);
            alt.emit(`${ComponentName}:Ready`);
        }

        // Add Keybinds for In-Menu
        document.addEventListener('keyup', this.handleKeyPress);
    },
    // Called when the page is unloaded.
    unmounted() {
        // Make sure to turn off any document events as well.
        // Only if they are present of course.
        // Example:
        // document.removeEventListener('mousemove', this.someFunction)
        if ('alt' in window) {
            alt.off(`${ComponentName}:Close`, this.close);
        }

        // Remove Keybinds for In-Menu
        document.removeEventListener('keyup', this.handleKeyPress);
    },
    // Used to define functions you can call with 'this.x'
    methods: {
        handleKeyPress(e) {
            // Escape Key
            if (e.keyCode === 27 && 'alt' in window) {
                alt.emit(`${ComponentName}:Close`);
            }
        },
        sendSomeData(arg1: string) {
            console.log(arg1);
        },
    },
});
</script>

<style scoped></style>
