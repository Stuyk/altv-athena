<template>
    <div class="whatever">
        Overlays
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const ComponentName = 'Overlays';
export default defineComponent({
  name: ComponentName,
  props: {
      data: Object,
      locales: Object
  }
})
</script>
