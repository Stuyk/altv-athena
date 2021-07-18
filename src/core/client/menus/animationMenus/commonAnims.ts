import { AnimationFlags } from '../../../shared/flags/animation';

export default (callback: Function) => {
    return [
        {
            name: 'CPR',
            callback,
            data: ['mini@cpr@char_a@cpr_str', 'cpr_pumpchest', AnimationFlags.REPEAT]
        },
        {
            name: 'Uncuff',
            callback,
            data: ['mp_arresting', 'a_uncuff', AnimationFlags.REPEAT]
        },
        {
            name: 'Radio',
            callback,
            data: ['random@arrests', 'generic_radio_chatter', AnimationFlags.REPEAT]
        },
        {
            name: 'Hands Up',
            callback,
            data: ['missminuteman_1ig_2', 'handsup_base', AnimationFlags.REPEAT]
        },
        {
            name: 'Peace',
            callback,
            data: ['mp_player_int_upperpeace_sign', 'mp_player_int_peace_sign', AnimationFlags.REPEAT]
        },
        {
            name: 'Wave 1',
            callback,
            data: ['friends@frj@ig_1', 'wave_a', AnimationFlags.REPEAT]
        },
        {
            name: 'Wave 2',
            callback,
            data: ['friends@frj@ig_1', 'wave_b', AnimationFlags.REPEAT]
        },
        {
            name: 'Hitch Hike',
            callback,
            data: ['random@hitch_lift', 'idle_f', AnimationFlags.STOP_LAST_FRAME | AnimationFlags.ENABLE_PLAYER_CONTROL]
        },
        {
            name: 'Laugh 1',
            callback,
            data: [
                'anim@arena@celeb@flat@paired@no_props@',
                'laugh_a_player_b',
                AnimationFlags.STOP_LAST_FRAME | AnimationFlags.ENABLE_PLAYER_CONTROL
            ]
        },
        {
            name: 'Laugh 2',
            callback,
            data: [
                'anim@arena@celeb@flat@solo@no_props@',
                'giggle_a_player_b',
                AnimationFlags.STOP_LAST_FRAME | AnimationFlags.ENABLE_PLAYER_CONTROL
            ]
        }
    ];
};
