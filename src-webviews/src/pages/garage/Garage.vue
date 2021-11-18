<template>
    <Frame minWidth="500px" maxWidth="500px">
        <template v-slot:toolbar>
            <Toolbar @close-page="relayClosePage" pageName="Garage">Garage</Toolbar>
        </template>
        <template v-slot:content>
            <div class="vehicles">
                <div v-for="(vehicle, index) in vehicles" :key="index" class="mb-4 element">
                    <div class="card">
                        <!-- Preview -->
                        <div class="stack">
                            <div class="preview">
                                <!-- Vehicle Image -->
                                <img :src="`../../assets/vehicles/${vehicle.model}.png`" />
                                <!-- Vehicle Model -->
                                <div class="overline model">{{ vehicle.model }}</div>
                                <!-- Vehicle Plate -->
                                <div class="overline plate">{{ vehicle.plate }}</div>
                                <!-- Vehicle Fuel -->
                                <div class="overline fuel">{{ locales.LABEL_FUEL }}: {{ vehicle.fuel.toFixed(2) }}</div>
                                <!-- Overlay -->
                                <div class="overlay">&nbsp;</div>
                            </div>
                        </div>
                        <!-- Vehicle Controls -->
                        <div class="split split-full">
                            <Button class="mt-2" color="green" @click="spawn(index)" style="width: 100%">
                                {{ locales.LABEL_SPAWN }}
                            </Button>
                            <Button class="mt-2" color="red" @click="despawn(index)" style="width: 100%">
                                {{ locales.LABEL_DESPAWN }}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Frame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '../../components/Icon.vue';
import Button from '../../components/Button.vue';
import Toolbar from '../../components/Toolbar.vue';
import Frame from '../../components/Frame.vue';
import DefaultLocale from './utility/defaultLocale';
import TestData from './utility/testData';

export const ComponentName = 'Garage';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        Toolbar,
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            vehicles: [],
            locales: DefaultLocale,
        };
    },
    methods: {
        relayClosePage(pageName: string) {
            this.$emit('close-page', pageName);
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            this.exit();
        },
        spawn(index) {
            if (!('alt' in window)) {
                console.log(this.vehicles[index]);
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit(`${ComponentName}:Spawn`, this.vehicles[index].id);
        },
        despawn(index: number) {
            if (!('alt' in window)) {
                console.log(this.vehicles[index]);
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit(`${ComponentName}:Despawn`, this.vehicles[index].id);
        },
        setVehicles(vehicles) {
            this.vehicles = vehicles;
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on(`${ComponentName}:SetLocale`, this.setLocales);
            alt.on(`${ComponentName}:SetVehicles`, this.setVehicles);
            alt.emit(`${ComponentName}:Ready`);
            alt.emit('ready');
        } else {
            this.setVehicles(TestData);
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.off(`${ComponentName}:SetLocale`, this.setLocales);
        }
    },
});
</script>

<style scoped>
.card {
    padding: 6px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    width: 100%;
    box-sizing: border-box;
}

.preview {
    display: flex;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-height: 100px;
    max-height: 100px;
    overflow: hidden;
    justify-content: center;
    background: #1a1b20;
    border: 2px solid rgba(255, 255, 255, 0.1);
    margin-top: 6px;
}

.preview img {
    width: 50%;
    align-self: center;
    position: absolute;
    top: -10px;
}

.fuel {
    position: absolute;
    bottom: 5px;
    right: 5px;
    opacity: 0.5;
}

.model {
    position: absolute;
    right: 5px;
    top: 5px;
    opacity: 0.5;
}

.plate {
    position: absolute;
    top: 5px;
    left: 5px;
    opacity: 0.5;
}

.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg,
        rgba(2, 0, 36, 0) 0%,
        rgba(2, 0, 36, 0) 50%,
        rgba(255, 255, 255, 0.05) 50%,
        rgba(0, 212, 255, 0) 100%
    );
}

.vehicles {
    min-width: 400px !important;
    min-height: 50vh !important;
    max-height: 50vh !important;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: none;
    padding-right: 6px;
    padding-left: 6px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}
</style>
