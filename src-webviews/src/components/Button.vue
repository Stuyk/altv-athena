<template>
    <div :class="dynamicClass" @mouseover="playHover" @mouseup="playMouseUp" v-if="!disable">
        <div style="user-select: none !important; pointer-events: none !important;">
            <slot />
        </div>
    </div>
    <div :class="dynamicClass" v-else>
        <div style="user-select: none !important; pointer-events: none !important;">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const ComponentName = 'Button';
export default defineComponent({
  name: ComponentName,
  props: {
      disable: {
          type: Boolean,
          default: false,
      },
      hover: Boolean,
      color: {
          type: String,
          default: 'blue-grey'
      },
      raise: {
          type: Boolean,
          default: true
      },
      flatten: {
          type: Boolean,
          default: false
      },
      glow: {
          type: Boolean,
          default: true
      },
      padding: {
          type: Number,
          default: 3
      },
  },
  methods: {
      async playHover() {
          try {
            const audio = new Audio('/sounds/ui/hover.ogg');
            audio.volume = 0.2;
            await audio.play();
          } catch(err) {
              return;
          }
         
      },
      async playMouseUp() {
          const audio = new Audio('/sounds/ui/click.ogg');
          audio.volume = 0.2;
          await audio.play();
      }
  },
  computed: {
      dynamicClass() {
          const classes = {
              button: true,
              overline: true,
          }

          if (this.padding) {
              classes[`pa-${this.padding}`] = true;
          }

          if (this.disable) {
              classes['disable'] = true;
              return classes;
          }

          classes[`hover`] = true;

          if (this.color) {
              classes[`${this.color}--text`] = true;
          }

          if (this.glow && this.color) {
              classes[`${this.color}--hover`] = true;
          }

          if (this.raise && !this.flatten) {
              classes[`raise`] = true;
          }

          if (!this.raise && this.flatten) {
              classes[`flatten`] = true;
          }

          return classes;
      }
  },
  mounted() {
      this.$nextTick(() => {
           if (this.disable) {
                this.sound = false;
            }
      });
     
  }
})
</script>
