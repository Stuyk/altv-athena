<template>
    <div class="toolbar pa-2">
        <div class="split split-full space-between">
            <span class="grey--text overline">
                <slot/>
            </span>
            <Icon v-if="exitCallback" class="red--text red--hover hover" @click="this.exitCallback" :size="24" icon="icon-times-circle" />
            <Icon v-else class="grey--text text--darken-3" :noSelect="true" :size="24" icon="icon-times-circle" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from './Icon.vue';

const ComponentName = 'Toolbar';
export default defineComponent({
  name: ComponentName,
  components: {
      Icon
  },
  props: {
      exitCallback: {
          type: Function,
          required: false
      },
      text: {
          type: String,
          required: true
      }
  }
})
</script>

<style scoped>
.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    justify-items: center;
    align-items: center;
    align-content: center;
    background: rgba(12, 12, 12, 1) !important;
    border-bottom: 2px solid rgba(24, 24, 24, 1);
    width: 100%;
    box-sizing: border-box;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}
</style>