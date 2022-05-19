import { ANIMATION_FLAGS } from '../../../shared/flags/animationFlags';
import { WheelMenu } from '../../views/wheelMenu';

const getLeanMenu2 = (callback: (...args: any[]) => void) => {
    return [
        {
            name: 'Lean High 1',
            callback,
            data: ['anim@mp_ferris_wheel', 'idle_a_player_one', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean High 2',
            callback,
            data: ['anim@mp_ferris_wheel', 'idle_a_player_two', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean Side 1',
            callback,
            data: ['timetable@mime@01_gc', 'idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean Side 2',
            callback,
            data: ['misscarstealfinale', 'packer_idle_1_trevor', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean Side 3',
            callback,
            data: ['misscarstealfinalecar_5_ig_1', 'waitloop_lamar', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean Side 4',
            callback,
            data: ['rcmjosh2', 'josh_2_intp1_base', ANIMATION_FLAGS.REPEAT],
        },
    ];
};

export default (callback: (...args: any[]) => void) => {
    return [
        {
            name: 'Lean 1',
            callback,
            data: ['amb@world_human_leaning@female@wall@back@hand_up@idle_a', 'idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean 2',
            callback,
            data: ['amb@world_human_leaning@female@wall@back@holding_elbow@idle_a', 'idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean 3',
            callback,
            data: ['amb@world_human_leaning@male@wall@back@foot_up@idle_a', 'idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean 4',
            callback,
            data: ['amb@world_human_leaning@male@wall@back@hands_together@idle_b', 'idle_b', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean 5',
            callback,
            data: ['random@street_race', '_car_a_flirt_girl', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean Bar 1',
            callback,
            data: ['amb@prop_human_bum_shopping_cart@male@idle_a', 'idle_c', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean Bar 2',
            callback,
            data: ['anim@amb@nightclub@lazlow@ig1_vip@', 'clubvip_base_laz', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean Bar 3',
            callback,
            data: ['"anim@heists@prison_heist', 'ped_b_loop_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Lean Bar 4',
            callback,
            data: ['"anim@heists@prison_heist', 'ped_b_loop_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Next',
            callback: () => {
                WheelMenu.update('Lean 2', getLeanMenu2(callback));
            },
        },
    ];
};
