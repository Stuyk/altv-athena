<template>
  <h1>Hello from Template!</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'Template';
export default defineComponent({
  name: ComponentName,
  // Used to define state
  data() {
      return {
          //
      }
  },
  // Used to define functions you can call with 'this.x'
  methods: {
      
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
  }
})
</script>

<style scoped>
    
</style>
