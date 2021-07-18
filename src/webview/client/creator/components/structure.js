const StructureComponent = Vue.component('structure', {
    props: ['data', 'locales'],
    watch: {
        'data.structure': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        }
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1">
                <template  v-for="(name, index) in locales.structureComponent" :key="index">
                    <div class="group" style="min-height: 35px">
                        <div class="overline pa-0 ma-0 grey--text">
                        {{ locales.structureComponent[index] }}
                        </div>
                    </div>
                    <div class="button-group pa-3 mb-4">
                        <div class="split">
                            <v-chip class="light-blue--text mr-3" label outlined block>
                                {{ parseFloat(data.structure[index]).toFixed(1) }}
                            </v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.structure[index]"/>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    `
});
