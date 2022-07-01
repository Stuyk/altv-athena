import { App, createApp } from 'vue';
import ActualApp from './App.vue';
import { VUE_PLUGIN_IMPORTS } from './plugins/vue-plugin-imports';

const MOUNT_DIV_ID = '#app';
let app: App<Element>;

export class ComponentRegistration {
    static init() {
        app = createApp(ActualApp);
        for (let i = 0; i < VUE_PLUGIN_IMPORTS.length; i++) {
            app.use(VUE_PLUGIN_IMPORTS[i]);
        }
        app.mount(MOUNT_DIV_ID);
    }
}

ComponentRegistration.init();
