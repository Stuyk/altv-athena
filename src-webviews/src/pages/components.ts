import { shallowRef } from 'vue';

import Actions from './actions/Actions.vue';
import Audio from './audio/Audio.vue';
import Designs from './designs/Designs.vue';
import Icons from './icons/Icons.vue';
import InputBox from './input/InputBox.vue';
import Job from './job/Job.vue';
import StateTest from './stateTest/StateTest.vue';
import WheelMenu from './wheelMenu/WheelMenu.vue';
import BackgroundImageVue from './background/BackgroundImage.vue';

export const CORE_IMPORTS = {
    Actions: shallowRef(Actions),
    Audio: shallowRef(Audio),
    BackgroundImage: shallowRef(BackgroundImageVue),
    Designs: shallowRef(Designs),
    Icons: shallowRef(Icons),
    InputBox: shallowRef(InputBox),
    Job: shallowRef(Job),
    StateTest: shallowRef(StateTest),
    WheelMenu: shallowRef(WheelMenu),
};
