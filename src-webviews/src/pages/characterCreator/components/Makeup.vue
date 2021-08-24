<template>
    <div class="whatever">
        Makeup
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const ComponentName = 'Makeup';
export default defineComponent({
  name: ComponentName,
  props: {
      data: Object,
      locales: Object
  }
})
</script>
