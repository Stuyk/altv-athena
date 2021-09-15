<template>
    <div class="whatever">
        structure
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const ComponentName = 'Structure';
export default defineComponent({
  name: ComponentName,
  props: {
      data: Object,
      locales: Object
  }
})
</script>
