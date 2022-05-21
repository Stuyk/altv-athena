import { ANIMATION_FLAGS } from '../../../shared/flags/animationFlags';

export default (callback: (...args: any[]) => void) => {
    return [
        {
            name: 'Idle 1',
            callback,
            data: ['anim@heists@heist_corona@team_idles@male_a', 'idle', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Idle 2',
            callback,
            data: ['anim@heists@heist_corona@team_idles@female_a', 'idle', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Idle 3',
            callback,
            data: ['anim@heists@humane_labs@finale@strip_club', 'ped_b_celebrate_loop', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Idle 4',
            callback,
            data: ['anim@mp_celebration@idles@female', 'celebration_idle_f_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Idle 5',
            callback,
            data: ['anim@mp_corona_idles@female_b@idle_a', 'idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Idle 6',
            callback,
            data: ['anim@mp_corona_idles@male_c@idle_a', 'idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Idle 7',
            callback,
            data: ['anim@mp_corona_idles@male_d@idle_a', 'idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Idle 8',
            callback,
            data: ['amb@world_human_hang_out_street@female_hold_arm@idle_a', 'idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Idle 9',
            callback,
            data: ['amb@world_human_hang_out_street@male_b@idle_a', 'idle_b', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Idle 10',
            callback,
            data: ['friends@fra@ig_1', 'base_idle', ANIMATION_FLAGS.REPEAT],
        },
    ];
};
