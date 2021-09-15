<template>
    <div class="whatever">
        Info
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const ComponentName = 'Info';
export default defineComponent({
  name: ComponentName,
  props: {
      data: Object,
      locales: Object
  }
})
</script>
