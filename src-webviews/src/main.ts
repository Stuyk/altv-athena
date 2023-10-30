import { App, createApp } from 'vue';
import ActualApp from './App.vue';
import { VUE_PLUGIN_IMPORTS } from './plugins/vue-plugin-imports.js';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

import Button from './components/Button.vue';
import Choice from './components/Choice.vue';
import ColorSlider from './components/ColorSlider.vue';
import Context from './components/Context.vue';
import DropSlot from './components/DropSlot.vue';
import Frame from './components/Frame.vue';
import Icon from './components/Icon.vue';
import Input from './components/Input.vue';
import Modal from './components/Modal.vue';
import Module from './components/Module.vue';
import RangeInput from './components/RangeInput.vue';
import SimpleInput from './components/SimpleInput.vue';
import Toolbar from './components/Toolbar.vue';
import VueDevMenu from './components/VueDevMenu.vue';

import './main.css';

const MOUNT_DIV_ID = '#app';
let app: App<Element>;

export class ComponentRegistration {
    static init() {
        app = createApp(ActualApp);

        app.use(autoAnimatePlugin);

        app.component('Button', Button);
        app.component('Choice', Choice);
        app.component('ColorSlider', ColorSlider);
        app.component('Context', Context);
        app.component('DropSlot', DropSlot);
        app.component('Frame', Frame);
        app.component('Icon', Icon);
        app.component('Input', Input);
        app.component('Modal', Modal);
        app.component('Module', Module);
        app.component('RangeInput', RangeInput);
        app.component('SimpleInput', SimpleInput);
        app.component('Toolbar', Toolbar);
        app.component('VueDevMenu', VueDevMenu);

        for (let i = 0; i < VUE_PLUGIN_IMPORTS.length; i++) {
            app.use(VUE_PLUGIN_IMPORTS[i]);
        }

        app.mount(MOUNT_DIV_ID);
    }
}

ComponentRegistration.init();
