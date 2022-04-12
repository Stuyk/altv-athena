import { ShallowRef, shallowRef } from 'vue';
import { PLUGIN_IMPORTS } from '../../src/core/plugins/athena/webview/imports';
import { CORE_IMPORTS } from './pages/components';

export class Components {
    static get(asArray = false): Array<{ name: string; component: ShallowRef }> | { [key: string]: ShallowRef } {
        const allComponents = { ...PLUGIN_IMPORTS, ...CORE_IMPORTS };

        console.log(allComponents);

        if (asArray) {
            let componentList = [];
            Object.keys(allComponents).forEach((key) => {
                componentList.push({ name: key, component: allComponents[key] });
            });

            return componentList;
        }

        return allComponents as any;
    }
}
