<template>
    <div class="whatever">
        hair
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const ComponentName = 'Hair';
export default defineComponent({
  name: ComponentName,
  props: {
      data: Object,
      locales: Object
  }
})
</script>
