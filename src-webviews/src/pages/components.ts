import { shallowRef } from 'vue';
import CharacterSelect from './characterSelect/CharacterSelect.vue';
import Designs from './designs/Designs.vue';
import Login from './login/Login.vue';

// Append components here...
// All components that you want to load...
// New interfaces, menus, etc.
const componentList = {
    CharacterSelect,
    Designs,
    Login
};

function generateComponentList(): Array<{ name: string; component: unknown }> {
    const components = [];
    Object.keys(componentList).forEach((key) => {
        components.push({ name: key, component: shallowRef(componentList[key]) });
    });

    return components;
}

export default {
    generateComponentList,
    componentList
};
