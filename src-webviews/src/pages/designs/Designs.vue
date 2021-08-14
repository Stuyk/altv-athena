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
                <Button color="blue" :callback="clickMe">
                    <Icon class="blue--text" :size="16" icon="icon-chevron-left" />
                </Button>
                <Button color="blue" :callback="clickMe">
                    <Icon class="blue--text" :size="16" icon="icon-chevron-right" />
                </Button>
                <Button color="red" :callback="clickMe">
                    <Icon class="red--text" :size="32" icon="icon-cancel" />
                </Button>
                <Button color="green" :callback="clickMe">
                    <Icon class="green--text" :size="64" icon="icon-checkmark" />
                </Button>
                <Icon class="grey--text" :size="16" icon="icon-laptop" />
                <Icon class="grey--text" :size="32" icon="icon-server" />
                <Icon class="grey--text" :size="64" icon="icon-user" />
            </div>
            <h2 class="grey--text text--lighten-2">Input Boxes</h2>
            <h4 class="grey--text text--lighten-2">Basic</h4>
            <Input  
                :stack="true" 
                :onInput="onInputChange" 
                placeholder="Input First Name..."
            />
            <h4 class="grey--text text--lighten-2">Basic Unstacked</h4>
            <Input 
                label="First Name" 
                :stack="false" 
                :onInput="onInputChange" 
                placeholder="Hello World" 
            />
            <h4 class="grey--text text--lighten-2">Advanced with Rules</h4>
            <Input 
                label="Age" 
                :numberOnly="true" 
                :stack="false" 
                :onInput="ageInputChange"
                :validateCallback="ageValidCallback"
                :value="5"
                :rules="[
                    (text) => { return parseInt(text) >= 18 ? null : 'Age must be at least 18' },
                    (text) => { return parseInt(text) <= 99 ? null : 'Age cannot exceed 99' },
                ]"
                icon="icon-question"
                placeholder="25..." 
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Input from '../../components/Input.vue';
import Button from '../../components/Button.vue';
import Icon from '../../components/Icon.vue';

const ComponentName = 'Designs';
export default defineComponent({
  name: ComponentName,
  data() {
      return {
          ageValid: false
      }
  },
  components: {
      Button,
      Icon,
      Input
  },
  methods: {
      clickMe(e) {
          console.log(e);
      },
      onInputChange(text: string) {
          console.log(text);
      },
      ageValidCallback(valid: boolean) {
          this.ageValid = valid;
          console.log(`Is Age Valid: ${this.ageValid}`);
      },
      ageInputChange(text: string) {
          console.log(`Age Input as: ${text}`);
      }
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
