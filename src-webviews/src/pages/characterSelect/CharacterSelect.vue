<template>
    <div class="container">
        <div class="nav-container">
            <div class="navigation center pa-8" v-if="characters">
                <Button color="blue" @click="decrementIndex">
                    <Icon class="blue--text" :size="32" icon="icon-chevron-left" />
                </Button>
                <div class="grey--text text--lighten-2" style="font-size: 24px">
                    {{ getName }}
                </div>
                <Button color="blue" @click="incrementIndex">
                    <Icon class="blue--text" :size="32" icon="icon-chevron-right" />
                </Button>
            </div>
        </div>
        <div class="stats pt-8 pb-8">
            <div class="stat split split-full split-center pl-6 pr-6">
                <Icon class="grey--text text--lighten-2" :noSelect="true" :size="18" icon="icon-clock"></Icon>
                <span class="overline amber--text pl-6" style="font-size: 16px !important"> {{ getHours }} Hours </span>
            </div>
            <div class="stat split split-full split-center pt-6 pl-6 pr-6">
                <Icon class="grey--text text--lighten-2" :noSelect="true" :size="18" icon="icon-wallet"></Icon>
                <span class="overline amber--text pl-6" style="font-size: 16px !important"> ${{ getCash }} </span>
            </div>
            <div class="stat split split-full split-center pt-6 pl-6 pr-6">
                <Icon class="grey--text text--lighten-2" :noSelect="true" :size="18" icon="icon-bank"></Icon>
                <span class="overline amber--text pl-6" style="font-size: 16px !important"> ${{ getBank }} </span>
            </div>
        </div>
        <div class="options">
            <!-- Delete Character -->
            <Button color="red" @click="showDeleteInterface">
                <Icon class="red--text" :size="36" icon="icon-delete" />
            </Button>

            <!-- Create Character -->
            <Button class="mt-6" color="green" @click="newCharacter">
                <Icon class="green--text" :size="36" icon="icon-plus" />
            </Button>

            <!-- Select Character -->
            <Button class="mt-6" color="blue" @click="selectCharacter">
                <Icon class="blue--text" :size="36" icon="icon-checkmark" />
            </Button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ExCharacter from '../../exampleData/ExCharacter';
import Button from '../../components/Button.vue';
import Icon from '../../components/Icon.vue';

const ComponentName = 'CharacterSelect';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Icon
    },
    data() {
        return {
            characterIndex: 0,
            characters: [],
            statNames: [],
            deleteDialog: false,
            locales: {
                LABEL_DELETE: 'Delete',
                LABEL_NEW: 'New',
                LABEL_SELECT: 'Select',
                LABEL_YES: 'Yes',
                LABEL_NO: 'No',
                LABEL_CONFIRM_DELETE: 'Are you sure you want to delete your character',
                LABEL_NAME: 'Name',
                LABEL_AGE: 'Age',
                LABEL_GENDER: 'Gender',
                LABEL_HOURS: 'Hours',
                LABEL_CASH: 'Cash',
                LABEL_BANK: 'Bank'
            }
        };
    },
    computed: {
        getName() {
            if (!this.characters[this.characterIndex]) {
                return '';
            }

            return this.characters[this.characterIndex].name.replace(/_/g, ' ');
        },
        getHours() {
            if (!this.characters[this.characterIndex]) {
                return '';
            }

            return this.characters[this.characterIndex].hours.toFixed(2);
        },
        getBank() {
            if (!this.characters[this.characterIndex]) {
                return '';
            }

            return this.characters[this.characterIndex].bank.toFixed(2);
        },
        getCash() {
            if (!this.characters[this.characterIndex]) {
                return '';
            }

            return this.characters[this.characterIndex].cash.toFixed(2);
        }
    },
    methods: {
        handleSet(characters) {
            this.characterIndex = 0;
            this.characters = characters;

            console.log('Characters were set')
            this.updateAppearance();
        },
        incrementIndex() {
            this.characterIndex += 1;
            if (this.characterIndex > this.characters.length - 1) {
                this.characterIndex = 0;
            }
            this.updateAppearance();

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        decrementIndex() {
            this.characterIndex -= 1;
            if (this.characterIndex <= -1) {
                this.characterIndex = this.characters.length - 1;
            }
            this.updateAppearance();

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        updateAppearance() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('characters:Update', this.characters[this.characterIndex].appearance);

            setTimeout(() => {
                alt.emit('characters:Equipment', this.characters[this.characterIndex].equipment);
            }, 100);
        },
        selectCharacter() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('characters:Select', this.characters[this.characterIndex]._id);
        },
        newCharacter() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('characters:New');
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        showDeleteInterface() {
            this.deleteDialog = true;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        hideDeleteInterface() {
            this.deleteDialog = false;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        deleteCharacter() {
            this.deleteDialog = false;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('characters:Delete', this.characters[this.characterIndex]._id);
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        setLocales(localeObject) {
            this.locales = localeObject;
            this.updateLocales(true);
        },
        updateLocales(skipDefault = false) {
            this.statNames = [
                /* Name of the stat, variable name inside character object */
                { varName: this.locales.LABEL_NAME, varRef: 'name' },
                { varName: this.locales.LABEL_AGE, varRef: 'age', useInfo: true },
                { varName: this.locales.LABEL_GENDER, varRef: 'gender', useInfo: true },
                { varName: this.locales.LABEL_HOURS, varRef: 'hours' },
                { varName: this.locales.LABEL_CASH, varRef: 'cash', prefix: '$' },
                { varName: this.locales.LABEL_BANK, varRef: 'bank', prefix: '$' }
            ];
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('characters:SetLocale', this.setLocales);
            alt.on('characters:Set', this.handleSet);
            alt.emit('characters:Ready');
        } else {
            this.characters = [
                {
                    ...ExCharacter,
                    ...{ appearance: { sex: 0 }, name: 'Ade_Jacbosin', bank: 25000, cash: 25, hours: 100 }
                },
                {
                    ...ExCharacter,
                    ...{ appearance: { sex: 0 }, name: 'Mobi_Jobonai', bank: 26000, cash: 35, hours: 255 }
                },
                {
                    ...ExCharacter,
                    ...{ appearance: { sex: 0 }, name: 'Tony_Jablinski', bank: 21111, cash: 409, hours: 69 }
                }
            ];
        }

        this.updateLocales();
    },
    unmounted() {
        if ('alt' in window) {
            alt.off('characters:SetLocale', this.setLocales);
            alt.off('characters:Set', this.handleSet);
        }
    }
});
</script>

<style scoped>
.container {
    display: block;
    position: absolute;
    /* background: black; */
    width: 100%;
    height: 100%;
}

.navigation {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: 40vw;
    max-width: 40vw;
    box-sizing: border-box;
    text-shadow: 0px 0px 1px black, 0px 0px 4px black;
    bottom: 0px;
    margin: 0 auto;
}

.nav-container {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    justify-items: center;
    min-width: 100vw;
    max-width: 100vw;
}

.stats {
    position: fixed;
    display: flex !important;
    flex-direction: column;
    justify-items: flex-start !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    align-content: flex-start !important;
    background: rgba(11, 11, 11, 1);
    box-sizing: border-box;
    min-width: 350px;
    max-width: 350px;
    border: 2px solid rgba(32, 32, 32, 1);
    overflow: hidden;
    bottom: 32px;
    left: 32px;
}

.stat {
    box-sizing: border-box;
}

.options {
    position: fixed;
    display: flex !important;
    flex-direction: column;
    justify-items: flex-start !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    align-content: flex-start !important;
    box-sizing: border-box;
    min-height: 25px;
    bottom: 32px;
    right: 32px;
}
</style>
