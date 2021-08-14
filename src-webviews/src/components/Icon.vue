<template>
    <div class="icon" :class="dynamicClass" :style="dynamicStyle" style="user-select: none !important; pointer-events: none !important;" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const ComponentName = 'Icon';
export default defineComponent({
  name: ComponentName,
  props: {
      icon: {
          type: String,
          required: true
      },
      size: {
          type: Number,
          required: true
      }
  },
  computed: {
      dynamicClass() {
          const classes = {}

          if (!this.icon) {
              classes['icon-not-found'] = true;
              return classes;
          }

          classes[`${this.icon}`] = true;
          return classes;
      },
      dynamicStyle() {
          let style = 'text-align: center !important;';

          if (!this.size) {
              style += ' font-size: 16px !important;';
          } else {
              style += ` font-size: ${this.size}px !important;`;
          }

          return style;
      }
  }
})
</script>
