import { shallowRef } from 'vue';
import CharacterCreator from './characterCreator/CharacterCreator.vue';
import CharacterSelect from './characterSelect/CharacterSelect.vue';
import Designs from './designs/Designs.vue';
import Login from './login/Login.vue';
import Atm from './atm/Atm.vue';
import Inventory from './inventory/Inventory.vue';
import Garage from './garage/Garage.vue';
import Storage from './storage/Storage.vue';
import InputBox from './input/InputBox.vue';
import Clothing from './clothing/Clothing.vue';
import Icons from './icons/Icons.vue';
import MultiPageExample from './multiPageExample/MultiPageExample.vue';
import Job from './job/Job.vue';

// Append components here...
// All components that you want to load...
// New interfaces, menus, etc.
const componentList = {
    Atm: shallowRef(Atm),
    CharacterCreator: shallowRef(CharacterCreator),
    CharacterSelect: shallowRef(CharacterSelect),
    Clothing: shallowRef(Clothing),
    Designs: shallowRef(Designs),
    Garage: shallowRef(Garage),
    Icons: shallowRef(Icons),
    InputBox: shallowRef(InputBox),
    Inventory: shallowRef(Inventory),
    Job: shallowRef(Job),
    Login: shallowRef(Login),
    Storage: shallowRef(Storage),
    MultiPageExample: shallowRef(MultiPageExample),
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
    componentList,
};
