import { DefineComponent, ShallowRef, shallowRef } from 'vue';

import CharacterCreator from './characterCreator/CharacterCreator.vue';
import CharacterSelect from './characterSelect/CharacterSelect.vue';
import Designs from './designs/Designs.vue';
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
import AthenaLogo from './athenaLogo/AthenaLogo.vue';

export const CORE_IMPORTS = {
    Actions: shallowRef(Actions),
    AthenaLogo: shallowRef(AthenaLogo),
    Audio: shallowRef(Audio),
    CharacterCreator: shallowRef(CharacterCreator),
    CharacterSelect: shallowRef(CharacterSelect),
    Chat: shallowRef(Chat),
    Designs: shallowRef(Designs),
    Icons: shallowRef(Icons),
    InputBox: shallowRef(InputBox),
    Inventory: shallowRef(Inventory),
    Job: shallowRef(Job),
    Login: shallowRef(Login),
    Storage: shallowRef(Storage),
    MultiPageExample: shallowRef(MultiPageExample),
};
