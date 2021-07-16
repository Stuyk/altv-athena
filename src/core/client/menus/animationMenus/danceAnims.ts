import { AnimationFlags } from '../../../shared/flags/animation';

export default (callback: Function) => {
    return [
        {
            name: 'Dance F1',
            callback,
            data: [
                'anim@amb@nightclub@dancers@solomun_entourage@',
                'mi_dance_facedj_17_v1_female^1',
                AnimationFlags.REPEAT
            ]
        },
        {
            name: 'Dance F2',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@female@var_a@', 'high_center', AnimationFlags.REPEAT]
        },
        {
            name: 'Dance F3',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@female@var_a@', 'high_center_up', AnimationFlags.REPEAT]
        },
        {
            name: 'Dance F4',
            callback,
            data: [
                'anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity',
                'hi_dance_facedj_09_v2_female^1',
                AnimationFlags.REPEAT
            ]
        },
        {
            name: 'Dance F5',
            callback,
            data: [
                'anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity',
                'hi_dance_facedj_09_v2_female^3',
                AnimationFlags.REPEAT
            ]
        },
        {
            name: 'Dance M1',
            callback,
            data: ['anim@amb@nightclub@dancers@podium_dancers@', 'hi_dance_facedj_17_v2_male^5', AnimationFlags.REPEAT]
        },
        {
            name: 'Dance M2',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@male@var_b@', 'high_center_down', AnimationFlags.REPEAT]
        },
        {
            name: 'Dance M3',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@male@var_a@', 'high_center', AnimationFlags.REPEAT]
        },
        {
            name: 'Dance M4',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@male@var_b@', 'high_center_up', AnimationFlags.REPEAT]
        },
        {
            name: 'Dance M5',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@male@var_b@', 'low_center', AnimationFlags.REPEAT]
        }
    ];
};
