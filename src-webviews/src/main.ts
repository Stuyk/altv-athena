import { App, createApp } from 'vue';
import ActualApp from './App.vue';

const MOUNT_DIV_ID = '#app';
let app: App<Element>;

export class ComponentRegistration {
    static init() {
        app = createApp(ActualApp);
        app.mount(MOUNT_DIV_ID);
    }
}

ComponentRegistration.init();
