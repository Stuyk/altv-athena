import { shallowRef } from 'vue';
import Atm from './atm/Atm.vue';
import CharacterCreator from './characterCreator/CharacterCreator.vue';
import CharacterSelect from './characterSelect/CharacterSelect.vue';
import Clothing from './clothing/Clothing.vue';
import Designs from './designs/Designs.vue';
import Garage from './garage/Garage.vue';
import Icons from './icons/Icons.vue';
import InputBox from './input/InputBox.vue';
import Inventory from './inventory/Inventory.vue';
import Job from './job/Job.vue';
import Login from './login/Login.vue';
import MultiPageExample from './multiPageExample/MultiPageExample.vue';
import Storage from './storage/Storage.vue';
import Chat from './chat/Chat.vue';
import Hud from './hud/Hud.vue';
import Audio from './audio/Audio.vue';
import Actions from './actions/Actions.vue';
import PaintShop from './paintshop/PaintShop.vue';
import AthenaLogo from './athenaLogo/AthenaLogo.vue';
import ShopUI from './shopUI/ShopUI.vue';
// import Factions from './factions/Factions.vue';

// Append components here...
// All components that you want to load...
// New interfaces, menus, etc.
const componentList = {
    Actions: shallowRef(Actions),
    AthenaLogo: shallowRef(AthenaLogo),
    Atm: shallowRef(Atm),
    Audio: shallowRef(Audio),
    CharacterCreator: shallowRef(CharacterCreator),
    CharacterSelect: shallowRef(CharacterSelect),
    Chat: shallowRef(Chat),
    Clothing: shallowRef(Clothing),
    Designs: shallowRef(Designs),
    // Factions: shallowRef(Factions),
    ShopUI: shallowRef(ShopUI),
    Garage: shallowRef(Garage),
    Hud: shallowRef(Hud),
    Icons: shallowRef(Icons),
    InputBox: shallowRef(InputBox),
    Inventory: shallowRef(Inventory),
    Job: shallowRef(Job),
    Login: shallowRef(Login),
    PaintShop: shallowRef(PaintShop),
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
