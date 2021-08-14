<!--
This is just a way to see all the different .css designs setup already.

Helpful for seeing what default components look like.

-->

<template>
    <div class="background">
        
        <div class="stack">
            <h2 class="grey--text text--lighten-2">Buttons</h2>
            <div class="split space-between">
                <Button color="green" :callback="clickMe">Accept</Button>
                <Button color="blue" :callback="clickMe">Submit</Button>
                <Button color="amber" :callback="clickMe">Warning</Button>
                <Button color="red" :callback="clickMe">Cancel</Button>
                <Button :disable="true">Disabled</Button>
                <Button color="green" :raise="false" :flatten="true" :callback="clickMe">Accept</Button>
                <Button color="blue" :raise="false" :flatten="true" :callback="clickMe">Submit</Button>
                <Button color="amber" :raise="false" :flatten="true" :callback="clickMe">Warning</Button>
                <Button color="red" :raise="false" :flatten="true" :callback="clickMe">Cancel</Button>
            </div>
            <h2 class="grey--text text--lighten-2">Icons</h2>
            <div class="split space-between">
                <Button color="grey" :callback="clickMe">
                    <v-icon>icon-chevron-left</v-icon>
                </Button>
            </div>
        </div>
    </div>

    
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from '../../components/Button.vue';

const ComponentName = 'Designs';
export default defineComponent({
  name: ComponentName,
  components: {
      Button
  },
  methods: {
      clickMe(e) {
          console.log(e);
      }
  },
  data() {
      return {}
  },
})
</script>

<style scoped>
.background {
    display: block;
    position: relative;
    min-height: 100vh;
    min-width: 100vw;
    background: rgba(0, 0, 0, 0.95);
    padding: 25px;
    box-sizing: border-box;
}


</style>
