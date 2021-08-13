<template>
    <div class="navigation">
        <div v-for="(character, index) in characters" :key="index" class="item">
            <div class="overline red--text">{{ getName(character.name) }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ExCharacter from '../../exampleData/ExCharacter';

const ComponentName = 'CharacterSelect';
export default defineComponent({
  name: ComponentName,
  data() {
      return {
          characterIndex: 0,
          characters: []
      }
  },
  methods: {
      getName(name) {
          return name.replace(/_/g, ' ');
      }
  },
  mounted() {
      if ('alt' in window) {
          //
      } else {
           this.characters = [
                { ...ExCharacter, ...{ appearance: { sex: 0 }, name: 'Ade_Jacbosin' } },
                { ...ExCharacter, ...{ appearance: { sex: 0 }, name: 'Mobi_Jobonai' } },
                { ...ExCharacter, ...{ appearance: { sex: 0 }, name: 'Tony_Jablinski' } }
            ];
      }
  },
  unmounted() {
      if ('alt' in window) {

      }
  }
})
</script>

<style scoped>
.navigation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.6);
}


</style>
